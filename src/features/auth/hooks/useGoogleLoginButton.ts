import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/shared/hooks/useAuth'
import { authService } from '@/shared/services/api/auth.service'
import type { User, BusinessUser, PersonalUser } from '@/shared/types/auth'

interface GoogleLoginButtonParams {
  accountType: 'personal' | 'business'
  onSuccess?: () => void
  onError?: (message: string) => void
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

const GOOGLE_CLIENT_ID = '217334137992-9tkf7qm1boj8rhcqjmk69ihrsq4rtgun.apps.googleusercontent.com'

export const useGoogleLoginButton = ({
  accountType,
  onSuccess,
  onError,
}: GoogleLoginButtonParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
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

  const handleTokenResponse = useCallback(
    async (response: GoogleTokenResponse) => {
      try {
        if (!response.access_token) {
          setIsLoading(false)
          onError?.('No access token received from Google')
          return
        }

        const result = await authService.googleAuth({
          accessToken: response.access_token,
        })

        if (result.success && result.data) {
          const baseUser = {
            ...result.data.user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

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
                taxId: '',
              },
            } as BusinessUser
          } else {
            fullUser = {
              ...baseUser,
              accountType: 'personal',
              role: 'admin' as const,
            } as PersonalUser
          }

          await login(fullUser, result.data.accessToken)
          onSuccess?.()

          if (accountType === 'business') {
            navigate('/get-started')
          } else {
            navigate('/dashboard')
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
    },
    [accountType, login, navigate, onError, onSuccess]
  )

  const handleGoogleLogin = useCallback(() => {
    if (!isGoogleLoaded || !window.google?.accounts?.oauth2) {
      onError?.('Google OAuth 2.0 library not loaded')
      return
    }

    setIsLoading(true)

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile https://www.googleapis.com/auth/user.phonenumbers.read',
      callback: handleTokenResponse,
    })

    client.requestAccessToken()
  }, [handleTokenResponse, isGoogleLoaded, onError])

  return {
    isLoading,
    isGoogleLoaded,
    handleGoogleLogin,
  }
}
