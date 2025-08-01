import { motion } from 'framer-motion'
import { Outlet, Link } from 'react-router-dom'

import { ColorLogo } from '../../../shared/components/ColorLogo'

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

    {/* Color Logo - Top Left with symmetric spacing */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="logo-container absolute top-12 left-12 z-base"
    >
      <Link to="/" className="block hover:scale-105 transition-transform duration-200">
        <ColorLogo size="md" />
      </Link>
    </motion.div>

    {/* Main Content */}
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: 'easeOut',
      }}
      className="relative z-10 w-full max-w-lg"
    >
      {children ?? <Outlet />}
    </motion.div>
  </div>
)
