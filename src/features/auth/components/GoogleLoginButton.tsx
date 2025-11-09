import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { GoogleIcon } from '@/features/auth/components/icons/SocialIcons'
import { Button } from '@/shared/components/Button'
import { useAuth } from '@/shared/hooks/useAuth'
import { authService } from '@/shared/services/api/auth.service'
import type { User, BusinessUser, PersonalUser } from '@/shared/types/auth'

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  accountType: 'personal' | 'business'
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

export const GoogleLoginButton = ({ onSuccess, onError, accountType }: GoogleLoginButtonProps) => {
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
        
        // Set account type based on login page and create properly typed user
        let fullUser: User
        if (accountType === 'business') {
          fullUser = {
            ...baseUser,
            accountType: 'business',
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
          } as BusinessUser
        } else {
          fullUser = {
            ...baseUser,
            accountType: 'personal',
            role: 'admin' as const,
          } as PersonalUser
        }

        // Update auth context
        await login(fullUser, result.data.accessToken)
        
        onSuccess?.()
        
        // Navigate based on account type
        if (accountType === 'business') {
          navigate('/get-started') // Business users complete setup
        } else {
          navigate('/dashboard') // Personal users go to dashboard
        }
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
    <Button
      type="button"
      variant="ghost"
      size="md"
      disabled={!isGoogleLoaded || isLoading}
      onClick={handleGoogleLogin}
      icon={isLoading ? undefined : GoogleIcon}
      className="w-full h-9 btn-social"
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </span>
      ) : (
        'Google'
      )}
    </Button>
  )
}
