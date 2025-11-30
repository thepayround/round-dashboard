import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'

import { useBusinessSettingsStepController } from '../../hooks/useBusinessSettingsStepController'
import type { BusinessSettings } from '../../types/onboarding'

import { Combobox } from '@/shared/ui/Combobox'
import type { ComboboxOption } from '@/shared/ui/Combobox/types'

// Timezone options
const timezoneOptions: ComboboxOption<string>[] = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
]

// Fiscal year start months
const fiscalYearOptions: ComboboxOption<string>[] = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

interface BusinessSettingsStepProps {
  data: BusinessSettings
  onChange: (data: BusinessSettings) => void
  errors?: Record<string, string>
}

export const BusinessSettingsStep = ({
  data,
  onChange,
  errors = {},
}: BusinessSettingsStepProps) => {
  const { handleSelectChange } = useBusinessSettingsStepController({ data, onChange })


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-lg bg-accent/20 border border-white/20 flex items-center justify-center"
        >
          <Settings className="w-8 h-8 text-accent" />
        </motion.div>

        <div>
          <h2 className="text-lg font-medium tracking-tight text-white mb-2">Business Settings</h2>
          <p className="text-gray-400 text-sm">Configure your business preferences</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[420px] mx-auto space-y-6">
        {/* Timezone */}
        <div className="grid gap-2">
          <span className="block text-sm font-normal tracking-tight text-gray-300">Timezone</span>
          <Combobox
            options={timezoneOptions}
            value={data.timezone}
            onChange={(value) => handleSelectChange('timezone', value ?? '')}
            placeholder="Select timezone"
            error={errors.timezone}
            searchable={true}
            clearable={true}
          />
        </div>

        {/* Fiscal Year Start */}
        <div className="grid gap-2">
          <span className="block text-sm font-normal tracking-tight text-gray-300">Fiscal Year Start</span>
          <Combobox
            options={fiscalYearOptions}
            value={data.fiscalYearStart}
            onChange={(value) => handleSelectChange('fiscalYearStart', value ?? '')}
            placeholder="Select fiscal year start"
            error={errors.fiscalYearStart}
            searchable={true}
            clearable={true}
          />
        </div>
      </div>
    </motion.div>
  )
}

