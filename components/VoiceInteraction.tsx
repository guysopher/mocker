'use client'

import { useState, useEffect, useRef } from 'react'

// Add these type declarations at the top of the file
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
    recognition?: any;
  }
}

interface VoiceInteractionProps {
  isListening?: boolean
  isActive?: boolean
  eventTarget?: EventTarget
  elementId?: string
  onVoiceEnd?: (changeRequest: string) => void
  element?: any // Using any for simplicity, should be properly typed
}

// Then modify the existing line to check if window is defined (for SSR compatibility)
const SpeechRecognition = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export default function VoiceInteraction({ elementId, onVoiceEnd, element, isActive }: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [minimized, setMinimized] = useState(false)
  const [conversations, setConversations] = useState<string[]>([])
  const [notes, setNotes] = useState<string[]>(element?.notes || [])
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [newNote, setNewNote] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // Check if we can access microphone permissions
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(permissionStatus.state === 'granted');

      // Listen for permission changes
      permissionStatus.addEventListener('change', () => {
        setHasPermission(permissionStatus.state === 'granted');
      });
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      // Fallback to getUserMedia if permissions API is not supported
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (err) {
        console.error('Microphone permission denied:', err);
        setHasPermission(false);
      }
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setIsListening(true);
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    if (!isActive) {
      setIsListening(false);
      if (transcript) {
        console.log("Submitting change request:", transcript)
        onVoiceEnd?.(transcript);
      }
      setTranscript('');
      try {
        window.recognition.stop();
      } catch (error) {
        // console.error('Speech recognition error:', error);
      }
    } else {
      setIsListening(true);
      try {
        window.recognition.start();
      } catch (error) {
        // console.error('Speech recognition error:', error);
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (!hasPermission) {
      requestMicrophonePermission();
    }
    const recognitionInstance = new SpeechRecognition();
    // recognitionInstance.stop();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US'; // Default language
    recognitionInstance.onerror = (event: any) => {
      console.log('Speech recognition error:', event);
    };
    // recognitionInstance.onnomatch = (event: any) => {
    //   console.log('Speech recognition no match:', event);
    // };
    // recognitionInstance.onprogress = (event: any) => {
    //   console.log('Speech recognition progress:', event);
    // };
    // recognitionInstance.onsoundstart = (event: any) => {
    //   console.log('Speech recognition sound start:', event);
    // };
    // recognitionInstance.onsoundend = (event: any) => {
    //   console.log('Speech recognition sound end:', event);
    // };
    // recognitionInstance.onaudiostart = (event: any) => {
    //   console.log('Speech recognition audio start:', event);
    // };
    // recognitionInstance.onaudioend = (event: any) => {
    //   console.log('Speech recognition audio end:', event);
    // };

    recognitionInstance.onresult = (event: any) => {
      // console.log('Speech recognition result:', event);
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      // console.log('finalTranscript', finalTranscript);
      setTranscript(finalTranscript + interimTranscript);
    };

    recognitionInstance.onstart = () => {
      // console.log('Speech recognition onstart');
      setIsRecognitionActive(true);
    };

    recognitionInstance.onend = () => {
      // console.log('Speech recognition onend');
      setIsRecognitionActive(false);
    };

    window.recognition = recognitionInstance;
  }, [])

  // Simulated voice recognition
  useEffect(() => {
    if (isListening) {
      setTranscript('')
      if (!isRecognitionActive) {
        try {
          // Request microphone permission first
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              window.recognition.start();
            })
            .catch((error) => {
              // console.error('Microphone permission denied:', error);
              setIsListening(false);
            });
        } catch (error) {
          // console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      }
    }
  }, [isListening])

  return (
    isActive ? (
      <div
        ref={popupRef}
        className="fixed z-50 bg-white/95 rounded-full shadow-2xl transition-all duration-300 animate-fadeIn backdrop-blur-md border border-white/20 flex items-center"
        style={{
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
          <textarea
            ref={inputRef}
            value={transcript}
            readOnly
            className="w-full bg-white rounded-full px-4 py-2 text-gray-700 focus:outline-none font-size-2xl"
            placeholder="Listening..."
            rows={4}
          />
        </div>
      </div>
    ) : (
      null
    )
  )
}