import { ReactNode } from 'react'

import { cn } from '@/shared/utils/cn'

export interface PageHeaderProps {
    title: string
    subtitle?: string
    actions?: ReactNode
    className?: string
}

/**
 * PageHeader Component
 * 
 * Reusable page header for consistent page titles and actions.
 * 
 * @example
 * <PageHeader 
 *   title="Dashboard" 
 *   subtitle="Overview of your account"
 *   actions={<Button>Add New</Button>}
 * />
 */
export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => {
    return (
        <div className={cn(
            "mb-6",
            className
        )}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-medium text-fg">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-fg-muted mt-1">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
