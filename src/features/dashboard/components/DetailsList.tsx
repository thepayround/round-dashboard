import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Badge } from '@/shared/ui/shadcn/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { cn } from '@/shared/utils/cn'

export interface DetailsItem {
  icon: LucideIcon
  label: string
  /** Value to display - optional if badge is provided */
  value?: ReactNode
  /** Optional badge to display instead of plain value */
  badge?: {
    text: string
    variant: 'default' | 'success' | 'destructive' | 'outline' | 'secondary'
  }
  /** If true, displays value in monospace font */
  mono?: boolean
}

interface DetailsListProps {
  title: string
  description?: string
  headerIcon: LucideIcon
  items: DetailsItem[]
}

const badgeVariantStyles = {
  default: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline: 'bg-transparent text-foreground border-border',
  secondary: 'bg-muted text-muted-foreground border-border',
}

/**
 * DetailsList - Card with list of labeled details
 * Uses consistent foreground color for icons (visible in dark theme)
 */
export const DetailsList = ({
  title,
  description,
  headerIcon: HeaderIcon,
  items,
}: DetailsListProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-muted border border-border">
            <HeaderIcon className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-foreground/70" />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                {item.badge ? (
                  <Badge
                    variant="outline"
                    className={cn('text-xs font-medium', badgeVariantStyles[item.badge.variant])}
                  >
                    {item.badge.text}
                  </Badge>
                ) : (
                  <span
                    className={cn(
                      'text-sm font-medium text-foreground',
                      item.mono && 'font-mono text-xs'
                    )}
                  >
                    {item.value}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
