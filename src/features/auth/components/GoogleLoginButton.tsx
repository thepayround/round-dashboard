import { useGoogleLoginButton } from '../hooks/useGoogleLoginButton'

import { SocialLoginButton } from './SocialLoginButton'

import { GoogleIcon } from '@/features/auth/components/icons/SocialIcons'


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
    <SocialLoginButton
      label="Google"
      icon={GoogleIcon}
      isLoading={isLoading}
      isLoadingLabel="Signing in..."
      disabled={!isGoogleLoaded}
      onClick={handleGoogleLogin}
    />
  )
}
