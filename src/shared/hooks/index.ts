/**
 * Shared Hooks Export
 * Central export point for all custom hooks
 */

// Async Operation Hooks
export {
  useAsyncOperation,
  useAsyncAction,
  type AsyncOperationState,
  type UseAsyncOperationReturn,
  type AsyncOperationOptions,
} from './useAsyncOperation'

// Existing hooks
export { useAuth } from './useAuth'
export { useCurrency } from './useCurrency'
export { useAutoSave } from './useAutoSave'
export { useDebouncedSearch } from './useDebouncedSearch'
export { useDebouncedUpdate } from './useDebouncedUpdate'
export { useFormChangeDetection } from './useFormChangeDetection'
export { useForm, type ValidationResult } from './useForm'
export { useMobileOptimizations } from './useMobileOptimizations'
export { usePhoneFormatting } from './usePhoneFormatting'
export { usePhoneValidation } from './usePhoneValidation'
export { useResponsive } from './useResponsive'
export { useRoundAccount } from './useRoundAccount'
export { useUserSettingsManager } from './useUserSettingsManager'
export { useViewPreferences } from './useViewPreferences'
export { useReducedMotion } from './useReducedMotion'
export { useSidebarState, type UseSidebarStateOptions, type UseSidebarStateReturn } from './useSidebarState'
export { useKeyboardNavigation, type UseKeyboardNavigationOptions, type UseKeyboardNavigationReturn } from './useKeyboardNavigation'
export { useSwipeGesture, type UseSwipeGestureOptions, type UseSwipeGestureReturn, type SwipeDirection } from './useSwipeGesture'
