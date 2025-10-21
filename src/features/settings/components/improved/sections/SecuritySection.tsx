import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/shared/components'
import { Lock } from 'lucide-react'
import { ChangePasswordForm } from '../../ChangePasswordForm'
import type { UserSettings } from '@/shared/services/api/userSettings.service'

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
      className="space-y-4"
    >
      <Card animate={false} padding="md">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-primary/15 rounded-lg border border-purple-500/20">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-normal tracking-tight text-white mb-1">Password Management</h2>
            <p className="text-xs text-gray-400">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <ChangePasswordForm />
      </Card>
    </motion.div>
  )
