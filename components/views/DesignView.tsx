import { CanvasElement } from '@/types/canvas'
import { FC } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'
import { Skeleton, Tabs } from 'antd'
import * as Babel from '@babel/standalone';
import React from 'react';
interface DesignViewProps {
  pages: Record<string, {
    layout: string;
    components: string[];
  }>
  stylesheet: string
  onElementClick?: (id: string) => void
  activeElement?: string | null
  showProgress: string | null
  isGenerating: boolean
}

export const DesignView: FC<DesignViewProps> = ({
  pages = {},
  stylesheet = {classes: [], stylesheet: ''},
  onElementClick,
  activeElement,
  showProgress,
  isGenerating
}) => {

  const compileAndRenderComponent = (html: string, styles: any) => {
    try {
      return <div style={styles} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (error) {
      console.error("Error rendering component:", error);
      return <p>Error rendering component</p>;
    }
  };

  const items = Object.keys(pages).map(page => ({
    label: page + '1',
    key: page,
    children: (
      <div className="w-full h-full relative" style={{
        border: '0px solid #111',
        borderRadius: 10,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        height: 765,
        width: 1105,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(16, 1fr)', /* 16 equal columns */
        gridTemplateRows: 'repeat(9, 1fr)', /* 9 equal rows */
        gap: 10, /* Adjust spacing */
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        {pages[page].components?.map((component: any) => {
          const isActive = component.html === activeElement
          if (isActive) {
            return <>
              {compileAndRenderComponent(component.html, component.styles)}
              {/* <div key={component}
                  onClick={() => onElementClick?.(component)}
                >
                  {showProgress === component && (
                    <CommentsIndicator />
                  )}
                </div> */}
            </>
          } else {
            return compileAndRenderComponent(component.html, component.styles)
          }
        })}
      </div>
    )
  }));

  return (
    isGenerating ? (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 8 }} className="w-full max-w-4xl" />
      </div>
    ) : (
      <Tabs items={items} />
    )
  )
} 