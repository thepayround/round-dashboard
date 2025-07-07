import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WhiteLogo } from '../../../shared/components/WhiteLogo'

export const AuthLayout = () => {
  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
        <div className="floating-orb"></div>
      </div>

      {/* White Logo - Top Left */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-6 left-6 z-20"
      >
        <WhiteLogo size="md" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.3,
          ease: "easeOut"
        }}
        className="relative z-10 w-full max-w-lg"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}