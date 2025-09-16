import React from 'react'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/shared/components'
import { Users } from 'lucide-react'
import { TeamManagementPage } from '../TeamManagementPage'

export const TeamSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Team Management"
        subtitle="Manage team members, roles, and invitations"
        size="section"
      />

      <TeamManagementPage />
    </motion.div>
  )