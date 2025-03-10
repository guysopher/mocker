'use client'

import React from 'react'

interface LogicViewProps {
  elements: any[] // Properly type as CanvasElement[] when used
  onElementClick: (elementId: string) => void
  activeElement: string | null
}

export function LogicView({ elements, onElementClick, activeElement }: LogicViewProps) {
  // Helper to draw connector lines for the flowcharts
  const renderConnectors = () => {
    // Determine which connectors to show based on available elements
    const hasMarketplaceElements = elements.some(el => el.id === 'app-launch') && elements.some(el => el.id === 'auth-check');
    
    if (hasMarketplaceElements) {
      // Second-hand marketplace app logic flow connectors
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* App launch to auth check */}
          <path 
            d="M475,110 L475,160" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Auth check yes/no paths */}
          <path 
            d="M400,210 L280,210 L280,300" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          <path 
            d="M600,210 L680,210 L680,300" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Login flow to home screen */}
          <path 
            d="M280,380 L280,480 L400,480 L550,480 L550,380" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Home screen to location check */}
          <path 
            d="M680,380 L680,430" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Location check paths */}
          <path 
            d="M600,480 L480,480 L480,550" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          <path 
            d="M800,480 L880,480 L880,550" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Request location to user action */}
          <path 
            d="M480,630 L480,680 L600,680" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Load nearby to user action */}
          <path 
            d="M880,630 L880,680 L800,680" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* User action paths */}
          <path 
            d="M600,730 L480,730 L480,800" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          <path 
            d="M700,730 L700,800" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          <path 
            d="M800,730 L880,730 L880,800" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Text labels for decision paths */}
          <text x="320" y="190" fill="#4B5563" fontSize="12" fontFamily="sans-serif">No</text>
          <text x="620" y="190" fill="#4B5563" fontSize="12" fontFamily="sans-serif">Yes</text>
          <text x="520" y="460" fill="#4B5563" fontSize="12" fontFamily="sans-serif">No</text>
          <text x="820" y="460" fill="#4B5563" fontSize="12" fontFamily="sans-serif">Yes</text>
          <text x="520" y="710" fill="#4B5563" fontSize="12" fontFamily="sans-serif">View</text>
          <text x="700" y="760" fill="#4B5563" fontSize="12" fontFamily="sans-serif">Message</text>
          <text x="840" y="710" fill="#4B5563" fontSize="12" fontFamily="sans-serif">Sell</text>
          
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
            </marker>
          </defs>
        </svg>
      );
    } else {
      // Default simple flow connectors
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Start to decision */}
          <path 
            d="M460,110 L460,200" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Decision to process */}
          <path 
            d="M460,300 L460,400" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Process to end */}
          <path 
            d="M460,480 L460,550" 
            stroke="#9CA3AF" 
            strokeWidth="2" 
            fill="none" 
            markerEnd="url(#arrowhead)" 
          />
          
          {/* Arrowhead marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
            </marker>
          </defs>
        </svg>
      );
    }
  }
  
  return (
    <div className="relative">
      {renderConnectors()}
      
      {elements.map((element) => {
        const isActive = element.id === activeElement
        
        // Determine shape based on element type
        let shape
        
        if (element.type === 'start' || element.type === 'end') {
          shape = (
            <div 
              className={`w-full h-full rounded-full flex items-center justify-center ${
                element.type === 'start' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'
              } border-2`}
            >
              <span className="text-sm font-medium">
                {element.label}
              </span>
            </div>
          )
        } else if (element.type === 'decision') {
          shape = (
            <div className="w-full h-full transform rotate-45 bg-yellow-100 border-yellow-400 border-2">
              <div className="w-full h-full transform -rotate-45 flex items-center justify-center">
                <span className="text-sm font-medium text-center px-2">
                  {element.label}
                </span>
              </div>
            </div>
          )
        } else if (element.type === 'process') {
          shape = (
            <div className="w-full h-full bg-blue-100 border-blue-400 border-2 flex items-center justify-center">
              <span className="text-sm font-medium">
                {element.label}
              </span>
            </div>
          )
        }
        
        return (
          <div
            key={element.id}
            onClick={() => onElementClick(element.id)}
            className={`absolute cursor-pointer transition-shadow ${
              isActive ? 'ring-2 ring-indigo-300' : ''
            }`}
            style={{
              left: `${element.x - element.width / 2}px`,
              top: `${element.y - element.height / 2}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
            }}
          >
            {shape}
            
            {/* Badge for comments */}
            {element.hasComments && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            )}
            
            {/* AI Note */}
            {isActive && (
              <div className="absolute top-full left-0 mt-2 bg-white p-2 rounded-md shadow-md border border-gray-200 text-xs text-gray-600 max-w-xs z-10">
                <strong className="block text-gray-800 mb-1">AI Notes:</strong>
                {element.notes}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}