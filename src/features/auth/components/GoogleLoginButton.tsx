import { Loader2 } from 'lucide-react'

import { useGoogleLoginButton } from '../hooks/useGoogleLoginButton'

import { GoogleIcon } from '@/features/auth/components/icons/SocialIcons'
import { Button } from '@/shared/ui/Button'


interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  accountType: 'personal' | 'business'
}

export const GoogleLoginButton = ({ onSuccess, onError, accountType }: GoogleLoginButtonProps) => {
  const { isLoading, isGoogleLoaded, handleGoogleLogin } = useGoogleLoginButton({
    accountType,
    onSuccess,
    onError,
  })

  return (
    <Button
      type="button"
      variant="ghost"
      size="md"
      disabled={!isGoogleLoaded || isLoading}
      onClick={handleGoogleLogin}
      icon={isLoading ? undefined : GoogleIcon}
      className="w-full h-9 bg-auth-bg border border-auth-border text-white rounded-lg transition-colors duration-200 hover:bg-auth-bg/80"
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
