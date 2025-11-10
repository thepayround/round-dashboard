import { motion } from 'framer-motion'
import React from 'react'

import { OrganizationSettingsForm } from '../OrganizationSettingsForm'

import { Card } from '@/shared/ui/Card'


export const GeneralSection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          General{' '}
          <span className="text-primary">
            Settings
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Manage your organization&apos;s basic information and preferences
        </p>
      </div>

      <Card animate={false} padding="lg">
        <OrganizationSettingsForm />
      </Card>
    </motion.div>
  )
