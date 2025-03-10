'use client'

import React from 'react'

interface StoriesViewProps {
  elements: any[] // Properly type as CanvasElement[] when used
  onElementClick: (elementId: string) => void
  activeElement: string | null
}

export function StoriesView({ elements, onElementClick, activeElement }: StoriesViewProps) {
  return (
    <div className="relative">
      {elements.map((element) => {
        const isActive = element.id === activeElement
        
        return (
          <div
            key={element.id}
            onClick={() => onElementClick(element.id)}
            className={`absolute cursor-pointer bg-white rounded-lg border-2 transition-shadow ${
              isActive 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-300 hover:border-blue-300 hover:shadow'
            }`}
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
            }}
          >
            <div className="flex flex-col h-full">
              {/* Story header */}
              <div className="py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 rounded-t-md">
                <div className="flex items-center">
                  {element.id.includes('buyer') && (
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  )}
                  {element.id.includes('seller') && (
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {element.id.includes('common') && (
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                  <span className="font-medium text-blue-800">
                    {element.label}
                  </span>
                </div>
              </div>
              
              {/* Story content */}
              <div className="p-3 flex-1">
                <div className="flex">
                  <div className="min-w-[70px] font-medium text-xs text-indigo-700 mr-2 mt-0.5">AS A</div>
                  <div className="text-sm text-gray-700 flex-1">
                    {element.notes.includes('As a buyer') ? 'Buyer' : 
                     element.notes.includes('As a seller') ? 'Seller' :
                     element.notes.includes('As a user') ? 'User' : 
                     'Customer'}
                  </div>
                </div>
                
                <div className="flex mt-2">
                  <div className="min-w-[70px] font-medium text-xs text-indigo-700 mr-2 mt-0.5">I WANT TO</div>
                  <div className="text-sm text-gray-700 flex-1">
                    {element.notes.split('I want to ')[1]?.split(' so that')[0] || 
                     "Perform the specified action"}
                  </div>
                </div>
                
                <div className="flex mt-2">
                  <div className="min-w-[70px] font-medium text-xs text-indigo-700 mr-2 mt-0.5">SO THAT</div>
                  <div className="text-sm text-gray-700 flex-1">
                    {element.notes.split('so that ')[1] || 
                     "I can achieve the desired outcome"}
                  </div>
                </div>
                
                {/* Example acceptance criteria - in reality this would be dynamic */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">Acceptance Criteria</span>
                  </div>
                  <ul className="text-xs text-gray-600 list-disc pl-6 space-y-1.5">
                    {element.id.includes('Finding') && (
                      <>
                        <li>User can see items within a selected radius from their location</li>
                        <li>Items display distance from user&apos;s current location</li>
                        <li>User can view items on a map view showing their relative locations</li>
                      </>
                    )}
                    {element.id.includes('Filtering') && (
                      <>
                        <li>User can filter by multiple categories simultaneously</li>
                        <li>User can set minimum and maximum price range</li>
                        <li>User can sort results by distance, price, or recency</li>
                      </>
                    )}
                    {element.id.includes('Creating') && (
                      <>
                        <li>User can upload multiple photos of the item</li>
                        <li>User can set a price and mark if price is negotiable</li>
                        <li>User can add a detailed description and select a category</li>
                      </>
                    )}
                    {!element.id.includes('Finding') && !element.id.includes('Filtering') && !element.id.includes('Creating') && (
                      <>
                        <li>Criteria 1</li>
                        <li>Criteria 2</li>
                        <li>Criteria 3</li>
                      </>
                    )}
                  </ul>
                </div>
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
                This user story describes a key interaction flow. Ensure it&apos;s properly implemented to meet user expectations.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}