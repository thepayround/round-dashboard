import { motion } from 'framer-motion'
import { Shield, Eye, Key, Users } from 'lucide-react'
import React from 'react'

import { DetailCard, StatusBadge } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'

export const SecuritySection: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* Security Policies */}
    <DetailCard title="Security Policies" icon={<Shield className="h-4 w-4" />}>
      <p className="text-sm text-muted-foreground mb-6">
        Configure organization-wide security settings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Two-Factor Authentication
              </span>
            </div>
            <StatusBadge status="disabled" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Require 2FA for all organization members
          </p>
          <Button variant="default" size="sm" className="w-full">
            Enable 2FA
          </Button>
        </div>

        <div className="p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">
                SSO Integration
              </span>
            </div>
            <StatusBadge status="active" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Single Sign-On with Google Workspace
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Configure SSO
          </Button>
        </div>
      </div>
    </DetailCard>

    {/* Audit Logs */}
    <DetailCard title="Audit Logs" icon={<Eye className="h-4 w-4" />}>
      <p className="text-sm text-muted-foreground mb-6">
        Recent security events and user activities
      </p>

      <div className="text-center py-12">
        <Eye className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-sm font-medium text-foreground mb-2">
          Security Monitoring
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Configure security policies, audit logs, and access controls.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-3">
          This section is coming soon...
        </p>
      </div>
    </DetailCard>
  </motion.div>
)
