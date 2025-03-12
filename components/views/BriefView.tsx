import { BriefItem } from "@/types/canvas"
import { useState } from "react"
import { CommentsIndicator } from "../CommentsIndicator"

interface BriefViewProps {
  elements: BriefItem[]
  onElementClick: (elementId: string) => void
  onElementUpdate: (elementId: string, updates: string) => void
  activeElement: string | null
  showProgress: any
  appDescription: string
  isGenerating: boolean
}

export function BriefView({
  elements,
  onElementClick,
  onElementUpdate,
  activeElement,
  showProgress,
  appDescription,
  isGenerating,
}: BriefViewProps) {
  const [editingContent, setEditingContent] = useState("")

  const handleSave = (id: string) => {
    console.log('Saving:', id, editingContent)
    onElementUpdate(id, editingContent)
    onElementClick("")
  }

  const handleClick = (element: BriefItem) => {
    console.log('Clicked element:', element.name)
    onElementClick(element.name)
    setEditingContent(element.description as string)
  }

  return (
    <div className="relative w-full h-full">
      {isGenerating ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-800">Project Brief</h2>
          <div className="max-w-none">
            {elements?.map((element) => (
              <div key={element.name}
                  className="relative text-xl leading-relaxed mb-6 font-serif text-gray-700 
                               hover:bg-gray-50 rounded px-2 py-1 cursor-pointer
                               border border-transparent hover:border-gray-200"
                  onClick={() => handleClick(element)}
                  tabIndex={0}
                >
                  <h3 className="text-xl font-bold text-gray-900">{element.name}</h3>
                  <p className="text-gray-600">{element.description}</p>
                  {showProgress === element.name && (
                    <CommentsIndicator />
                  )}
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}