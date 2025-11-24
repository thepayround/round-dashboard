import { cn } from '@/shared/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'circle' | 'rectangle' | 'text'
}

export const Skeleton = ({
    className,
    variant = 'rectangle',
    ...props
}: SkeletonProps) => {
    return (
        <div
            className={cn(
                "animate-pulse bg-white/5",
                {
                    'rounded-full': variant === 'circle',
                    'rounded-lg': variant === 'rectangle',
                    'rounded h-4 w-full': variant === 'text',
                },
                className
            )}
            {...props}
        />
    )
}
