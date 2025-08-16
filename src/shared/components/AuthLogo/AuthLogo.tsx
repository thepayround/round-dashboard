import { motion } from 'framer-motion'

interface AuthLogoProps {
  className?: string
}

export const AuthLogo = ({ className = '' }: AuthLogoProps) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className={`text-center mb-8 ${className}`}
    >
      <a className="block hover:scale-105 transition-transform duration-200" href="/" data-discover="true">
        <div className="flex items-center justify-center mb-4">
          <img src="/src/assets/logos/color-logo.svg" alt="Round" className="w-16 h-16 sm:hidden" />
          <img src="/src/assets/logos/color-logo.svg" alt="Round" className="w-24 h-24 hidden sm:block" />
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-[#D417C8] font-bold text-3xl sm:text-4xl">R</span>
          <span className="text-[#BD2CD0] font-bold text-3xl sm:text-4xl">O</span>
          <span className="text-[#7767DA] font-bold text-3xl sm:text-4xl">U</span>
          <span className="text-[#32A1E4] font-bold text-3xl sm:text-4xl">N</span>
          <span className="text-[#14BDEA] font-bold text-3xl sm:text-4xl">D</span>
        </div>
      </a>
    </motion.div>
  )