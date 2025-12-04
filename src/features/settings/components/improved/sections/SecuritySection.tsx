import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import React from 'react'

import { ChangePasswordForm } from '../../ChangePasswordForm'

import type { UserSettings } from '@/shared/services/api/userSettings.service'
import { DetailCard } from '@/shared/ui/DetailCard'

interface SecuritySectionProps {
  settings?: UserSettings | null
  updateSettings?: (updates: Record<string, unknown>) => Promise<boolean>
  isSaving?: boolean
}

export const SecuritySection: React.FC<SecuritySectionProps> = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="space-y-6"
  >
    <DetailCard
      title="Password Management"
      icon={<Shield className="h-4 w-4" />}
    >
      <ChangePasswordForm />
    </DetailCard>
  </motion.div>
)
