import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/shared/services/api/auth.service'
import { useAuth } from '@/shared/hooks/useAuth'

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface GoogleTokenClient {
  requestAccessToken: () => void
}

interface GoogleOAuth2Config {
  client_id: string
  scope: string
  callback: (response: GoogleTokenResponse) => void
}

interface GoogleTokenResponse {
  access_token?: string
  error?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: GoogleOAuth2Config) => GoogleTokenClient
        }
      }
    }
  }
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export const GoogleLoginButton = ({ onSuccess, onError }: GoogleLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      if (window.google?.accounts?.oauth2) {
        setIsGoogleLoaded(true)
      }
    }

    script.onerror = () => {
      onError?.('Failed to load Google OAuth library')
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [onError])

  const handleGoogleLogin = () => {
    if (!isGoogleLoaded || !window.google?.accounts?.oauth2) {
      onError?.('Google OAuth 2.0 library not loaded')
      return
    }

    setIsLoading(true)

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: '217334137992-9tkf7qm1boj8rhcqjmk69ihrsq4rtgun.apps.googleusercontent.com',
      scope: 'openid email profile https://www.googleapis.com/auth/user.phonenumbers.read',
      callback: handleTokenResponse,
    })

    client.requestAccessToken()
  }

  const handleTokenResponse = async (response: GoogleTokenResponse) => {
    try {
      if (!response.access_token) {
        setIsLoading(false)
        onError?.('No access token received from Google')
        return
      }

      // Send the access token to the backend
      const result = await authService.googleAuth({
        accessToken: response.access_token,
      })

      if (result.success && result.data) {
        // Convert the API user to the full User type expected by the login function
        const baseUser = {
          ...result.data.user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        // CHANGE: Google OAuth now always creates business accounts
        const fullUser = {
          ...baseUser,
          accountType: 'business' as const,
          role: 'admin' as const,
          companyInfo: {
            companyName: '',
            registrationNumber: '',
            currency: undefined,
            businessType: undefined,
            industry: undefined,
            website: '',
            taxId: ''
          }
        }
        
        // Update auth context
        await login(fullUser, result.data.accessToken)
        
        onSuccess?.()
        
        // Google OAuth users always go to get-started to complete business setup
        navigate('/get-started')
      } else {
        const errorMessage = result.error ?? 'Google authentication failed'
        onError?.(errorMessage)
        console.error('Google auth error:', errorMessage)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google authentication failed'
      onError?.(errorMessage)
      console.error('Google auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      disabled={!isGoogleLoaded || isLoading}
      onClick={handleGoogleLogin}
      className="w-full h-11 md:h-9 px-4 py-1.5 
                 bg-white/6 backdrop-blur-xl border border-white/10 rounded-lg
                 text-white font-light text-xs
                 hover:bg-white/8 hover:border-white/15
                 transition-all duration-150 ease-out
                 flex items-center justify-center gap-2
                 relative overflow-hidden group
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
      {isLoading ? (
        <>
          <svg className="w-4 h-4 z-10 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="z-10">Signing in...</span>
        </>
      ) : (
        <>
          <div className="w-5 h-5 z-10">
            <GoogleIcon />
          </div>
          <span className="z-10">Google</span>
        </>
      )}
    </button>
  )
}