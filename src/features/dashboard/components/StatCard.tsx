import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/shared/ui/shadcn/card'

export interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
}

/**
 * StatCard - Compact stat display with icon
 * Uses consistent muted background for icons (visible in dark theme)
 */
export const StatCard = ({ label, value, icon: Icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground tracking-tight mb-1">
              {label}
            </p>
            <p className="text-sm font-medium text-foreground tracking-tight truncate">
              {value}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted border border-border">
            <Icon className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
