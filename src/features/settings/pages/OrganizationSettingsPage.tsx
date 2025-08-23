import { useState } from 'react'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { Card } from '@/shared/components/Card'
import { 
  Building2, 
  Users, 
  CreditCard, 
  Shield, 
  Bell,
  Palette,
  Globe
} from 'lucide-react'
import { TeamManagementPage } from '../components/TeamManagementPage'

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
          <Card title="Organization Settings" description="Manage your organization&apos;s basic information">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Organization Settings</h3>
                <p className="text-gray-400">Configure your organization&apos;s basic information and settings.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'billing':
        return (
          <Card title="Billing & Plans" description="Manage your subscription and billing information">
            <div className="space-y-6">
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Billing Management</h3>
                <p className="text-gray-400">View and manage your subscription, billing details, and usage.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'security':
        return (
          <Card title="Security Settings" description="Manage security and authentication settings">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Security Settings</h3>
                <p className="text-gray-400">Configure two-factor authentication, security policies, and audit logs.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'notifications':
        return (
          <Card title="Notification Settings" description="Configure email and alert preferences">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Notification Preferences</h3>
                <p className="text-gray-400">Manage email notifications and alert settings.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'branding':
        return (
          <Card title="Branding Settings" description="Customize your organization&apos;s appearance">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Branding & Appearance</h3>
                <p className="text-gray-400">Upload logos, customize colors, and set branding preferences.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
              </div>
            </div>
          </Card>
        )
      case 'integrations':
        return (
          <Card title="Integrations" description="Connect with third-party services">
            <div className="space-y-6">
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Third-party Integrations</h3>
                <p className="text-gray-400">Connect with external services and manage API access.</p>
                <p className="text-sm text-gray-500 mt-2">This section is coming soon...</p>
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Organization Settings</h1>
            <p className="text-gray-400 mt-1">
              Manage your organization&apos;s settings, team, and preferences
            </p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="w-full">
          {/* Tab List */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2 p-2 bg-gray-800/50 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600/20 border border-purple-500/50 text-white'
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mb-2" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
