import { Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { Button } from '@/shared/ui/Button'

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: LucideIcon
  loading?: boolean
  loadingLabel?: string
}

export const SocialLoginButton = ({
  label,
  icon,
  loading = false,
  loadingLabel,
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
      icon={loading ? undefined : Icon}
      disabled={disabled || loading}
      className={`w-full h-9 bg-auth-bg text-white rounded-lg border border-auth-bg-hover hover:border-auth-bg-hover transition-colors duration-200 hover:bg-auth-bg/80 ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel ?? label}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
