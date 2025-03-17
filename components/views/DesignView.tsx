import { CanvasElement } from '@/types/canvas'
import { Component, FC, useEffect, useState } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'
import * as antd from 'antd'
import { Skeleton, Spin, Tabs } from 'antd'
import * as Babel from '@babel/standalone';
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as antdIcons from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons'

interface DesignViewProps {  
  pages: Record<string, {
    order: number;
    layout: string;
    components: string[];
  }>
  stylesheet: string
  onElementClick?: (id: string) => void
  activeElement?: string | null
  showProgress: string | null
  isGenerating: boolean
}
// Declare window interfaces to fix TypeScript errors
declare global {
  interface Window {
    React: typeof React;
    antd: typeof antd;
    antdIcons: typeof antdIcons;
    Component: any;
    [key: string]: any;
  }
}

if (typeof window !== 'undefined') {
  window.React = React;
  window.antd = antd;
  window.antdIcons = antdIcons;
}

const titleToId = (title: string) => {
  const words = title.split(/[^a-zA-Z0-9]+/);
  return 'Component' + words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

export const DesignView: FC<DesignViewProps> = ({
  pages = {},
  stylesheet = { classes: [], stylesheet: '' },
  onElementClick,
  activeElement,
  showProgress,
  isGenerating
}) => {

  const [activePage, setActivePage] = useState(Object.keys(pages)[0] || '');
  const [renderedPages, setRenderedPages] = useState<Record<string, boolean>>({});

  const addComponentScript = async (code: string, elementId: string) => {
    try {
      const response = await fetch('/api/bundler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          options: {
            minify: false,
          },
        }),
      });

      const { bundledCode } = await response.json();

      // Execute the code directly instead of waiting for onload
      try {
        const scriptContent = `
          window.${elementId} = (function() {
            ${bundledCode}
            return Component;
          })();
        `;
        eval(scriptContent);
        setRenderedPages(prev => ({
          ...prev,
          [elementId]: true
        }));
        return Promise.resolve();
      } catch (e) {
        console.error("Error in bundled code:", e);
        return Promise.reject(e);
      }
    } catch (error) {
      console.error("Error adding component script:", error);
      return Promise.reject(error);
    }
  }

  const compileAndRenderComponent = async (code: string, elementId: string) => {
    try {
      await addComponentScript(code, elementId);
      // Now the Component should be available as a global variable
      const PageComponent = window?.[elementId]?.default || window?.[elementId];

      // Get the root element
      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        // Clear any existing content
        rootElement.innerHTML = '';
        // Create a container div for the component
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        rootElement.appendChild(container);

        // Create root and render
        const root = createRoot(container);

        if (PageComponent) {
          // Render the actual component
          root.render(React.createElement(PageComponent));
        } else {
          // Fallback if component is not found
          root.render(React.createElement('div', {}, 'Component not found'));
          console.error("Component not found in the bundled code");
        }
      }
    } catch (error) {
      console.error("Error rendering component:", error);
      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        rootElement.innerHTML = `<div style="color: red; padding: 20px;">Error rendering component: ${error instanceof Error ? error.message : String(error)}</div>`;
      }
    }
  };

  const items = Object.keys(pages).sort((a, b) => pages?.[a]?.order - pages?.[b]?.order).map(page => ({
    label: page,
    key: (page),
    children: (
      <div
        id={titleToId(page)}
        className="w-full h-full relative"
        style={{
          border: '0px solid #111',
          borderRadius: 10,
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          height: 765,
          width: 1105,
          margin: '0 auto',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'block',
        }}>
        <Spin indicator={<LoadingOutlined />} />
      </div>
    )
  }));

  useEffect(() => {
    const loadComponents = async () => {
      if (!isGenerating && pages?.[activePage]?.components?.length > 0) {
        // await Promise.all(Object.keys(pages).map(page => addComponentScript(pages[page].components[0], titleToId(page))));
        compileAndRenderComponent(pages[activePage].components[0], titleToId(activePage));
      }
    }
    loadComponents();
  }, [activePage, pages, isGenerating]);

  useEffect(() => {
    if (!isGenerating) {
      setTimeout(() => {
        setActivePage(Object.keys(pages)[0]);
        compileAndRenderComponent(pages[Object.keys(pages)[0]].components[0], titleToId(Object.keys(pages)[0]));
      }, 1000);
    }
  }, [isGenerating]);

  return (
    <div className='w-full h-full'>
      {
        isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton active paragraph={{ rows: 8 }} className="w-full max-w-4xl" />
          </div>
        ) : (
          <Tabs items={items} onChange={(key) => {
              setActivePage(key);
          }}
            onTabClick={(key) => {
              setActivePage(key);
            }}
            defaultActiveKey={activePage}
          />
        )
      }
    </div>
  )
} 