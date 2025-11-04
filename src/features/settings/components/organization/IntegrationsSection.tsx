import { motion } from 'framer-motion'
import { Plus, Settings, ExternalLink, Check, Key, Zap } from 'lucide-react'
import React, { useState } from 'react'

import { Card } from '@/shared/components'
import { Button, IconButton } from '@/shared/components/Button'


interface Integration {
  id: string
  name: string
  description: string
  icon: string
  status: 'connected' | 'available' | 'configured'
  category: 'analytics' | 'payment' | 'communication' | 'productivity' | 'security'
}

export const IntegrationsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const integrations: Integration[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      icon: '💳',
      status: 'connected',
      category: 'payment'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track user behavior and website analytics',
      icon: '📊',
      status: 'configured',
      category: 'analytics'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      icon: '💬',
      status: 'available',
      category: 'communication'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows between apps',
      icon: '⚡',
      status: 'available',
      category: 'productivity'
    },
    {
      id: 'auth0',
      name: 'Auth0',
      description: 'Identity and access management',
      icon: '🔐',
      status: 'configured',
      category: 'security'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      icon: '📧',
      status: 'available',
      category: 'communication'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'analytics', label: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'payment', label: 'Payments', count: integrations.filter(i => i.category === 'payment').length },
    { id: 'communication', label: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'productivity', label: 'Productivity', count: integrations.filter(i => i.category === 'productivity').length },
    { id: 'security', label: 'Security', count: integrations.filter(i => i.category === 'security').length }
  ]

  const filteredIntegrations = activeCategory === 'all'
    ? integrations
    : integrations.filter(i => i.category === activeCategory)

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Check className="w-4 h-4 text-green-400" />
      case 'configured':
        return <Settings className="w-4 h-4 text-blue-400" />
      case 'available':
        return <Plus className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusText = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'configured':
        return 'Configured'
      case 'available':
        return 'Available'
      default:
        return ''
    }
  }

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'configured':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'available':
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      default:
        return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-lg font-medium text-white mb-4">
          Integrations{' '}
          <span className="text-primary">
            & API
          </span>
        </h1>
        <p className="text-gray-500 dark:text-polar-500 leading-snug mb-3">
          Connect with third-party services and manage API access
        </p>
      </div>

      {/* API Keys */}
      <Card animate={false} padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Key className="w-5 h-5 text-[#D417C8]" />
            </div>
            <div>
              <h3 className="text-sm font-normal tracking-tight text-white">API Keys</h3>
              <p className="text-xs text-gray-400">Manage your API keys and access tokens</p>
            </div>
          </div>
          <Button variant="primary" icon={Plus} iconPosition="left" size="sm">
            Generate New Key
          </Button>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-normal tracking-tight text-white">Production API Key</h4>
                <p className="text-xs text-gray-400 font-mono">rnd_prod_••••••••••••••••</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs bg-green-400/10 text-green-400 border border-green-400/20 rounded">Active</span>
                <IconButton icon={Settings} aria-label="API key settings" size="md" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/4 rounded-lg border border-white/8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-normal tracking-tight text-white">Development API Key</h4>
                <p className="text-xs text-gray-400 font-mono">rnd_dev_••••••••••••••••</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded">Development</span>
                <IconButton icon={Settings} aria-label="API key settings" size="md" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card animate={false} padding="lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Zap className="w-5 h-5 text-[#32A1E4]" />
          </div>
          <div>
            <h3 className="text-sm font-normal tracking-tight text-white">Available Integrations</h3>
            <p className="text-xs text-gray-400">Connect with your favorite tools and services</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6 p-2 bg-white/4 rounded-lg">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              variant={activeCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="p-4 bg-white/4 rounded-lg border border-white/8 hover:border-white/15 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h4 className="text-sm font-normal tracking-tight text-white">{integration.name}</h4>
                    <p className="text-xs text-gray-400">{integration.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-1 px-2 py-1 text-xs rounded border ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  {getStatusText(integration.status)}
                </div>

                <div className="flex gap-1">
                  {integration.status === 'connected' && (
                    <IconButton icon={Settings} aria-label="Integration settings" size="sm" />
                  )}
                  <IconButton icon={ExternalLink} aria-label="Open integration" size="sm" />
                </div>
              </div>

              {integration.status === 'available' && (
                <Button variant="primary" size="sm" fullWidth className="mt-3">
                  Connect Integration
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}