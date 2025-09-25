import React from 'react'
import { motion } from 'framer-motion'
import { TeamManagementPage } from '../TeamManagementPage'

export const TeamSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <TeamManagementPage />
    </motion.div>
  )