import { motion } from 'framer-motion'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/shared/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireOnboarding?: boolean
}

export const ProtectedRoute = ({ children, requireOnboarding = false }: ProtectedRouteProps) => {
  const { state } = useAuth()
  const { isAuthenticated, user, isLoading } = state
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-4"
        >
          {/* Loading Spinner */}
          <div className="w-12 h-12 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-[3px] border-border border-t-primary rounded-full"
            />
          </div>

          {/* Loading Text */}
          <div className="space-y-1">
            <h2 className="text-lg font-normal tracking-tight text-white">Loading...</h2>
            <p className="text-sm text-white/60">Checking your session</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check onboarding requirement
  if (requireOnboarding && user && !user.onboardingCompleted) {
    // If user is on get-started page, allow access
    if (location.pathname === '/get-started') {
      return children
    }
    // Otherwise redirect to onboarding
    return <Navigate to="/get-started" replace />
  }

  // If onboarding is completed but user is on get-started page, redirect to dashboard
  if (!requireOnboarding && user?.onboardingCompleted && location.pathname === '/get-started') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
