import { CanvasElement } from '@/types/canvas'
import { FC } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'
import { Tabs } from 'antd'
import * as Babel from '@babel/standalone';
import React from 'react';
interface DesignViewProps {
  pages: Record<string, {
    layout: string;
    components: string[];
  }>
  onElementClick?: (id: string) => void
  activeElement?: string | null
  showProgress: string | null
  isGenerating: boolean
}

export const DesignView: FC<DesignViewProps> = ({
  pages = {},
  onElementClick,
  activeElement,
  showProgress,
  isGenerating
}) => {

  const compileAndRenderComponent = (code: string) => {
    try {
      // Transpile JSX to JavaScript
      const transpiledCode = Babel.transform(code, { presets: ["react"] }).code;

      // Evaluate the transpiled JavaScript and extract the component
        const Component = new Function("React", `${transpiledCode}; return TaskCard;`)(React);

      return <Component />;
    } catch (error) {
      console.error("Error rendering component:", error);
      return <p>Error rendering component</p>;
    }
  };

  const renderComponent = (code: string) => {
    try {
      // Transform JSX to JavaScript
      const transformedCode = Babel.transform(code, {
        presets: ['react'],
      }).code;

      // Wrap the transformed code
      const wrappedCode = `
        const React = require('react');
        ${transformedCode}
        return CardComponent();
      `;

      const Component = new Function('require', wrappedCode)(require);
      return Component;
    } catch (error) {
      console.error("Error rendering component:", error);
      return <p>Error rendering component</p>;
    }
  };

  const _pages: Record<string, {
    layout: string;
    components: string[];
  }> = {
    Home: {
      layout: "Test",
      components: [`
        const CardComponent = () => {
    const cardStyle = {
        width: '100%',
        maxWidth: '300px',
        margin: '1rem auto',
        padding: '1rem',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        boxSizing: 'border-box'
    };

    const headerStyle = {
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        color: '#333'
    };

    const paragraphStyle = {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#666'
    };

    return (
        <div style={cardStyle}>
            <h2 style={headerStyle}>Card Title</h2>
            <p style={paragraphStyle}>This is a simple card component used to display content. It is responsive and adjusts to different screen sizes.</p>
        </div>
    );
  };`]
    }

  }

  const items = Object.keys(_pages).map(page => ({
    label: page,
    key: page,
    children: (
      <div className="w-full h-full relative" style={{
        border: '0px solid #111',
        borderRadius: 10,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        height: 765,
        width: 1105,
        margin: '0 auto'
      }}>
        <div className="grid grid-cols-12 gap-4">
          {_pages[page].components?.map(component => {
            const isActive = component === activeElement
            if (isActive) {
              return <div key={component}
                onClick={() => onElementClick?.(component)}
              >
                {compileAndRenderComponent(component)}
                {showProgress === component && (
                  <CommentsIndicator />
                )}
              </div>
            } else {
              return renderComponent(component)
            }
          })}
        </div>
      </div>
    )
  }));

  return (
    isGenerating ? (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse">Yoooo</div>
      </div>
    ) : (
      <Tabs items={items} />
    )
  )
} 