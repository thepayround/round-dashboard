import { motion } from 'framer-motion'
import React from 'react'

import { OrganizationSettingsForm } from '../OrganizationSettingsForm'

export const GeneralSection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <OrganizationSettingsForm />
  </motion.div>
)
