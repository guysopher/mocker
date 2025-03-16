'use client'

import { useState, useEffect, useRef, MouseEventHandler, MouseEvent as ReactMouseEvent } from 'react'
import { StoriesView } from '@/components/views/StoriesView'
import VoiceInteraction from '@/components/VoiceInteraction'
import { MarketplaceDemo } from '@/components/Marketplace'
import { DesignView } from '@/components/views/DesignView'
import { BriefView } from '@/components/views/BriefView'
import { CanvasElement, CanvasStory, BriefItem } from '@/types/canvas'
import { SitemapView } from '@/components/views/SitemapView'
import prompts from '@/utils/prompts'
import { generateChangeRequest } from '@/utils/openai'

interface CanvasProps {
  view: string
  appDescription: string
  generatingSection: string | null
  buildProgress: number
  setGeneratingContent: (generatingContent: boolean) => void
  onChangeRequest: (changeRequest: string) => void
  appContent: {
    brief: BriefItem[]
    pages: any
    stories: CanvasStory[]
    sitemap: string[]
    stylesheet: string
  } | null
}

export default function Canvas({ view, appDescription, generatingSection, buildProgress, setGeneratingContent, appContent, onChangeRequest }: CanvasProps) {
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const [voiceActive, setVoiceActive] = useState(false)
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [voicePopupPosition, setVoicePopupPosition] = useState({ x: 0, y: 0 })
  const [showProgress, setShowProgress] = useState(null as any)
  const [changeRequests, setChangeRequests] = useState<string[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)
  const [mouseDownTimer, setMouseDownTimer] = useState<NodeJS.Timeout | null>(null);

  const handleElementMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const elementId = getCssPath(target);
    if (elementId) setActiveElement(elementId);
    
    const timer = setTimeout(() => {
      setVoiceActive(true);
      setVoicePopupPosition({ x: event.clientX, y: event.clientY });
    }, 1000);
    
    setMouseDownTimer(timer);
  }

  const getCssPath = (element: HTMLElement): string => {
    if (!element || element === document.documentElement) return '';

    const parent = element.parentElement;
    if (!parent) return element.tagName.toLowerCase();

    let nth = 1;
    let sibling = element;
    while ((sibling = sibling.previousElementSibling as HTMLElement)) {
      if (sibling.tagName === element.tagName) nth++;
    }

    const tag = element.tagName?.toLowerCase();
    const classes = element.className ? `.${element.className?.trim?.()?.replace(/\s+/g, '.')}` : '';
    const nthSelector = nth > 1 ? `:nth-of-type(${nth})` : '';

    return `${getCssPath(parent)} > ${tag}${classes}${nthSelector}`.trim();
  };

  const handleElementMouseUp = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (mouseDownTimer) {
      clearTimeout(mouseDownTimer);
      setMouseDownTimer(null);
    } 
    if (voiceActive) {
      setTimeout(() => {
        setVoiceActive(false)
      }, 1000)
    }
  }

  const getCurrentHtml = () => {
    return document.documentElement.outerHTML
      .replace(/<head>[\s\S]*?<\/head>/gi, '') // Remove head section
      .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove all script tags
      .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove all style tags
      .replace(/<svg[\s\S]*?<\/svg>/gi, '') // Remove SVG elements
      .replace(/<![^>]*>/g, '') // Remove comments and doctype
      .replace(/<link[^>]*>/gi, '') // Remove link tags
      .replace(/<meta[^>]*>/gi, '') // Remove meta tags
      // Remove common non-essential attributes
      .replace(/\s+(class|style|id|data-\S*|aria-\S*|role|tabindex|onclick|onload|placeholder)="[^"]*"/gi, '')
      // Remove empty attributes
      .replace(/\s+\w+=""/g, '')
      // Remove any remaining empty attributes without values
      .replace(/\s+\w+(?!=)/g, '')
      .replace(/\s+/g, ' ') // Collapse multiple whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();
  }

  const handleVoiceEnd = async (changeRequest: string) => {
    if (!changeRequest) return;
    setShowProgress(activeElement)
    setVoiceActive(false)
    setGeneratingContent(true)

    const context = await fetch('/api/context', {
      method: 'POST',
      body: JSON.stringify({ html: getCurrentHtml(), cssPath: activeElement, userRequest: changeRequest })
    })

    const contextData = await context.json()

    const lastChangeRequest = `This is the user request: '${changeRequest}', and this is the context that the user is referring to: '${JSON.stringify(contextData.context)}'`
    const tempChangeRequests = [lastChangeRequest, ...changeRequests.filter(Boolean)]
    setChangeRequests(tempChangeRequests)

    onChangeRequest(lastChangeRequest)
  }

  return (
    <div ref={canvasRef} className="w-full h-full relative">
      {(!appContent || !appContent[view as keyof typeof appContent]) && (
        <div className="absolute inset-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center z-50">
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

          <div className="flex-1" onMouseDown={handleElementMouseDown} onMouseUp={handleElementMouseUp}>
            {view === 'brief' && <BriefView
              elements={appContent?.brief as BriefItem[]}
              onElementClick={() => { }}
              onElementUpdate={(elementId, updates) => {
                // Handle element updates here
                console.log('Element updated:', elementId, updates)
              }}
              activeElement={activeElement}
              showProgress={showProgress}
              appDescription={appDescription}
              isGenerating={!appContent?.brief || !appContent?.brief.length}
            />}
            {view === 'stories' && <StoriesView
              elements={appContent?.stories as CanvasStory[]}
              onElementClick={() => { }}
              activeElement={activeElement}
              showProgress={showProgress}
              isGenerating={!appContent?.stories || !appContent?.stories.length}
            // isGenerating={isGenerating && generatingSection === 'stories'}
            // content={appContent?.stories}
            />}
            {view === 'sitemap' && <SitemapView
              elements={appContent?.sitemap as string[]}
              onElementClick={() => { }}
              activeElement={activeElement}
              showProgress={showProgress}
              isGenerating={!appContent?.sitemap || !appContent?.sitemap.length}
            />}
            {view === 'pages' && <DesignView
              pages={appContent?.pages || {}}
              stylesheet={appContent?.stylesheet || ''}
              onElementClick={() => { }}
              activeElement={activeElement}
              showProgress={showProgress}
              isGenerating={!appContent?.pages || !Object.keys(appContent?.pages).length}
            />}
          </div>
        </div>
      </div>

      <div
        style={{
          display: voiceActive ? 'block' : 'none',
          position: 'fixed',
          left: voicePopupPosition.x,
          top: voicePopupPosition.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}
      >
        <VoiceInteraction
          isActive={voiceActive}
          elementId={activeElement || ''}
          onVoiceEnd={handleVoiceEnd}
          element={canvasElements.find(el => el.id === activeElement)}
        />
      </div>

    </div>
  )
}