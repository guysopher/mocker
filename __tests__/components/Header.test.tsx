import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header Component', () => {
  it('renders header with logo and title', () => {
    render(<Header />)
    
    // Check if the app title is in the document
    expect(screen.getByText('App Creator')).toBeInTheDocument()
    
    // Check if the logo is in the document
    const logo = screen.getByAltText('Wix Logo')
    expect(logo).toBeInTheDocument()
    
    // Check if navigation buttons are in the document
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})