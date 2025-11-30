import { motion } from 'framer-motion'
import { AlertCircle, Settings } from 'lucide-react'

import { useBusinessSettingsStepController } from '../../hooks/useBusinessSettingsStepController'
import type { BusinessSettings } from '../../types/onboarding'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select'

// Timezone options
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'UTC', label: 'UTC' },
]

// Fiscal year start months
const fiscalYearMonths = [
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
        <div>
          <span className="block text-sm font-normal tracking-tight text-gray-300 mb-2">Timezone</span>
          <Select value={data.timezone} onValueChange={(value: string) => handleSelectChange('timezone', value)}>
            <SelectTrigger className={errors.timezone ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timezone && (
            <div className="mt-1 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.timezone}</span>
            </div>
          )}
        </div>

        {/* Fiscal Year Start */}
        <div>
          <span className="block text-sm font-normal tracking-tight text-gray-300 mb-2">Fiscal Year Start</span>
          <Select value={data.fiscalYearStart} onValueChange={(value: string) => handleSelectChange('fiscalYearStart', value)}>
            <SelectTrigger className={errors.fiscalYearStart ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select fiscal year start" />
            </SelectTrigger>
            <SelectContent>
              {fiscalYearMonths.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fiscalYearStart && (
            <div className="mt-1 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.fiscalYearStart}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

