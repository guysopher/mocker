'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Canvas from '@/components/Canvas'
import AppDescriptionForm from '@/components/AppDescriptionForm'
import Header from '@/components/Header'

export default function Home() {
  const [appDescription, setAppDescription] = useState('')
  const [generatingContent, setGeneratingContent] = useState(false)
  const [appGenerated, setAppGenerated] = useState(false)
  const [currentView, setCurrentView] = useState('brief') // brief, design, stories
  const [buildProgress, setBuildProgress] = useState(0)
  const [building, setBuilding] = useState(false)
  
  const handleSubmitDescription = (description: string) => {
    setAppDescription(description)
    setGeneratingContent(true)
    
    // Simulate AI generation (would connect to actual APIs)
    setTimeout(() => {
      setGeneratingContent(false)
      setAppGenerated(true)
    }, 3000)
  }
  
  const handleDesignIt = () => {
    setGeneratingContent(true)
    
    // Simulate AI refinement
    setTimeout(() => {
      setGeneratingContent(false)
    }, 2500)
  }
  
  const handleBuildIt = () => {
    setBuilding(true)
    
    // Simulate build progress
    const interval = setInterval(() => {
      setBuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 800)
  }
  
  useEffect(() => {
    if (buildProgress >= 100) {
      // Ready to redirect to Wix
      setBuilding(false)
    }
  }, [buildProgress])
  
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      
      {!appGenerated ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-gray-50">
          <div className="max-w-3xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Wix App Creator</h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Describe your app idea in natural language, and our AI will generate prototype, 
                logic flowcharts, and user stories to help you visualize and build your app.
              </p>
            </div>
            
            <AppDescriptionForm 
              onSubmit={handleSubmitDescription} 
              isGenerating={generatingContent} 
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex space-x-6">
                <button 
                  onClick={() => setCurrentView('brief')}
                  className={`px-4 py-2 font-medium ${currentView === 'brief' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Brief
                </button>
                <button 
                  onClick={() => setCurrentView('design')}
                  className={`px-4 py-2 font-medium ${currentView === 'design' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Design
                </button>
                <button 
                  onClick={() => setCurrentView('stories')}
                  className={`px-4 py-2 font-medium ${currentView === 'stories' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-800'}`}
                >
                  User Stories
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={handleDesignIt}
                  disabled={generatingContent || building}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md font-medium disabled:bg-indigo-300"
                >
                  Design It
                </button>
                <button 
                  onClick={handleBuildIt}
                  disabled={generatingContent || building || buildProgress > 0}
                  className="px-5 py-2 bg-green-600 text-white rounded-md font-medium disabled:bg-green-300"
                >
                  Build It
                </button>
                
                {buildProgress === 100 && (
                  <Link 
                    href="https://www.wix.com/dashboard"
                    target="_blank"
                    className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium"
                  >
                    Finish in Wix
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <Canvas 
              view={currentView} 
              appDescription={appDescription}
              isGenerating={generatingContent}
              buildProgress={buildProgress}
            />
          </div>
          
          {building && (
            <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg max-w-md">
              <h3 className="font-semibold text-lg mb-2">Building Your App</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${buildProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {buildProgress < 30 ? 'Generating code structure...' :
                 buildProgress < 60 ? 'Implementing core functionality...' :
                 buildProgress < 90 ? 'Adding UI components...' :
                 buildProgress === 100 ? 'Ready to publish!' : 'Finalizing...'}
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
