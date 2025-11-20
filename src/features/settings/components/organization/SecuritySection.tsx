import { motion } from 'framer-motion'
import { Lock, Eye, AlertTriangle, Key, Users } from 'lucide-react'
import React from 'react'

import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


export const SecuritySection: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Security{' '}
          <span className="text-primary">
            Settings
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Manage security policies, authentication, and audit logs
        </p>
      </div>

      {/* Security Policies */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Security Policies</h3>
            <p className="text-xs text-gray-400">Configure organization-wide security settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="nested" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-normal tracking-tight text-white">Two-Factor Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-xs text-gray-400">Disabled</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">Require 2FA for all organization members</p>
            <Button
              variant="primary"
              size="sm"
              fullWidth
            >
              Enable 2FA
            </Button>
          </Card>

          <Card variant="nested" padding="lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-success" />
                <span className="text-xs font-normal tracking-tight text-white">SSO Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-xs text-gray-400">Active</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">Single Sign-On with Google Workspace</p>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
            >
              Configure SSO
            </Button>
          </Card>
        </div>
      </Card>

      {/* Audit Logs */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Eye className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Audit Logs</h3>
            <p className="text-xs text-gray-400">Recent security events and user activities</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Security Monitoring</h3>
          <p className="text-gray-400 mb-4">Configure security policies, audit logs, and access controls.</p>
          <p className="text-gray-500 dark:text-polar-500 leading-snug">This section is coming soon...</p>
        </div>
      </Card>
    </motion.div>
  )
