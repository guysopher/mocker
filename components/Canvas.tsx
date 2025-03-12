'use client'

import { useState, useEffect, useRef } from 'react'
import { StoriesView } from '@/components/views/StoriesView'
import VoiceInteraction from '@/components/VoiceInteraction'
import { MarketplaceDemo } from '@/components/Marketplace'
import { DesignView } from '@/components/views/DesignView'
import { BriefView } from '@/components/views/BriefView'
import { CanvasElement, CanvasStory, BriefItem } from '@/types/canvas'

interface CanvasProps {
  view: string
  appDescription: string
  isGenerating: boolean
  generatingSection: string | null
  buildProgress: number
  appContent: {
    brief: BriefItem[]
    design: CanvasElement[]
    stories: CanvasStory[]
  } | null
}

export default function Canvas({ view, appDescription, isGenerating, generatingSection, buildProgress, appContent }: CanvasProps) {
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [voiceActive, setVoiceActive] = useState(false)
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [voicePopupPosition, setVoicePopupPosition] = useState({ x: 0, y: 0 })
  const [showProgress, setShowProgress] = useState(null as any)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Create demo project for second-hand marketplace
  const getMarketplaceDemo = () => MarketplaceDemo;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVoiceActive(false)
        setActiveElement(null)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleElementClick = (elementId: string) => {
    // If clicking the same element that's active, trigger voice end
    if (elementId === activeElement && voiceActive) {
      handleVoiceEnd()
    } else {
      // Otherwise activate voice for the new element
      setActiveElement(elementId)
      setVoiceActive(true)
      setVoicePopupPosition({ x: mousePosition.x, y: mousePosition.y })
    }
  }

  const handleVoiceEnd = () => {
    setShowProgress(activeElement)
    setVoiceActive(false)
    
    // Reduced timeout to make it feel more responsive
    setTimeout(() => {
      setShowProgress(null)
      
      // Update canvas elements with comment
      setCanvasElements(elements => elements.map(element =>
        element.id === activeElement
          ? { ...element, hasComments: true }
          : element
      ))
    }, 2000) // Reduced from 4000ms to 2000ms for better responsiveness
  }

  const renderCanvas = () => {
    switch (view) {
      case 'brief':
        return <BriefView
          elements={appContent?.brief as BriefItem[]}
          onElementClick={handleElementClick}
          onElementUpdate={(elementId, updates) => {
            // Handle element updates here
            console.log('Element updated:', elementId, updates)
          }}
          activeElement={activeElement}
          showProgress={showProgress}
          appDescription={appDescription}
          // isGenerating={isGenerating && generatingSection === 'brief'}
        />
      case 'design':
      case 'prototype':
        return <DesignView
          elements={appContent?.design as CanvasElement[]}
          onElementClick={handleElementClick}
          activeElement={activeElement}
          showProgress={showProgress}
        />
      case 'stories':
        return <StoriesView
          elements={appContent?.stories as CanvasStory[]}
          onElementClick={handleElementClick}
          activeElement={activeElement}
          showProgress={showProgress}
          // isGenerating={isGenerating && generatingSection === 'stories'}
          // content={appContent?.stories}
        />
      default:
        return <div>Select a view to get started</div>
    }
  }

  return (
    <div ref={canvasRef} className="w-full h-full relative">
      {isGenerating && (
        <div className="absolute bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <svg className="animate-spin mb-4 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium text-gray-800">Generating {view}...</p>
          </div>
        </div>
      )}

      <div className="w-full h-full">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-white p-8 grid grid-cols-1">
          <div className="absolute bg-grid-pattern opacity-20"></div>
          {renderCanvas()}
        </div>
      </div>

      {voiceActive && activeElement && (
        <div
          style={{
            position: 'fixed',
            left: voicePopupPosition.x,
            top: voicePopupPosition.y,
            transform: 'translate(-50%, -50%)',
            zIndex: 1000
          }}
        >
          <VoiceInteraction
            elementId={activeElement}
            onVoiceEnd={handleVoiceEnd}
            element={canvasElements.find(el => el.id === activeElement)}
          />
        </div>
      )}
    </div>
  )
}