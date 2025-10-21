import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card elevation level (0 = flat, 1 = raised, 2 = popover) */
  elevation?: 0 | 1 | 2
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Whether card is clickable/interactive */
  clickable?: boolean
  /** Whether to show border */
  bordered?: boolean
  'data-testid'?: string
}

interface CardSubComponentProps extends HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  'data-testid'?: string
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  'data-testid'?: string
}

/**
 * Dev-SaaS Minimal Card Component
 * 
 * Influenced by: Polar minimalist cards
 * 
 * Features:
 * - Airy design with generous radius
 * - Elevation system (no borders by default)
 * - Shadow-based depth instead of borders
 * - Clean backgrounds using HSL tokens
 * 
 * Elevation:
 * - 0: Flat (no shadow)
 * - 1: Card (subtle shadow)
 * - 2: Popover/menu (prominent shadow)
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className,
    elevation = 1,
    padding = 'md',
    clickable = false,
    bordered = false,
    children,
    ...props
  }, ref) => {
    const elevationClasses = {
      0: '',
      1: 'shadow-card',
      2: 'shadow-hover',
    }
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-card',
          elevationClasses[elevation],
          paddingClasses[padding],
          bordered && 'border border-border',
          clickable && 'cursor-pointer hover:shadow-hover transition-shadow duration-base',
          className
        )}
        onClick={props.onClick}
        onKeyDown={props.onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            props.onClick?.(e as any);
          }
        } : undefined}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        role={props.role ?? (props.onClick ? 'button' : undefined)}
        tabIndex={props.onClick ? 0 : undefined}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
        aria-describedby={props['aria-describedby']}
        data-testid={props['data-testid']}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

/** Card Header Component */
export const CardHeader = ({
  className,
  children,
  onClick,
  role,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
}: CardSubComponentProps) => (
  <div
    className={cn('flex items-center justify-between mb-4', className)}
    onClick={onClick}
    onKeyDown={onClick ? (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as any);
      }
    } : undefined}
    role={role ?? (onClick ? 'button' : undefined)}
    tabIndex={onClick ? 0 : undefined}
    id={id}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    data-testid={dataTestId}
  >
    {children}
  </div>
)

CardHeader.displayName = 'CardHeader'

/** Card Title Component */
export const CardTitle = ({
  className,
  children,
  id,
  role,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: CardTitleProps) => (
  <h3
    className={cn('text-[16px] font-semibold text-fg', className)}
    id={id}
    role={role}
    aria-label={ariaLabel}
    data-testid={dataTestId}
  >
    {children}
  </h3>
)

CardTitle.displayName = 'CardTitle'

/** Card Description Component */
export const CardDescription = ({
  className,
  children,
  id,
  role,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: CardDescriptionProps) => (
  <p
    className={cn('text-[14px] text-fg-muted', className)}
    id={id}
    role={role}
    aria-label={ariaLabel}
    data-testid={dataTestId}
  >
    {children}
  </p>
)

CardDescription.displayName = 'CardDescription'

/** Card Content Component */
export const CardContent = ({
  className,
  children,
  id,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
}: CardSubComponentProps) => (
  <div
    className={cn('', className)}
    id={id}
    role={role}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    data-testid={dataTestId}
  >
    {children}
  </div>
)

CardContent.displayName = 'CardContent'

/** Card Footer Component */
export const CardFooter = ({
  className,
  children,
  id,
  role,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
}: CardSubComponentProps) => (
  <div
    className={cn('flex items-center gap-2 mt-6', className)}
    id={id}
    role={role}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    data-testid={dataTestId}
  >
    {children}
  </div>
)

CardFooter.displayName = 'CardFooter'


