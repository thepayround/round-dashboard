import type { BadgeVariant } from '@/shared/ui'

/**
 * Customer status enum matching backend values
 */
export enum CustomerStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Cancelled = 4,
}

export interface StatusMeta {
  label: string
  variant: BadgeVariant
}

const STATUS_MAP: Record<number, StatusMeta> = {
  [CustomerStatus.Active]: { label: 'Active', variant: 'default' },
  [CustomerStatus.Inactive]: { label: 'Inactive', variant: 'outline' },
  [CustomerStatus.Suspended]: { label: 'Suspended', variant: 'secondary' },
  [CustomerStatus.Cancelled]: { label: 'Cancelled', variant: 'destructive' },
}

const defaultStatus: StatusMeta = STATUS_MAP[CustomerStatus.Active]

/**
 * Get status metadata (label and badge variant) for a customer status
 */
export const getStatusMeta = (status: number | string): StatusMeta => {
  const statusValue = typeof status === 'string' ? parseInt(status, 10) : status
  return STATUS_MAP[statusValue] ?? defaultStatus
}

/**
 * Get display text for a customer status
 */
export const getStatusText = (status: number | string): string => {
  return getStatusMeta(status).label
}

/**
 * Get badge variant for a customer status
 */
export const getStatusVariant = (status: number | string): BadgeVariant => {
  return getStatusMeta(status).variant
}
