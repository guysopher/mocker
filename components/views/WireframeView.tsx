'use client'

import React from 'react'

interface WireframeViewProps {
  elements: any[] // Properly type as CanvasElement[] when used
  onElementClick: (elementId: string) => void
  activeElement: string | null
}

export function WireframeView({ elements, onElementClick, activeElement }: WireframeViewProps) {
  return (
    <div className="relative">
      {elements.map((element) => {
        const isActive = element.id === activeElement
        
        return (
          <div
            key={element.id}
            onClick={() => onElementClick(element.id)}
            className={`absolute cursor-pointer border-2 transition-shadow ${
              isActive 
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                : 'border-gray-300 hover:border-blue-300'
            }`}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
            }}
          >
            <div className="flex flex-col h-full">
              {/* Element header */}
              <div className="h-7 bg-gray-100 border-b border-gray-300 flex items-center px-2">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {element.label}
                </span>
              </div>
              
              {/* Element content */}
              <div className="flex-1 p-2 relative">
                {element.type === 'container' && (
                  <div className="w-full h-full bg-white bg-opacity-50 border border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Content Area</span>
                  </div>
                )}
                
                {element.type === 'button' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white font-medium text-sm py-1 px-4 rounded">
                    {element.label}
                  </div>
                )}
                
                {element.type === 'input' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] bg-white border border-gray-300 text-gray-500 text-sm py-1.5 px-3 rounded">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>{element.label}...</span>
                    </div>
                  </div>
                )}
                
                {element.type === 'component' && (
                  <div className="w-full h-full bg-white border border-gray-200 rounded shadow-sm flex flex-col">
                    <div className="h-24 bg-gray-100 w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-900 mb-1 truncate">Item Title</div>
                      <div className="text-xs font-semibold text-green-600 mb-1">$25.00</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        0.7 miles away
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Badge for comments */}
            {element.hasComments && (
              <div className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
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