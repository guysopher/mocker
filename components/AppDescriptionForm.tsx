'use client'

import { useState } from 'react'

interface AppDescriptionFormProps {
  onSubmit: (description: string) => void
  isGenerating: boolean
}

export default function AppDescriptionForm({ onSubmit, isGenerating }: AppDescriptionFormProps) {
  const defaultDescription = "Create a marketplace app for buying and selling second-hand items. Features should include user profiles, item listings with photos and descriptions, search and filter functionality, in-app messaging between buyers and sellers, secure payment processing, and a review system."
  const [description, setDescription] = useState(defaultDescription)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim() && !isGenerating) {
      onSubmit(description)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
      <div className="mb-6">        
        <div className="relative">
          <textarea
            id="appDescription"
            rows={15}
            cols={400}
            style={{ fontSize: '2rem', border: 'none' }}
            className="w-full px-8 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Describe the features and functionality you want in your marketplace app..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isGenerating}
          />
          
          {isGenerating && (
            <div className="absolute inset-0 bg-white bg-opacity-70 rounded-md flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!description.trim() || isGenerating}
          className={`px-6 py-2.5 rounded-md font-medium transition-all ${
            !description.trim() || isGenerating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate App'}
        </button>
      </div>
    </form>
  )
}