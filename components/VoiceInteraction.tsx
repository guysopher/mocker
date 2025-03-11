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
  const popupRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
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
  
  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onVoiceEnd()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onVoiceEnd])
  
  // Simulate transcription when listening - starts automatically now
  useEffect(() => {
    if (isListening) {
      const words = [
        "Hello",
        "I want to",
        "I want to make this",
        "I want to make this component",
        "I want to make this component larger"
      ]
      
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setTranscript(words[currentIndex])
          currentIndex++
        } else {
          setIsListening(false)
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isListening])
  
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
  
  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTranscript('')
    }
  }
  
  return (
    <div 
      ref={popupRef}
      className="fixed z-50 bg-white/95 rounded-full shadow-2xl transition-all duration-300 animate-fadeIn backdrop-blur-md border border-white/20 flex items-center"
      style={{
        top: position.top,
        left: position.left,
        width: transcript ? '600px' : '180px',
        height: '180px',
        padding: '20px'
      }}
    >
      <div className="h-full aspect-square rounded-full flex items-center justify-center group relative">
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-75 blur transition duration-1000 ${isListening ? 'animate-pulse' : ''}`}></div>
          <div className={`relative w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl ${isListening ? 'scale-110' : ''} transition-transform duration-300`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-14 w-14 text-white transform transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            </svg>
            {isListening && (
              <div className="absolute inset-0 rounded-full animate-pulse-ring"></div>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`flex-1 ml-4 transition-opacity duration-300 ${transcript ? 'opacity-100' : 'opacity-0'}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={transcript}
          readOnly
          className="w-full bg-gray-50/50 border border-gray-200 rounded-full px-4 py-2 text-gray-700 focus:outline-none"
          placeholder="Listening..."
        />
      </div>
    </div>
  )
}