'use client'

import { useState } from 'react'

interface AppDescriptionFormProps {
  onSubmit: (description: string) => void
  isGenerating: boolean
}

export default function AppDescriptionForm({ onSubmit, isGenerating }: AppDescriptionFormProps) {
  const defaultDescription = "Create a marketplace app for buying and selling second-hand items. Features should include user profiles, item listings with photos and descriptions, search and filter functionality, in-app messaging between buyers and sellers, secure payment processing, and a review system. Users should be able to save favorite items and get notifications for price drops or new items matching their interests."
  const [description, setDescription] = useState(defaultDescription)
  const [charCount, setCharCount] = useState(defaultDescription.length)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim() && !isGenerating) {
      onSubmit(description)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)
    setCharCount(value.length)
  }
  
  // Example prompts that users can click to get started
  const examplePrompts = [
    "Create a local marketplace app for buying and selling second-hand items with in-app messaging and secure payment integration",
    "Design a community marketplace where users can trade or sell used books, including rating system and condition tracking",
    "Build a sustainable fashion marketplace with authentication, item categories, and location-based search"
  ]
  
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700">
            Describe your marketplace app
          </label>
          <span className={`text-xs ${charCount > 200 ? 'text-green-600' : 'text-gray-500'}`}>
            {charCount} characters {charCount < 100 ? '(aim for 100+)' : ''}
          </span>
        </div>
        
        <div className="relative">
          <textarea
            id="appDescription"
            rows={7}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Describe the app you want to create in natural language..."
            value={description}
            onChange={handleChange}
            disabled={isGenerating}
          />
          
          {isGenerating && (
            <div className="absolute inset-0 bg-white bg-opacity-70 rounded-md flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <p className="text-sm font-medium text-gray-600">AI is processing your request...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 space-y-3">
          <p className="text-sm text-gray-600">
            Include details about marketplace features, user roles (buyers/sellers), item management, and payment processing.
            The more specific you are, the better the generated result.
          </p>
          
          {!description && (
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-500 mb-2">Need inspiration? Try one of these examples:</p>
              <div className="grid grid-cols-1 gap-2">
                {examplePrompts.map((prompt, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => setDescription(prompt)}
                    className="text-left text-xs px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-md text-gray-700 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end">
        <div className="mr-auto text-xs text-gray-500 italic">
          Our AI will transform your marketplace description into interactive wireframes, user flows, and feature specifications.
        </div>
        
        <button
          type="submit"
          disabled={!description.trim() || isGenerating}
          className={`px-6 py-3 rounded-md font-medium shadow-sm transition-all ${
            !description.trim() || isGenerating
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating App...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Create My App
            </span>
          )}
        </button>
      </div>
    </form>
  )
}