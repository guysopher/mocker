import { render, screen, fireEvent } from '@testing-library/react'
import { WireframeView } from '@/components/views/WireframeView'

describe('WireframeView Component', () => {
  const mockElements = [
    { 
      id: 'header', 
      type: 'container', 
      x: 50, 
      y: 50, 
      width: 800, 
      height: 80, 
      label: 'Header', 
      notes: 'Main navigation header',
      hasComments: false
    },
    { 
      id: 'button', 
      type: 'button', 
      x: 100, 
      y: 200, 
      width: 150, 
      height: 50, 
      label: 'Action Button', 
      notes: 'Primary action button',
      hasComments: true
    }
  ]
  
  const mockOnElementClick = jest.fn()
  
  beforeEach(() => {
    mockOnElementClick.mockClear()
  })
  
  it('renders all provided elements', () => {
    render(
      <WireframeView 
        elements={mockElements} 
        onElementClick={mockOnElementClick}
        activeElement={null}
      />
    )
    
    // Check if the elements are rendered with their labels
    expect(screen.getByText('Header')).toBeInTheDocument()
    
    // Use getAllByText since "Action Button" appears multiple times
    const actionButtons = screen.getAllByText('Action Button')
    expect(actionButtons.length).toBeGreaterThan(0)
  })
  
  it('calls onElementClick when an element is clicked', () => {
    render(
      <WireframeView 
        elements={mockElements} 
        onElementClick={mockOnElementClick}
        activeElement={null}
      />
    )
    
    // Click on the header element
    fireEvent.click(screen.getByText('Header'))
    
    // Check if the onElementClick callback was called with the correct ID
    expect(mockOnElementClick).toHaveBeenCalledWith('header')
  })
  
  it('displays comment badge for elements with comments', () => {
    render(
      <WireframeView 
        elements={mockElements} 
        onElementClick={mockOnElementClick}
        activeElement={null}
      />
    )
    
    // Look for SVG elements that would be in the comment badge
    const badges = document.querySelectorAll('svg path[d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"]')
    expect(badges.length).toBeGreaterThan(0)
  })
  
  it('displays AI notes when an element is active', () => {
    render(
      <WireframeView 
        elements={mockElements} 
        onElementClick={mockOnElementClick}
        activeElement="header"
      />
    )
    
    // Check if the AI notes are displayed
    expect(screen.getByText('AI Notes:')).toBeInTheDocument()
    expect(screen.getByText('Main navigation header')).toBeInTheDocument()
  })
})