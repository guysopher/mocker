'use client'

import React from 'react'
import { CanvasStory } from '@/types/canvas'
import { CommentsIndicator } from '../CommentsIndicator'

interface StoriesViewProps {
  elements: CanvasStory[]
  onElementClick: (elementId: string) => void
  activeElement: string | null
  showProgress: string | null
}

export function StoriesView({ elements, onElementClick, activeElement, showProgress }: StoriesViewProps) {
  return (
    <div className="relative p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {elements?.map((element) => {
        const isActive = element.id === activeElement
        
        return (
          <div
            key={element.id}
            onClick={() => onElementClick(element.id)}
            className={`
              p-6 rounded-lg border transition-all duration-200 cursor-pointer
              hover:shadow-lg hover:border-blue-400
              ${isActive 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 bg-white hover:transform hover:-translate-y-1'
              }
            `}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{element.name}</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                  Story
                </span>
              </div>
              
              <p className="text-gray-600">{element.description}</p>
              
              <div className="pt-4 flex items-center justify-between text-sm text-gray-500 border-t">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  <span>Created {new Date().toLocaleDateString()}</span>
                </div>
                
                {isActive && (
                  <span className="flex items-center text-blue-600">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Selected
                  </span>
                )}
              </div>
              {showProgress === element.id && (
                <CommentsIndicator />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}