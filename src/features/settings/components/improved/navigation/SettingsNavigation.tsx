import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import React from 'react'

import { PlainButton } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'


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
      <Card animate={false} padding="none" className="overflow-hidden">
        <div className="p-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Settings className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-normal text-gray-300 tracking-tight">Settings</span>
          </div>
        </div>
        
        <nav className="p-2">
          {sections.map((section) => {
            const IconComponent = section.icon
            const isActive = activeSection === section.id
            
            return (
              <PlainButton
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group text-left mb-1 ${
                  isActive
                    ? 'bg-primary/10 text-white border border-primary/20 shadow-glass-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                unstyled
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/20' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <IconComponent className={`w-3 h-3 transition-all duration-200 ${
                      isActive 
                        ? 'text-primary' 
                        : 'group-hover:text-white'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-normal tracking-tight truncate">{section.label}</p>
                  </div>
                </div>
              </PlainButton>
            )
          })}
        </nav>
      </Card>
    </motion.div>
  )

