import { AddressStep } from '../components/steps/AddressStep'
import { BillingStep } from '../components/steps/BillingStep'
import { OrganizationStep } from '../components/steps/OrganizationStep'
import { ProductsStep } from '../components/steps/ProductsStep'
import { TeamStep } from '../components/steps/TeamStep'
import type { OnboardingData } from '../types/onboarding'

import type { StepConfig, StepsRegistry } from './types'

/**
 * Centralized onboarding steps configuration
 * Add, remove, or reorder steps by modifying this registry
 */
export const stepsConfig: StepsRegistry = [
  {
    id: 'organization' as const,
    title: 'Organization',
    description: 'Set up your company information',
    component: OrganizationStep as StepConfig['component'],
    validation: (data: OnboardingData) => {
      const { organization, businessSettings } = data
      if (!organization) return false
      return (
        organization.companyName?.trim() !== '' &&
        organization.industry !== '' &&
        organization.companySize !== '' &&
        organization.organizationType !== '' &&
        organization.country !== '' &&
        organization.registrationNumber?.trim() !== '' &&
        organization.taxId?.trim() !== '' &&
        businessSettings?.timezone !== '' &&
        businessSettings?.fiscalYearStart !== ''
      )
    },
    order: 1,
    requiresDataFetch: true,
  },
  {
    id: 'address' as const,
    title: 'Address',
    description: 'Add your billing and shipping addresses',
    component: AddressStep as StepConfig['component'],
    validation: (data: OnboardingData) => {
      const { address } = data
      if (!address?.billingAddress) return false
      const billing = address.billingAddress
      return (
        billing.name?.trim() !== '' &&
        billing.addressLine1?.trim() !== '' &&
        billing.number?.trim() !== '' &&
        billing.city?.trim() !== '' &&
        billing.state?.trim() !== '' &&
        billing.zipCode?.trim() !== '' &&
        billing.country !== ''
      )
    },
    order: 2,
    requiresDataFetch: true,
  },
  {
    id: 'team' as const,
    title: 'Team',
    description: 'Invite team members to collaborate',
    component: TeamStep as StepConfig['component'],
    validation: () => true, // Team step is always valid (invitations are optional)
    canSkip: true,
    order: 3,
  },
  {
    id: 'products' as const,
    title: 'Products',
    description: 'Add your products or services',
    component: ProductsStep as StepConfig['component'],
    validation: () => true, // Products step is always valid (optional)
    canSkip: true,
    order: 4,
  },
  {
    id: 'billing' as const,
    title: 'Billing',
    description: 'Connect your payment provider',
    component: BillingStep as StepConfig['component'],
    validation: () => true, // Billing step is always valid (optional)
    canSkip: true,
    order: 5,
  },
].sort((a, b) => a.order - b.order)

/**
 * Get step configuration by ID
 */
export const getStepConfig = (stepId: string): StepConfig | undefined => {
  return stepsConfig.find((step) => step.id === stepId)
}

/**
 * Get all step IDs in order
 */
export const getStepIds = (): string[] => {
  return stepsConfig.map((step) => step.id)
}

/**
 * Get active steps based on feature flags
 * @param featureFlags - Object with feature flag keys and boolean values
 */
export const getActiveSteps = (featureFlags?: Record<string, boolean>): StepsRegistry => {
  if (!featureFlags) {
    return stepsConfig
  }

  return stepsConfig.filter((step) => {
    // If step has a feature flag, check if it's enabled
    if (step.featureFlag) {
      return featureFlags[step.featureFlag] === true
    }
    // If no feature flag, step is always active
    return true
  })
}
