import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'

interface AuthLayoutProps {
  children?: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps = {}) => (
  <div className="relative min-h-screen flex items-center justify-center pb-12 z-[1]">
    {/* Animated Background */}
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
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
