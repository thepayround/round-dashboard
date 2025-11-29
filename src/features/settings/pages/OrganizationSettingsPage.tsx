import {
  Building2,
  Users,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Globe
} from 'lucide-react'
import { useState } from 'react'

import { OrganizationSettingsForm } from '../components/OrganizationSettingsForm'
import { TeamManagementPage } from '../components/TeamManagementPage'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { PageHeader } from '@/shared/ui'
import { Card } from '@/shared/ui/shadcn/card'


interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

export const OrganizationSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')

  const tabs: TabItem[] = [
    {
      id: 'general',
      label: 'General',
      icon: Building2,
      description: 'Organization name, description, and basic settings'
    },
    {
      id: 'team',
      label: 'Team Management',
      icon: Users,
      description: 'Manage team members, roles, and invitations'
    },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: CreditCard,
      description: 'Manage subscription, billing information, and usage'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Security settings, two-factor authentication, and audit logs'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email notifications and alert preferences'
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: Palette,
      description: 'Custom branding, logos, and theme settings'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Globe,
      description: 'Third-party integrations and API settings'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamManagementPage />
      case 'general':
        return (
          <div className="max-w-4xl">
            <OrganizationSettingsForm />
          </div>
        )
      case 'billing':
        return (
          <Card className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-fg">Billing & Plans</h3>
              <p className="text-sm text-fg-muted">Manage your subscription and billing information</p>
            </div>
            <div className="space-y-6">
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fg mb-2">Billing Management</h3>
                <p className="text-fg-muted">View and manage your subscription, billing details, and usage.</p>
                <p className="text-sm text-fg-muted/70 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'security':
        return (
          <Card className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-fg">Security Settings</h3>
              <p className="text-sm text-fg-muted">Manage security and authentication settings</p>
            </div>
            <div className="space-y-6">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fg mb-2">Security Settings</h3>
                <p className="text-fg-muted">Configure two-factor authentication, security policies, and audit logs.</p>
                <p className="text-sm text-fg-muted/70 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'notifications':
        return (
          <Card className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-fg">Notification Settings</h3>
              <p className="text-sm text-fg-muted">Configure email and alert preferences</p>
            </div>
            <div className="space-y-6">
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fg mb-2">Notification Preferences</h3>
                <p className="text-fg-muted">Manage email notifications and alert settings.</p>
                <p className="text-sm text-fg-muted/70 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'branding':
        return (
          <Card className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-fg">Branding Settings</h3>
              <p className="text-sm text-fg-muted">Customize your organization&apos;s appearance</p>
            </div>
            <div className="space-y-6">
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fg mb-2">Branding & Appearance</h3>
                <p className="text-fg-muted">Upload logos, customize colors, and set branding preferences.</p>
                <p className="text-sm text-fg-muted/70 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'integrations':
        return (
          <Card className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-fg">Integrations</h3>
              <p className="text-sm text-fg-muted">Connect with third-party services</p>
            </div>
            <div className="space-y-6">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-fg-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-fg mb-2">Third-party Integrations</h3>
                <p className="text-fg-muted">Connect with external services and manage API access.</p>
                <p className="text-sm text-fg-muted/70 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Organization Settings"
      />
      <div className="space-y-8">

        {/* Custom Tabs */}
        <div className="w-full">
          {/* Tab List */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 p-1.5 bg-bg-raised rounded-xl border border-border">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-card border border-border text-fg shadow-sm'
                    : 'text-fg-muted hover:text-fg hover:bg-bg-hover'
                    }`}
                >
                  <IconComponent className={`w-5 h-5 mb-2 ${activeTab === tab.id ? 'text-primary' : 'text-current'}`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

