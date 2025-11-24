import React from 'react'

import { Card } from '@/shared/ui/Card'
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton'

export const CustomerDetailSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left Column - Main Info */}
    <div className="lg:col-span-2 space-y-6">
      {/* Header Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-2/3 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Addresses Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-3 w-1/2 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <div className="space-y-1">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-3 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Metadata Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-3 w-1/3 mb-4" />

            <div className="space-y-4">
              <div>
                <Skeleton className="h-3 w-12 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-3 w-20 mb-2" />
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* Right Column - Actions and Status */}
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card padding="md">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </Card>

      {/* Status Information */}
      <Card padding="md">
        <div className="flex items-start gap-4 mb-4">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
)
