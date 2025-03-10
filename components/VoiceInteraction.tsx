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
  const [notes, setNotes] = useState<string[]>(element?.notes || [])
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [newNote, setNewNote] = useState('')
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
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()])
      setNewNote('')
      setShowNoteInput(false)
    }
  }
  
  return (
    <div 
      className={`fixed z-50 bg-white/90 rounded-xl shadow-2xl transition-all duration-300 ${
        minimized ? 'w-12 h-12' : 'w-96'
      } animate-fadeIn backdrop-blur-md border border-white/20`}
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
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100/50 bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-500/10 rounded-t-xl">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 bg-blue-500 rounded-full mr-3 shadow-lg shadow-blue-500/50 transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">Voice Interaction</h3>
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
          
          <div className="p-4 flex-1 overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
            {/* Notes Section */}
            <div className="mb-4 border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                <button
                  onClick={() => setShowNoteInput(true)}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Note
                </button>
              </div>
              
              {showNoteInput && (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                    placeholder="Type your note..."
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              )}

              {notes.length > 0 ? (
                <div className="space-y-2">
                  {notes.map((note, index) => (
                    <div key={index} className="text-sm bg-yellow-50 p-2 rounded-md border-l-2 border-yellow-300">
                      {note}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              )}
            </div>

            {/* Alternatives Button */}
            <div className="mb-4 border-b border-gray-100 pb-4">
              <button
                className="w-full py-2 px-4 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                onClick={() => {/* Handle alternatives */}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Show Alternatives
              </button>
            </div>

            {isListening ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="relative mb-6 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
                  </div>
                </div>
                <p className="text-blue-700 font-medium text-lg">Listening...</p>
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
          
          <div className="p-4 border-t border-gray-100/50 bg-gradient-to-b from-transparent to-white/50">
            <div className="flex">
              <input 
                type="text" 
                className="flex-1 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                placeholder="Type your change request..."
                disabled={isListening}
              />
              <button 
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-r-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center"
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