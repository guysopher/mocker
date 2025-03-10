import { FC } from 'react'

interface DesignViewProps {
  elements: Array<{
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    label: string
    notes: string
    hasComments: boolean
    render?: () => JSX.Element
  }>
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
      {elements.map(element => (
        <div
          key={element.id}
          className={`absolute transition-all duration-200 ${
            activeElement === element.id ? 'ring-2 ring-blue-500' : ''
          }`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
          }}
          onClick={() => onElementClick?.(element.id)}
        >
          {element.render ? (
            element.render()
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">{element.label}</span>
            </div>
          )}
          {element.hasComments && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
          )}
        </div>
      ))}
    </div>
  )
} 