import React from 'react'

import { Card } from '@/shared/ui/Card'

export const CustomerDetailSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header Card */}
        <Card padding="md" className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-700/50 rounded-lg animate-pulse">
              <div className="w-3.5 h-3.5 bg-gray-600 rounded" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-2/3 mb-4 animate-pulse" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700/50 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded animate-pulse" />
                      <div className="h-3 bg-gray-700/50 rounded w-20 animate-pulse" />
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
            <div className="p-2 bg-gray-700/50 rounded-lg animate-pulse">
              <div className="w-3.5 h-3.5 bg-gray-600 rounded" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700/50 rounded w-1/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-1/2 mb-4 animate-pulse" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-gray-700/50 rounded w-20 animate-pulse" />
                    <div className="space-y-1">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-3 bg-gray-700/50 rounded animate-pulse" />
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
            <div className="p-2 bg-gray-700/50 rounded-lg animate-pulse">
              <div className="w-3.5 h-3.5 bg-gray-600 rounded" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700/50 rounded w-1/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-1/3 mb-4 animate-pulse" />
              
              <div className="space-y-4">
                <div>
                  <div className="h-3 bg-gray-700/50 rounded w-12 mb-2 animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 bg-gray-700/50 rounded w-16 animate-pulse" />
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="h-3 bg-gray-700/50 rounded w-20 mb-2 animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-3 bg-gray-700/50 rounded w-16 animate-pulse" />
                        <div className="h-3 bg-gray-700/50 rounded w-20 animate-pulse" />
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
            <div className="p-2 bg-gray-700/50 rounded-lg animate-pulse">
              <div className="w-3.5 h-3.5 bg-gray-600 rounded" />
            </div>
            <div>
              <div className="h-4 bg-gray-700/50 rounded w-20 mb-1 animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-24 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 bg-gray-700/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </Card>

        {/* Status Information */}
        <Card padding="md">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-gray-700/50 rounded-lg animate-pulse">
              <div className="w-3.5 h-3.5 bg-gray-600 rounded" />
            </div>
            <div>
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-1 animate-pulse" />
              <div className="h-3 bg-gray-700/50 rounded w-32 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 bg-gray-700/50 rounded w-20 animate-pulse" />
                <div className="h-5 bg-gray-700/50 rounded w-16 animate-pulse" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
