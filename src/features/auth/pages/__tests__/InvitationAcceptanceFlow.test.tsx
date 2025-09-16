import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { InvitationAcceptancePage } from '../InvitationAcceptancePage'
import { teamService } from '@/shared/services/api/team.service'
import type { ValidateInvitationResponse } from '@/shared/services/api/team.service'
import { UserRole } from '@/shared/services/api/team.service'

// Mock the team service
jest.mock('@/shared/services/api/team.service')
const mockedTeamService = teamService as jest.Mocked<typeof teamService>

// Mock react-router-dom
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams('?token=valid-token')],
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('InvitationAcceptancePage', () => {
  const mockValidInvitation: ValidateInvitationResponse = {
    invitationId: '123',
    roundAccountId: '456',
    email: 'john@example.com',
    role: UserRole.Developer,
    roleName: 'Developer',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    organizationName: 'Acme Corp',
    inviterName: 'Jane Smith',
    inviterEmail: 'jane@acmecorp.com'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Token Validation', () => {
    it('should show loading state while validating token', async () => {
      // Mock a pending promise
      mockedTeamService.validateInvitation.mockReturnValue(new Promise(() => {}))

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      expect(screen.getByText('Validating invitation...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument() // Loading spinner
    })

    it('should show error state for invalid token', async () => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: false,
        data: undefined,
        message: 'Invalid invitation token',
        error: 'Invalid invitation token'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Invalid Invitation')).toBeInTheDocument()
        expect(screen.getByText('Invalid invitation token')).toBeInTheDocument()
        expect(screen.getByText('Go to Login')).toBeInTheDocument()
      })
    })

    it('should show error state for expired token', async () => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: false,
        data: undefined,
        message: 'This invitation has expired.',
        error: 'This invitation has expired.'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Invalid Invitation')).toBeInTheDocument()
        expect(screen.getByText('This invitation has expired.')).toBeInTheDocument()
      })
    })

    it('should navigate to login when clicking Go to Login button', async () => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: false,
        data: undefined,
        message: 'Invalid invitation token',
        error: 'Invalid invitation token'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const loginButton = screen.getByText('Go to Login')
        fireEvent.click(loginButton)
        expect(mockNavigate).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('Valid Invitation Display', () => {
    beforeEach(() => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: true,
        data: mockValidInvitation,
        message: 'Invitation validated successfully'
      })
    })

    it('should display invitation details correctly', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText("You're Invited!")).toBeInTheDocument()
        expect(screen.getByText('Acme Corp')).toBeInTheDocument()
        expect(screen.getByText(/Jane Smith has invited you to join as a Developer/)).toBeInTheDocument()
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
        expect(screen.getByText('Verified from invitation')).toBeInTheDocument()
      })
    })

    it('should pre-fill and disable email field', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const emailField = screen.getByDisplayValue('john@example.com') as HTMLInputElement
        expect(emailField).toBeInTheDocument()
        expect(emailField.disabled).toBe(true)
        expect(emailField).toHaveClass('bg-green-500/5', 'border-green-500/20')
      })
    })

    it('should show Round logo and branding', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText('Round')).toBeInTheDocument()
        // WhiteLogo component should be rendered
        expect(document.querySelector('.w-8.h-8')).toBeInTheDocument()
      })
    })
  })

  describe('Registration Form', () => {
    beforeEach(() => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: true,
        data: mockValidInvitation,
        message: 'Invitation validated successfully'
      })
    })

    it('should render all required form fields', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText('First Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
        expect(screen.getByLabelText('Create Password')).toBeInTheDocument()
        expect(screen.getByText('Join Acme Corp')).toBeInTheDocument()
      })
    })

    it('should disable submit button when form is invalid', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        expect(submitButton).toBeDisabled()
      })
    })

    it('should enable submit button when form is valid', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText('First Name')
        const lastNameInput = screen.getByLabelText('Last Name')
        const phoneInput = screen.getByLabelText('Phone Number')
        const passwordInput = screen.getByLabelText('Create Password')

        fireEvent.change(firstNameInput, { target: { value: 'John' } })
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
        fireEvent.change(phoneInput, { target: { value: '+1234567890' } })
        fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } })
      })

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        expect(submitButton).not.toBeDisabled()
      })
    })

    it('should toggle password visibility when eye icon is clicked', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const passwordInput = screen.getByLabelText('Create Password') as HTMLInputElement
        const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button

        expect(passwordInput.type).toBe('password')
        
        fireEvent.click(toggleButton)
        expect(passwordInput.type).toBe('text')
        
        fireEvent.click(toggleButton)
        expect(passwordInput.type).toBe('password')
      })
    })

    it('should show validation errors for invalid fields', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText('First Name')
        const passwordInput = screen.getByLabelText('Create Password')

        // Test invalid first name
        fireEvent.change(firstNameInput, { target: { value: '' } })
        fireEvent.blur(firstNameInput)

        // Test invalid password
        fireEvent.change(passwordInput, { target: { value: '123' } })
        fireEvent.blur(passwordInput)
      })

      await waitFor(() => {
        expect(screen.getByText(/first name/i)).toBeInTheDocument()
        expect(screen.getByText(/password/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    beforeEach(() => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: true,
        data: mockValidInvitation,
        message: 'Invitation validated successfully'
      })
    })

    it('should call registerWithInvitation with correct data on form submission', async () => {
      mockedTeamService.registerWithInvitation.mockResolvedValue({
        success: true,
        data: { 
          message: 'Registration successful',
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567890',
            accountType: 'business' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyInfo: {
              companyName: 'Test Company',
              registrationNumber: '123456789',
              currency: 'USD',
              industry: 'technology',
              businessType: 'llc',
              employeeCount: 25,
              taxId: 'TAX-123456789'
            },
            role: 'admin' as const
          }
        },
        message: 'Registration successful'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      // Fill out form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } })
        fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'SecurePassword123!' } })
      })

      // Submit form
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(mockedTeamService.registerWithInvitation).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'SecurePassword123!',
          phoneNumber: '+1234567890',
          token: 'valid-token'
        })
      })
    })

    it('should navigate to dashboard on successful registration', async () => {
      mockedTeamService.registerWithInvitation.mockResolvedValue({
        success: true,
        data: { 
          message: 'Registration successful',
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567890',
            accountType: 'business' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyInfo: {
              companyName: 'Test Company',
              registrationNumber: '123456789',
              currency: 'USD',
              industry: 'technology',
              businessType: 'llc',
              employeeCount: 25,
              taxId: 'TAX-123456789'
            },
            role: 'admin' as const
          }
        },
        message: 'Registration successful'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      // Fill out and submit form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } })
        fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'SecurePassword123!' } })
        
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
      })
    })

    it('should show error message on registration failure', async () => {
      mockedTeamService.registerWithInvitation.mockResolvedValue({
        success: false,
        data: undefined,
        message: 'Registration failed',
        error: 'Registration failed'
      })

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      // Fill out and submit form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } })
        fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'SecurePassword123!' } })
        
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument()
      })
    })

    it('should show loading state during registration', async () => {
      mockedTeamService.registerWithInvitation.mockReturnValue(new Promise(() => {})) // Pending promise

      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      // Fill out and submit form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } })
        fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'SecurePassword123!' } })
        
        const submitButton = screen.getByRole('button', { name: /join acme corp/i })
        fireEvent.click(submitButton)
      })

      await waitFor(() => {
        expect(screen.getByText('Joining Organization...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /joining organization/i })).toBeDisabled()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: true,
        data: mockValidInvitation,
        message: 'Invitation validated successfully'
      })
      
      mockedTeamService.registerWithInvitation.mockResolvedValue({
        success: true,
        data: { 
          message: 'Registration successful',
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567890',
            accountType: 'business' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            companyInfo: {
              companyName: 'Test Company',
              registrationNumber: '123456789',
              currency: 'USD',
              industry: 'technology',
              businessType: 'llc',
              employeeCount: 25,
              taxId: 'TAX-123456789'
            },
            role: 'admin' as const
          }
        },
        message: 'Registration successful'
      })
    })

    it('should submit form when Enter key is pressed and form is valid', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      // Fill out form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } })
        fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'SecurePassword123!' } })
      })

      // Press Enter
      await waitFor(() => {
        fireEvent.keyDown(document.body, { key: 'Enter', code: 'Enter' })
      })

      await waitFor(() => {
        expect(mockedTeamService.registerWithInvitation).toHaveBeenCalled()
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockedTeamService.validateInvitation.mockResolvedValue({
        success: true,
        data: mockValidInvitation,
        message: 'Invitation validated successfully'
      })
    })

    it('should have proper labels and ARIA attributes', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByLabelText('First Name')).toHaveAttribute('required')
        expect(screen.getByLabelText('Last Name')).toHaveAttribute('required')
        expect(screen.getByLabelText('Phone Number')).toHaveAttribute('required')
        expect(screen.getByLabelText('Create Password')).toHaveAttribute('required')
        
        // Email field should be disabled and have proper styling
        const emailField = screen.getByDisplayValue('john@example.com')
        expect(emailField).toBeDisabled()
      })
    })

    it('should show proper error messages with alert icons', async () => {
      render(
        <TestWrapper>
          <InvitationAcceptancePage />
        </TestWrapper>
      )

      await waitFor(() => {
        const passwordInput = screen.getByLabelText('Create Password')
        fireEvent.change(passwordInput, { target: { value: '123' } })
        fireEvent.blur(passwordInput)
      })

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert')
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage.querySelector('svg')).toBeInTheDocument() // Alert icon
      })
    })
  })
})