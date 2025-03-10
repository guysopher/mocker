'use client'

import { useState, useEffect, useRef } from 'react'

interface VoiceInteractionProps {
  elementId: string
  onVoiceEnd: () => void
  element: any // Using any for simplicity, should be properly typed
}

export default function VoiceInteraction({ elementId, onVoiceEnd, element }: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [minimized, setMinimized] = useState(false)
  const [conversations, setConversations] = useState<string[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Simulated voice recognition
  useEffect(() => {
    if (isListening) {
      // Simulating voice recognition. In a real app, we would use the Web Speech API
      timeoutRef.current = setTimeout(() => {
        setIsListening(false)
        setTranscript("Make this component larger and add a dropdown menu for user selections.")
      }, 5000)
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isListening])
  
  // Simulated AI response
  useEffect(() => {
    if (transcript && !isListening) {
      setTimeout(() => {
        setConversations([
          ...conversations,
          `You: ${transcript}`,
          "AI: I've noted your request to increase the component size and add a dropdown menu. I'll update the design accordingly."
        ])
        
        // Auto-close after a response
        setTimeout(() => {
          onVoiceEnd()
        }, 2000)
      }, 1000)
    }
  }, [transcript, isListening, conversations, onVoiceEnd])
  
  const handleMinimize = () => {
    setMinimized(!minimized)
  }
  
  const handleClose = () => {
    onVoiceEnd()
  }
  
  const getPosition = () => {
    // In a real implementation, this would calculate position based on the element location
    return {
      top: element ? `${element.y + 20}px` : '100px',
      left: element ? `${element.x + element.width + 20}px` : '100px'
    }
  }
  
  const position = getPosition()
  
  return (
    <div 
      className={`fixed z-50 bg-white rounded-lg shadow-xl transition-all duration-300 ${
        minimized ? 'w-12 h-12' : 'w-96'
      } animate-fadeIn backdrop-blur-sm bg-opacity-95 border border-gray-100`}
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {minimized ? (
        <button 
          onClick={handleMinimize}
          className="w-full h-full flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {/* Comment indicator */}
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </button>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-7 w-7 bg-blue-100 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900">Voice Interaction</h3>
                <p className="text-xs text-gray-500">{element?.label}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={handleMinimize}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Minimize"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
              <button 
                onClick={handleClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto max-h-96 scrollbar-thin">
            {isListening ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute animate-ping h-4 w-4 rounded-full bg-blue-400 opacity-75"></div>
                      <div className="relative h-3 w-3 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                </div>
                <p className="text-blue-700 font-medium">Listening...</p>
                <p className="text-sm text-gray-500 mt-2 text-center">Speak clearly to add comments or request changes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      message.startsWith('You:') 
                        ? 'bg-blue-50 ml-6 border-l-2 border-blue-300' 
                        : 'bg-gray-50 mr-6 border-l-2 border-indigo-300'
                    }`}
                  >
                    {message.startsWith('You:') ? (
                      <>
                        <div className="flex items-center mb-1.5">
                          <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-blue-700">You</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.substring(5)}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-1.5">
                          <div className="h-5 w-5 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-indigo-700">AI</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.substring(4)}</p>
                      </>
                    )}
                  </div>
                ))}
                
                {transcript && !conversations.some(m => m.includes(transcript)) && (
                  <div className="p-3 rounded-lg bg-blue-50 ml-6 border-l-2 border-blue-300 animate-pulse">
                    <div className="flex items-center mb-1.5">
                      <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-blue-700">You</span>
                    </div>
                    <p className="text-sm text-gray-700">{transcript}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-100">
            <div className="flex">
              <input 
                type="text" 
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Type your change request..."
                disabled={isListening}
              />
              <button 
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-md hover:from-blue-600 hover:to-indigo-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="text-sm">Send</span>
              </button>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                AI will generate design changes based on your requests
              </div>
              <button className="text-indigo-500 hover:text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}