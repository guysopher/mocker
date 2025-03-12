import { CanvasElement } from '@/types/canvas'
import { FC } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'

interface DesignViewProps {
  elements: CanvasElement[]
  onElementClick?: (id: string) => void
  activeElement?: string | null
  showProgress: string | null
}

export const DesignView: FC<DesignViewProps> = ({
  elements,
  onElementClick,
  activeElement,
  showProgress
}) => {

  return (
    <div className="w-full h-full relative" style={{ 
      border: '0px solid #111',
      borderRadius: 10,
      boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
      height: 765,
      width: 1105,
      margin: '0 auto'
    }}>
      {elements?.map(element => {
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
              {showProgress === element.id && (
                <CommentsIndicator />
              )}
            </div>


          </>
        ) : null
      })}
    </div>
  )
} 