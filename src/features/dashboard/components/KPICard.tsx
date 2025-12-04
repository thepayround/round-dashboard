import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { cn } from '@/shared/utils/cn'

export interface KPICardProps {
  label: string
  value: string
  delta: number
  trend: 'up' | 'down' | 'flat'
  /** Optional icon to display */
  icon?: React.ReactNode
}

/**
 * KPICard - Displays a key performance indicator with trend
 * Follows shadcn card patterns with proper color tokens
 */
export const KPICard = ({ label, value, delta, trend, icon }: KPICardProps) => {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      className: 'text-success bg-success/10 border-success/20',
    },
    down: {
      icon: TrendingDown,
      className: 'text-destructive bg-destructive/10 border-destructive/20',
    },
    flat: {
      icon: Minus,
      className: 'text-muted-foreground bg-muted border-border',
    },
  }

  const config = trendConfig[trend]
  const TrendIcon = config.icon

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="text-muted-foreground">
                  {icon}
                </div>
              )}
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
            </div>
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border',
                config.className
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <span>
                {delta > 0 ? '+' : ''}
                {delta}%
              </span>
            </div>
          </div>
          <p className="text-3xl font-medium tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
