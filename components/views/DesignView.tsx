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
    <div className="w-full h-full absolute">
      {elements.map(element => element.render ? element.render() : 'null')}
    </div>
  )
} 