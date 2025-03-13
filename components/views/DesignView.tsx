import { CanvasElement } from '@/types/canvas'
import { FC } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'
import { Tabs } from 'antd'
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

  const renderComponent = (code: string) => {
    try {
      const Component = new Function(code)(); // Evaluates and returns the component
      return <Component />;
    } catch (error) {
      console.error("Error rendering component:", error);
      return <p>Error rendering component</p>;
    }
  };

  console.log({pages})

  const items = Object.keys(pages).map(page => ({
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
          {pages[page].components?.map(component => {
            const isActive = component === activeElement
            if (isActive) {
              return <div key={component}
                onClick={() => onElementClick?.(component)}
              >
                {renderComponent(component)}
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
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    ) : (
      <Tabs items={items} />
    )
  )
} 