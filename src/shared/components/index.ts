/**
 * Backwards-compatible barrel that now re-exports from the new shared/ui,
 * shared/layout, and shared/widgets packages. Prefer importing from those
 * packages directly in new code.
 */

// Layout
export { DashboardLayout } from '../layout/DashboardLayout'
export { Breadcrumb } from '../layout/Breadcrumb'
export { ErrorBoundary } from '../layout/ErrorBoundary'
export { ProtectedRoute } from '../layout/ProtectedRoute'
export { FullScreenLoader } from './FullScreenLoader'

// Branding
export { WhiteLogo } from '../ui/WhiteLogo'
export { AuthLogo } from '../ui/AuthLogo'

// UI primitives
export { Button, IconButton, PlainButton, RoundButton, UserButton } from '../ui/Button'
export { ActionButton } from '../ui/ActionButton'
export { AuthInput } from '../ui/AuthInput'
export { FormInput } from '../ui/FormInput'
export { Modal } from '../ui/Modal'
export { Card, ActionCard } from '../ui/Card'
export { SectionHeader } from '../ui/SectionHeader'
export { ViewModeToggle } from '../ui/ViewModeToggle'
export type { ViewMode, ViewModeOption } from '../ui/ViewModeToggle'
export { SearchInput } from '../ui/SearchInput'
export { Pagination } from '../ui/Pagination'
export { PasswordStrengthIndicator } from '../ui/PasswordStrengthIndicator'
export { Toast } from '../ui/Toast'
export { PhoneInput } from '../ui/PhoneInput'
export { PhoneDisplay } from '../ui/PhoneDisplay'
export type { PhoneDisplayProps, CountryInfo } from '../ui/PhoneDisplay'

// Widgets
export { FilterChip } from '../widgets/FilterChip'
export type { FilterChipProps } from '../widgets/FilterChip'
export { FilterChipsBar } from '../widgets/FilterChipsBar'
export type { FilterChipsBarProps, ActiveFilter } from '../widgets/FilterChipsBar'
export { FilterPanel } from '../widgets/FilterPanel'
export type { FilterPanelProps } from '../widgets/FilterPanel'
export { SearchFilterToolbar } from '../widgets/SearchFilterToolbar'
export type { SearchFilterToolbarProps, FilterField } from '../widgets/SearchFilterToolbar'
export { ConfirmDialog } from '../widgets/ConfirmDialog'
export { Stepper, StepIndicator } from '../widgets/Stepper'
export type { Step, StepperProps, StepIndicatorProps } from '../widgets/Stepper'
