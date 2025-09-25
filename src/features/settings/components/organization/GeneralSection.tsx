import React from 'react'
import { motion } from 'framer-motion'
import { Card, SectionHeader } from '@/shared/components'
import { OrganizationSettingsForm } from '../OrganizationSettingsForm'

export const GeneralSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader
        title="General Settings"
        subtitle="Manage your organization's basic information and preferences"
        size="section"
      />

      <Card animate={false} padding="lg">
        <OrganizationSettingsForm />
      </Card>
    </motion.div>
  )