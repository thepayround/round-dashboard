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
          <img src="/src/assets/logos/color-logo.svg" alt="Round" className="w-16 h-16 sm:hidden animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_20px_rgba(212,23,200,0.6)]" />
          <img src="/src/assets/logos/color-logo.svg" alt="Round" className="w-24 h-24 hidden sm:block animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_25px_rgba(212,23,200,0.6)]" />
        </div>
        <div className="flex items-center justify-center space-x-0.5 animate-[pulse_3s_ease-in-out_infinite]">
          <span className="text-[#D417C8] font-extralight text-4xl sm:text-5xl tracking-wider drop-shadow-[0_0_15px_rgba(212,23,200,0.7)] transition-all duration-300">R</span>
          <span className="text-[#BD2CD0] font-extralight text-4xl sm:text-5xl tracking-wider drop-shadow-[0_0_15px_rgba(189,44,208,0.7)] transition-all duration-300">O</span>
          <span className="text-[#7767DA] font-extralight text-4xl sm:text-5xl tracking-wider drop-shadow-[0_0_15px_rgba(119,103,218,0.7)] transition-all duration-300">U</span>
          <span className="text-[#32A1E4] font-extralight text-4xl sm:text-5xl tracking-wider drop-shadow-[0_0_15px_rgba(50,161,228,0.7)] transition-all duration-300">N</span>
          <span className="text-[#14BDEA] font-extralight text-4xl sm:text-5xl tracking-wider drop-shadow-[0_0_15px_rgba(20,189,234,0.7)] transition-all duration-300">D</span>
        </div>
      </a>
    </motion.div>
  )