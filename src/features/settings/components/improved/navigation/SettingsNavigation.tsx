import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import React from 'react'

import { Button } from '@/shared/ui/shadcn/button'
import { Card } from '@/shared/ui/shadcn/card'


interface SettingsSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface SettingsNavigationProps {
  sections: SettingsSection[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  sections,
  activeSection,
  onSectionChange
}) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:sticky lg:top-6 lg:self-start"
    >
      <Card className="overflow-hidden p-0">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm font-normal text-muted-foreground tracking-tight">Settings</span>
          </div>
        </div>
        
        <nav className="p-2">
          {sections.map((section) => {
            const IconComponent = section.icon
            const isActive = activeSection === section.id
            
            return (
              <Button
                key={section.id}
                variant="ghost"
                onClick={() => onSectionChange(section.id)}
                className={`w-full h-auto justify-start p-3 mb-1 group ${
                  isActive
                    ? 'bg-primary/10 text-foreground border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20'
                      : 'bg-muted group-hover:bg-muted/80'
                  }`}>
                    <IconComponent className={`w-3 h-3 transition-all duration-200 ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-normal tracking-tight truncate">{section.label}</p>
                  </div>
                </div>
              </Button>
            )
          })}
        </nav>
      </Card>
    </motion.div>
  )

