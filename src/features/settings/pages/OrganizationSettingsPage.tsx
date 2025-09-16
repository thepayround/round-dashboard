import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { SectionHeader } from '@/shared/components'
import {
  Building2,
  Users,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Globe
} from 'lucide-react'
import { SettingsNavigation } from '../components/improved/navigation/SettingsNavigation'
import {
  GeneralSection,
  TeamSection,
  BillingSection,
  SecuritySection,
  NotificationsSection,
  BrandingSection,
  IntegrationsSection
} from '../components/organization'

interface SettingsSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

export const OrganizationSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general')

  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      label: 'General Settings',
      icon: Building2,
      description: 'Organization information and basic settings'
    },
    {
      id: 'team',
      label: 'Team Management',
      icon: Users,
      description: 'Manage team members, roles, and invitations'
    },
    {
      id: 'billing',
      label: 'Billing & Subscription',
      icon: CreditCard,
      description: 'Subscription plans, billing, and usage'
    },
    {
      id: 'security',
      label: 'Security & Privacy',
      icon: Shield,
      description: 'Security policies and access controls'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Organization notification preferences'
    },
    {
      id: 'branding',
      label: 'Branding & Theme',
      icon: Palette,
      description: 'Visual identity and brand customization'
    },
    {
      id: 'integrations',
      label: 'Integrations & API',
      icon: Globe,
      description: 'Third-party services and API management'
    }
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSection />
      case 'team':
        return <TeamSection />
      case 'billing':
        return <BillingSection />
      case 'security':
        return <SecuritySection />
      case 'notifications':
        return <NotificationsSection />
      case 'branding':
        return <BrandingSection />
      case 'integrations':
        return <IntegrationsSection />
      default:
        return <GeneralSection />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Organization Settings"
            subtitle="Manage your organization's settings, team, and preferences"
            size="main"
            className="text-base md:text-lg"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 lg:self-start">
            <SettingsNavigation
              sections={settingsSections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-4">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
