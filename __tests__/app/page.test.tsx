import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// We need to mock the useState hook for testing Next.js server components
jest.mock('react', () => {
  const originalReact = jest.requireActual('react')
  return {
    ...originalReact,
    useState: jest.fn((initialValue) => [initialValue, jest.fn()]),
    useEffect: jest.fn((cb) => cb()),
  }
})

// Mock the components used in the page
jest.mock('@/components/Canvas', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-canvas">Mock Canvas</div>
}))

jest.mock('@/components/AppDescriptionForm', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-app-description-form">Mock App Description Form</div>
}))

jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header">Mock Header</div>
}))

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    
    // Check if the header is rendered
    expect(screen.getByTestId('mock-header')).toBeInTheDocument()
  })
  
  it('renders initial app description form', () => {
    render(<Home />)
    
    // Check if the app description form is rendered 
    expect(screen.getByTestId('mock-app-description-form')).toBeInTheDocument()
    
  })
})