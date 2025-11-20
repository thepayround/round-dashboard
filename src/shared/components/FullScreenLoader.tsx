import { motion } from 'framer-motion'

export const FullScreenLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="text-center space-y-3"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        className="w-12 h-12 mx-auto border-[3px] border-white/10 border-t-secondary rounded-full"
      />
      <div className="space-y-1">
        <p className="text-sm font-normal text-white/70 tracking-tight">Loading interface</p>
        <p className="text-xs font-light text-white/60 tracking-tight">Please wait a second</p>
      </div>
    </motion.div>
  </div>
)

