import type { ComponentType } from 'react'

import type { OnboardingData, OnboardingStep } from '../types/onboarding'

type BivariantHandler<T> = {
  bivarianceHack(value: T): void
}['bivarianceHack']

/**
 * Props that every onboarding step component receives
 */
export interface StepComponentProps<T = unknown> {
  data: T
  onChange: BivariantHandler<T>
  isPrePopulated?: boolean
  // Additional props for specific steps are allowed via index signature
  [key: string]: unknown
}

/**
 * Validation function type
 * Returns true if the step data is valid and user can proceed
 */
export type StepValidation = (data: OnboardingData) => boolean

/**
 * Configuration for a single onboarding step
 */
export interface StepConfig {
  /** Unique identifier for the step */
  id: OnboardingStep

  /** Display title for the step */
  title: string

  /** Optional description */
  description?: string

  /** Icon component for tab navigation (optional) */
  icon?: ComponentType<{ className?: string }>

  /** React component to render for this step */
  component: ComponentType<StepComponentProps>

  /** Validation function - returns true if step is complete and valid */
  validation: StepValidation

  /** Whether this step can be skipped (default: false) */
  canSkip?: boolean

  /** Display order in the wizard */
  order: number

  /** Feature flag key to conditionally show/hide this step */
  featureFlag?: string

  /** Whether to show loading state while fetching data for this step */
  requiresDataFetch?: boolean
}

/**
 * Registry of all onboarding steps
 */
export type StepsRegistry = StepConfig[]
