import { motion } from 'framer-motion'
import { User, Building2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthLogo } from '@/shared/components'

export const WelcomePage = () => {
  const navigate = useNavigate()

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="floating-orb" />
        <div className="floating-orb" />
        <div className="floating-orb" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2,
        }}
        className="w-full max-w-[400px] mx-auto relative z-10"
      >
        {/* Centered Logo Above Form */}
        <AuthLogo />

        <div className="auth-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="gradient-header" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <h1 className="text-2xl font-bold text-white mb-3 relative">
                Welcome to Round
              </h1>
              <p className="text-white/70 text-sm font-medium">
                Your billing and customer intelligence platform
              </p>
            </motion.div>
          </div>

          {/* Journey Selection */}
          <div className="space-y-4">
            {/* Personal Journey */}
            <motion.button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full p-6 rounded-lg border transition-all duration-200
                         bg-white/4 backdrop-blur-xl hover:bg-white/8
                         border-white/10 hover:border-white/20
                         group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">Personal</h3>
                  <p className="text-sm text-white/60">Individual account for personal use</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.button>

            {/* Business Journey */}
            <motion.button
              type="button"
              onClick={() => navigate('/login/business')}
              className="w-full p-6 rounded-lg border transition-all duration-200
                         bg-white/4 backdrop-blur-xl hover:bg-white/8
                         border-white/10 hover:border-white/20
                         group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform -skew-x-12" />
              
              <div className="flex items-center space-x-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">Business</h3>
                  <p className="text-sm text-white/60">Company account for business use</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.button>
          </div>

        </div>
      </motion.div>
    </div>
  )
}