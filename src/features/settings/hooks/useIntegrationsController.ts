import { useCallback, useMemo, useState } from 'react'

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  status: 'connected' | 'available' | 'configured'
  category: 'analytics' | 'payment' | 'communication' | 'productivity' | 'security'
}

const initialIntegrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and subscription management',
    icon: '????',
    status: 'connected',
    category: 'payment',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track user behavior and website analytics',
    icon: '????',
    status: 'configured',
    category: 'analytics',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and notifications',
    icon: '????',
    status: 'available',
    category: 'communication',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Automate workflows between apps',
    icon: '??',
    status: 'available',
    category: 'productivity',
  },
  {
    id: 'auth0',
    name: 'Auth0',
    description: 'Identity and access management',
    icon: '????',
    status: 'configured',
    category: 'security',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and automation',
    icon: '???',
    status: 'available',
    category: 'communication',
  },
]

export const useIntegrationsController = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = useMemo(() => {
    const base = [
      { id: 'all', label: 'All Integrations' },
      { id: 'analytics', label: 'Analytics' },
      { id: 'payment', label: 'Payments' },
      { id: 'communication', label: 'Communication' },
      { id: 'productivity', label: 'Productivity' },
      { id: 'security', label: 'Security' },
    ]

    return base.map(category => ({
      ...category,
      count:
        category.id === 'all'
          ? integrations.length
          : integrations.filter(integration => integration.category === category.id).length,
    }))
  }, [integrations])

  const filteredIntegrations = useMemo(() => {
    if (activeCategory === 'all') {
      return integrations
    }
    return integrations.filter(integration => integration.category === activeCategory)
  }, [activeCategory, integrations])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
  }, [])

  const updateIntegrationStatus = useCallback(
    (integrationId: string, status: Integration['status']) => {
      setIntegrations(prev =>
        prev.map(integration =>
          integration.id === integrationId
            ? {
                ...integration,
                status,
              }
            : integration
        )
      )
    },
    []
  )

  const handleConnect = useCallback(
    (integrationId: string) => {
      updateIntegrationStatus(integrationId, 'connected')
    },
    [updateIntegrationStatus]
  )

  const handleDisconnect = useCallback(
    (integrationId: string) => {
      updateIntegrationStatus(integrationId, 'available')
    },
    [updateIntegrationStatus]
  )

  const handleConfigure = useCallback(
    (integrationId: string) => {
      updateIntegrationStatus(integrationId, 'configured')
    },
    [updateIntegrationStatus]
  )

  return {
    categories,
    activeCategory,
    filteredIntegrations,
    handleCategoryChange,
    handleConnect,
    handleDisconnect,
    handleConfigure,
  }
}
