import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AppDescriptionForm from '@/components/AppDescriptionForm'

describe('AppDescriptionForm Component', () => {
  const mockOnSubmit = jest.fn()
  
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })
  
  it('renders the form with input field and submit button', () => {
    render(<AppDescriptionForm onSubmit={mockOnSubmit} isGenerating={false} />)
    
    // Check if the label is present
    expect(screen.getByLabelText(/Describe your app/i)).toBeInTheDocument()
    
    // Check if the textarea is present
    expect(screen.getByPlaceholderText(/Describe the app you want to create/i)).toBeInTheDocument()
    
    // Check if the submit button is present
    expect(screen.getByRole('button', { name: /Create My App/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create My App/i })).toBeDisabled()
  })
  
  it('enables the submit button when text is entered', async () => {
    render(<AppDescriptionForm onSubmit={mockOnSubmit} isGenerating={false} />)
    
    const textarea = screen.getByPlaceholderText(/Describe the app you want to create/i)
    const submitButton = screen.getByRole('button', { name: /Create My App/i })
    
    // Button should be disabled initially
    expect(submitButton).toBeDisabled()
    
    // Enter text in the textarea
    await userEvent.type(textarea, 'A test app description')
    
    // Button should be enabled now
    expect(submitButton).toBeEnabled()
  })
  
  it('calls onSubmit when form is submitted', async () => {
    render(<AppDescriptionForm onSubmit={mockOnSubmit} isGenerating={false} />)
    
    const textarea = screen.getByPlaceholderText(/Describe the app you want to create/i)
    const submitButton = screen.getByRole('button', { name: /Create My App/i })
    
    // Enter text in the textarea
    await userEvent.type(textarea, 'A test app description')
    
    // Submit the form
    await userEvent.click(submitButton)
    
    // Check if onSubmit was called with the correct value
    expect(mockOnSubmit).toHaveBeenCalledWith('A test app description')
  })
  
  it('disables the form when isGenerating is true', () => {
    render(<AppDescriptionForm onSubmit={mockOnSubmit} isGenerating={true} />)
    
    const textarea = screen.getByPlaceholderText(/Describe the app you want to create/i)
    
    // Textarea should be disabled
    expect(textarea).toBeDisabled()
    
    // Button should show loading state
    expect(screen.getByText(/Generating.../i)).toBeInTheDocument()
  })
})