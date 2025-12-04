import { motion } from 'framer-motion'
import { Plus, ExternalLink, Key, Zap } from 'lucide-react'
import React from 'react'

import { useIntegrationsController } from '../../hooks/useIntegrationsController'

import { DetailCard, StatusBadge } from '@/shared/ui/DetailCard'
import { Button } from '@/shared/ui/shadcn/button'

export const IntegrationsSection: React.FC = () => {
  const {
    categories,
    activeCategory,
    filteredIntegrations,
    handleCategoryChange,
    handleConnect,
    handleDisconnect,
    handleConfigure,
  } = useIntegrationsController()

  const getStatusBadgeStatus = (
    status: 'connected' | 'available' | 'configured'
  ): 'active' | 'inactive' | 'pending' => {
    switch (status) {
      case 'connected':
        return 'active'
      case 'configured':
        return 'pending'
      case 'available':
        return 'inactive'
      default:
        return 'inactive'
    }
  }

  const getStatusLabel = (status: 'connected' | 'available' | 'configured') => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'configured':
        return 'Configured'
      case 'available':
        return 'Available'
      default:
        return status
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* API Keys Section */}
      <DetailCard
        title="API Keys"
        icon={<Key className="h-4 w-4" />}
        actions={
          <Button variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate Key
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground mb-6">
          Securely manage access to your APIs and integrations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              onClick={() => handleCategoryChange(category.id)}
              className={`h-auto flex items-center justify-between p-4 text-left ${
                activeCategory === category.id
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-muted/50 border-border hover:bg-muted'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-foreground">
                  {category.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {category.count} integrations
                </span>
              </div>
              <Zap className="w-4 h-4 text-primary" />
            </Button>
          ))}
        </div>
      </DetailCard>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map((integration) => (
          <DetailCard
            key={integration.id}
            title={integration.name}
            icon={<span className="text-lg">{integration.icon}</span>}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
                <StatusBadge
                  status={getStatusBadgeStatus(integration.status)}
                  label={getStatusLabel(integration.status)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                {integration.status === 'connected' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    Disconnect
                  </Button>
                )}
                {integration.status === 'available' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleConnect(integration.id)}
                  >
                    Connect
                  </Button>
                )}
                {integration.status === 'configured' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleConfigure(integration.id)}
                  >
                    Configure
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Open ${integration.name} details`}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DetailCard>
        ))}
      </div>
    </motion.div>
  )
}
