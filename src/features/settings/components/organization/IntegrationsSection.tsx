import { motion } from 'framer-motion'
import { Plus, Settings, ExternalLink, Check, Key, Zap } from 'lucide-react'
import React from 'react'

import { useIntegrationsController } from '../../hooks/useIntegrationsController'

import { Badge, type BadgeVariant } from '@/shared/ui/Badge'
import { Button, IconButton } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


const statusIcon = (status: 'connected' | 'available' | 'configured') => {
  switch (status) {
    case 'connected':
      return <Check className="w-4 h-4 text-success" />
    case 'configured':
      return <Settings className="w-4 h-4 text-blue-400" />
    case 'available':
      return <Plus className="w-4 h-4 text-gray-400" />
    default:
      return null
  }
}

const statusVariant = (status: 'connected' | 'available' | 'configured'): BadgeVariant => {
  switch (status) {
    case 'connected':
      return 'success'
    case 'configured':
      return 'info'
    case 'available':
      return 'neutral'
    default:
      return 'neutral'
  }
}

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Integrations <span className="text-primary">& API</span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-4">
          Connect with third-party services and manage API access
        </p>
      </div>

      <Card animate={false} padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-normal tracking-tight text-white">API Keys</h3>
              <p className="text-xs text-gray-400">Securely manage access to your APIs and integrations</p>
            </div>
          </div>
          <Button variant="secondary" icon={Plus} size="sm">
            Generate Key
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {categories.map(category => (
            <Button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              variant={activeCategory === category.id ? 'primary' : 'ghost'}
              className={`justify-between h-auto py-3 ${
                activeCategory === category.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-left">
                <p className="text-sm font-medium tracking-tight">{category.label}</p>
                <p className="text-xs text-white/50">{category.count} integrations</p>
              </div>
              <Zap className="w-4 h-4 text-primary ml-2" />
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIntegrations.map(integration => (
          <Card key={integration.id} animate={false} padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="text-sm font-normal tracking-tight text-white">{integration.name}</h3>
                  <p className="text-xs text-gray-400">{integration.description}</p>
                </div>
              </div>
              <Badge variant={statusVariant(integration.status)} size="sm">
                {integration.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {statusIcon(integration.status)}
                <span>
                  {integration.status === 'connected'
                    ? 'Connected'
                    : integration.status === 'configured'
                    ? 'Configured'
                    : 'Available'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {integration.status === 'connected' && (
                  <Button variant="ghost" size="sm" onClick={() => handleDisconnect(integration.id)}>
                    Disconnect
                  </Button>
                )}
                {integration.status === 'available' && (
                  <Button variant="primary" size="sm" onClick={() => handleConnect(integration.id)}>
                    Connect
                  </Button>
                )}
                {integration.status === 'configured' && (
                  <Button variant="secondary" size="sm" onClick={() => handleConfigure(integration.id)}>
                    Configure
                  </Button>
                )}
                <IconButton icon={ExternalLink} variant="ghost" size="sm" aria-label="Open details" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

