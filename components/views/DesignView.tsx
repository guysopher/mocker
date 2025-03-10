import { CanvasElement } from '@/types/canvas'
import { FC } from 'react'

interface DesignViewProps {
  elements: CanvasElement[]
  onElementClick?: (id: string) => void
  activeElement?: string | null
}

export const DesignView: FC<DesignViewProps> = ({
  elements,
  onElementClick,
  activeElement
}) => {

  return (
    <div className="w-full h-full relative">
      {elements.map(element => {
        const isActive = element.id === activeElement
        return element.render ? (
          <>
            <div key={element.id} className={`absolute hover-indicator`} style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              borderRadius: 10,
            }}
              onClick={() => onElementClick?.(element.id)}
            >
              {element.render()}
              {element.hasComments && (
                <div className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              )}
            </div>


          </>
        ) : null
      })}
    </div>
  )
} 