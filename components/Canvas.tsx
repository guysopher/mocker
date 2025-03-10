'use client'

import { useState, useEffect, useRef } from 'react'
import { WireframeView } from '@/components/views/WireframeView'
import { LogicView } from '@/components/views/LogicView'
import { StoriesView } from '@/components/views/StoriesView'
import VoiceInteraction from '@/components/VoiceInteraction'
import { MarketplaceDemo } from '@/components/Marketplace'
import { DesignView } from '@/components/views/DesignView'
import { BriefView } from '@/components/views/BriefView'

interface CanvasProps {
  view: string
  appDescription: string
  isGenerating: boolean
  buildProgress: number
}

interface CanvasElement {
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
}

export default function Canvas({ view, appDescription, isGenerating, buildProgress }: CanvasProps) {
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [voiceActive, setVoiceActive] = useState(false)
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // Create demo project for second-hand marketplace
  const getMarketplaceDemo = () => MarketplaceDemo;

  // Generate canvas elements based on app description or use demo
  useEffect(() => {
    // If there's no description or a very short one, use the demo project
    const demoProject = getMarketplaceDemo();
    setCanvasElements(demoProject[view as keyof typeof demoProject] || []);
    
  }, [view, appDescription]);
  
  const handleElementClick = (elementId: string) => {
    setActiveElement(elementId)
    setVoiceActive(true)
  }
  
  const handleVoiceEnd = () => {
    setVoiceActive(false)
    
    // Simulate adding a comment to the element
    setCanvasElements(elements => elements.map(element => 
      element.id === activeElement 
        ? { ...element, hasComments: true } 
        : element
    ))
  }
  
  const renderCanvas = () => {
    switch (view) {
      case 'brief':
        return <BriefView 
          elements={canvasElements}
          appDescription={appDescription}
          onElementClick={handleElementClick}
          activeElement={activeElement}
        />
      case 'design':
        return <DesignView 
          elements={canvasElements}
          onElementClick={handleElementClick}
          activeElement={activeElement}
        />
      case 'prototype':
        return <WireframeView 
          elements={canvasElements} 
          onElementClick={handleElementClick}
          activeElement={activeElement}
        />
      case 'logic':
        return <LogicView 
          elements={canvasElements}
          onElementClick={handleElementClick}
          activeElement={activeElement}
        />
      case 'stories':
        return <StoriesView 
          elements={canvasElements}
          onElementClick={handleElementClick} 
          activeElement={activeElement}
        />
      default:
        return <div>Select a view to get started</div>
    }
  }
  
  return (
    <div ref={canvasRef} className="w-full h-full relative">
      {isGenerating && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
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
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          {renderCanvas()}
        </div>
      </div>
      
      {voiceActive && activeElement && (
        <VoiceInteraction 
          elementId={activeElement}
          onVoiceEnd={handleVoiceEnd}
          element={canvasElements.find(el => el.id === activeElement)}
        />
      )}
    </div>
  )
}