import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

interface AuthLayoutProps {
  children?: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps = {}) => (
  <div className="auth-container">
    {/* Animated Background */}
    <div className="auth-background">
      <div className="floating-orb" />
      <div className="floating-orb" />
      <div className="floating-orb" />
    </div>


    {/* Main Content */}
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      }}
      className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
    >
      {children ?? <Outlet />}
    </motion.div>
  </div>
)
