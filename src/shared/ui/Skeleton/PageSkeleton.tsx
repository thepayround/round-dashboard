import { Skeleton } from './Skeleton'

export const PageSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="w-48 h-8" />
                    <Skeleton className="w-64 h-4" />
                </div>
                <Skeleton className="w-32 h-10" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-6 bg-[#141414] border border-[#262626] rounded-2xl animate-pulse">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <Skeleton variant="circle" className="w-12 h-12 bg-[#262626] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="w-24 h-4 bg-[#262626]" />
                                    <Skeleton className="w-32 h-3 bg-[#262626]" />
                                </div>
                            </div>
                            <Skeleton className="w-8 h-8 bg-[#262626]" />
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="w-full h-3 bg-[#262626]" />
                            <Skeleton className="w-3/4 h-3 bg-[#262626]" />
                            <Skeleton className="w-1/2 h-3 bg-[#262626]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
