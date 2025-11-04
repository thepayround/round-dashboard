import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for intelligent merging
 * 
 * @example
 * cn('px-2 py-1', someCondition && 'px-4') // 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', { 'text-blue-500': isBlue }) // Conditionally applies classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
