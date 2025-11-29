import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/utils/cn'

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  icon: LucideIcon
  isLoading?: boolean
  isLoadingLabel?: string
}

export const SocialLoginButton = ({
  label,
  icon: Icon,
  isLoading = false,
  isLoadingLabel,
  disabled,
  className = '',
  type = 'button',
  ...props
}: SocialLoginButtonProps) => {
  return (
    <Button
      type={type}
      variant="outline"
      disabled={disabled || isLoading}
      className={cn('w-full', className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {isLoadingLabel ?? label}
        </>
      ) : (
        <>
          <Icon className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
