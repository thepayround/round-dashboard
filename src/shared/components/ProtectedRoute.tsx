import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          {/* Loading Spinner */}
          <div className="w-16 h-16 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-white/20 border-t-[#D417C8] rounded-full"
            />
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading...</h2>
            <p className="text-gray-400">Checking your session</p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
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

// Loading component for reuse
export const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto rounded-lg bg-gradient-to-br from-[#D417C8]/20 to-[#14BDEA]/20 backdrop-blur-sm border border-white/20 flex items-center justify-center"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D417C8] to-[#14BDEA]" />
      </motion.div>

      {/* Loading Spinner */}
      <div className="w-12 h-12 mx-auto">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-white/20 border-t-[#D417C8] rounded-full"
        />
      </div>

      {/* Loading Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Loading Round</h2>
        <p className="text-gray-400">Please wait while we prepare your dashboard</p>
      </div>
    </motion.div>
  </div>
)
