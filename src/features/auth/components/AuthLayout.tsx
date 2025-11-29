import { motion } from 'framer-motion'
import { Link, Outlet } from 'react-router-dom'

import WhiteLogo from '@/assets/logos/white-logo.svg?url'

interface AuthLayoutProps {
  children?: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps = {}) => (
  <div className="h-screen w-screen flex items-center justify-center p-6 overflow-hidden">
    {/* Logo - outside motion.div so it appears immediately */}
    <div className="fixed top-6 left-6 md:top-10 md:left-10 z-50">
      <Link to="/" className="inline-block transition-opacity hover:opacity-80">
        <img
          src={WhiteLogo}
          alt="Round Logo"
          className="h-10 w-10"
          loading="eager"
          fetchPriority="high"
        />
      </Link>
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
      className="w-full max-w-sm"
    >
      {children ?? <Outlet />}
    </motion.div>
  </div>
)
