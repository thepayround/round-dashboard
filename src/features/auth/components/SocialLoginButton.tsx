import { Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { Button } from '@/shared/ui/Button'

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: LucideIcon
  isLoading?: boolean
  isLoadingLabel?: string
}

export const SocialLoginButton = ({
  label,
  icon,
  isLoading = false,
  isLoadingLabel,
  disabled,
  className = '',
  type = 'button',
  ...props
}: SocialLoginButtonProps) => {
  const Icon = icon

  return (
    <Button
      type={type}
      variant="ghost"
      size="md"
      icon={ isLoading ? undefined : Icon}
      disabled={disabled || isLoading}
      className={`w-full h-9 bg-auth-bg text-white rounded-lg border border-auth-bg-hover hover:border-auth-bg-hover transition-colors duration-200 hover:bg-auth-bg/80 ${className}`}
      {...props}
    >
      { isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          { isLoadingLabel ?? label}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
