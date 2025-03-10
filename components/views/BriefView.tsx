import { BriefItem } from "@/types/canvas"
import { useState } from "react"

interface BriefViewProps {
  elements: BriefItem[]
  onElementClick: (id: string) => void
  activeElement: string | null
  onElementUpdate: (id: string, content: string) => void
}

export const BriefView = ({ elements, onElementUpdate, activeElement, onElementClick }: BriefViewProps) => {
  const [editingContent, setEditingContent] = useState("")

  const handleSave = (id: string) => {
    console.log('Saving:', id, editingContent)
    onElementUpdate(id, editingContent)
    onElementClick("")
  }

  const handleClick = (element: BriefItem) => {
    console.log('Clicked element:', element.id)
    onElementClick(element.id)
    setEditingContent(element.content as string)
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-serif font-semibold mb-6 text-gray-800">Project Brief</h2>
      <div className="max-w-none">
        {elements.map((element) => (
          <div key={element.id}>
            {activeElement === element.id ? (
              <textarea
                className="w-full text-xl leading-relaxed mb-6 font-serif text-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         rounded px-2 py-1 min-h-[100px] border border-gray-300"
                value={editingContent || element.content}
                onChange={(e) => setEditingContent(e.target.value)}
                onBlur={() => handleSave(element.id)}
                autoFocus
              />
            ) : (
              <p 
                className="text-xl leading-relaxed mb-6 font-serif text-gray-700 
                           hover:bg-gray-50 rounded px-2 py-1 cursor-pointer
                           border border-transparent hover:border-gray-200"
                onClick={() => handleClick(element)}
                role="button"
                tabIndex={0}
              >
                {element.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 