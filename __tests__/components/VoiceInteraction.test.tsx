import { render, screen, fireEvent, act } from '@testing-library/react'
import VoiceInteraction from '@/components/VoiceInteraction'

// Mock timers
jest.useFakeTimers()

describe('VoiceInteraction Component', () => {
  const mockElement = {
    id: 'test-element',
    label: 'Test Element',
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    notes: 'Test notes'
  }
  
  const mockOnVoiceEnd = jest.fn()
  
  beforeEach(() => {
    mockOnVoiceEnd.mockClear()
  })
  
  it('renders in listening state initially', () => {
    render(
      <VoiceInteraction 
        elementId="test-element"
        onVoiceEnd={mockOnVoiceEnd}
        element={mockElement}
      />
    )
    
    // Check for listening state
    expect(screen.getByText('Listening...')).toBeInTheDocument()
    expect(screen.getByText(`Voice Interaction - ${mockElement.label}`)).toBeInTheDocument()
  })
  
  it('transitions from listening to transcript after a delay', () => {
    render(
      <VoiceInteraction 
        elementId="test-element"
        onVoiceEnd={mockOnVoiceEnd}
        element={mockElement}
      />
    )
    
    // Initially in listening state
    expect(screen.getByText('Listening...')).toBeInTheDocument()
    
    // Fast-forward time to simulate voice recognition completing
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // Should now show the transcript
    expect(screen.getByText(/Make this component larger/)).toBeInTheDocument()
  })
  
  it('can be minimized and maximized', () => {
    render(
      <VoiceInteraction 
        elementId="test-element"
        onVoiceEnd={mockOnVoiceEnd}
        element={mockElement}
      />
    )
    
    // Find the minimize button - use a more specific query
    const buttons = screen.getAllByRole('button')
    const minimizeButton = buttons.find(button => button.querySelector('svg path[d="M18 12H6"]'))
    expect(minimizeButton).toBeDefined()
    if (minimizeButton) {
      fireEvent.click(minimizeButton)
    }
    
    // Component should be minimized
    expect(screen.queryByText('Listening...')).not.toBeInTheDocument()
    
    // Find the maximize button and click it - now there should be only one button
    const maximizeButton = screen.getByRole('button')
    fireEvent.click(maximizeButton)
    
    // Component should be maximized again
    expect(screen.getByText('Listening...')).toBeInTheDocument()
  })
  
  it('calls onVoiceEnd when interaction is complete', () => {
    render(
      <VoiceInteraction 
        elementId="test-element"
        onVoiceEnd={mockOnVoiceEnd}
        element={mockElement}
      />
    )
    
    // Fast-forward time to simulate voice recognition completing
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    // Fast-forward more time to simulate AI response
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // Fast-forward more time to simulate auto-close
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    
    // onVoiceEnd should have been called
    expect(mockOnVoiceEnd).toHaveBeenCalled()
  })
})