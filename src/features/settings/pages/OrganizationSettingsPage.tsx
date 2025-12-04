import {
  Building2,
  Users,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Globe,
} from 'lucide-react'

import { OrganizationSettingsForm } from '../components/OrganizationSettingsForm'
import { TeamManagementPage } from '../components/TeamManagementPage'

import { DashboardLayout } from '@/shared/layout/DashboardLayout'
import { PageHeader } from '@/shared/ui'
import { DetailCard } from '@/shared/ui/DetailCard'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/shadcn/tabs'

interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const tabs: TabItem[] = [
  {
    id: 'general',
    label: 'General',
    icon: Building2,
    description: 'Organization name, description, and basic settings',
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    description: 'Manage team members, roles, and invitations',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Manage subscription, billing information, and usage',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Security settings, two-factor authentication, and audit logs',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email notifications and alert preferences',
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
    description: 'Custom branding, logos, and theme settings',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Globe,
    description: 'Third-party integrations and API settings',
  },
]

// Placeholder component for coming soon sections
const ComingSoonPlaceholder: React.FC<{
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}> = ({ icon: Icon, title, description }) => (
  <DetailCard title={title} icon={<Icon className="h-4 w-4" />}>
    <div className="py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
      <p className="text-xs text-muted-foreground/70 mt-3">
        This section is coming soon...
      </p>
    </div>
  </DetailCard>
)

export const OrganizationSettingsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Organization Settings" />

      <Tabs defaultValue="general" className="space-y-6">
        {/* Tab List - Responsive grid layout */}
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-1 p-1.5 bg-muted/50 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1.5 py-2.5 px-2 h-auto data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs font-medium">{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="general" className="mt-6">
          <div className="max-w-4xl">
            <OrganizationSettingsForm />
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamManagementPage />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <ComingSoonPlaceholder
            icon={CreditCard}
            title="Billing & Plans"
            description="View and manage your subscription, billing details, and usage."
          />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <ComingSoonPlaceholder
            icon={Shield}
            title="Security Settings"
            description="Configure two-factor authentication, security policies, and audit logs."
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <ComingSoonPlaceholder
            icon={Bell}
            title="Notification Preferences"
            description="Manage email notifications and alert settings for your organization."
          />
        </TabsContent>

        <TabsContent value="branding" className="mt-6">
          <ComingSoonPlaceholder
            icon={Palette}
            title="Branding & Appearance"
            description="Upload logos, customize colors, and set branding preferences."
          />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <ComingSoonPlaceholder
            icon={Globe}
            title="Third-party Integrations"
            description="Connect with external services and manage API access."
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
