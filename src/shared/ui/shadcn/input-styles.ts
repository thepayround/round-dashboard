/**
 * Shared input styles for consistent form field appearance across the application.
 * Use these constants in Input, PasswordInput, Textarea, and any other text input components.
 */

/** Base styles shared by all input-like components */
export const inputBaseStyles =
  'border-input bg-transparent placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

/** Focus styles for input-like components */
export const inputFocusStyles =
  'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

/** Selection styles for input-like components */
export const inputSelectionStyles =
  'selection:bg-primary selection:text-primary-foreground'

/** Dark mode background adjustment */
export const inputDarkStyles = 'dark:bg-input/30'

/** Transition styles for smooth interactions */
export const inputTransitionStyles = 'transition-[color,box-shadow]'

/** Typography styles for inputs */
export const inputTextStyles = 'text-base md:text-sm'

/** File input specific styles */
export const inputFileStyles =
  'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium'

/**
 * Complete input styles - use this for single-line text inputs.
 * Includes all necessary styles for a standard input field.
 */
export const inputStyles = [
  inputBaseStyles,
  inputFocusStyles,
  inputSelectionStyles,
  inputDarkStyles,
  inputTransitionStyles,
  inputTextStyles,
  inputFileStyles,
  'h-9 w-full min-w-0 rounded-md border px-3 py-1 shadow-xs',
].join(' ')

/**
 * Textarea styles - use this for multi-line text inputs.
 * Similar to inputStyles but with height and resize adjustments.
 */
export const textareaStyles = [
  inputBaseStyles,
  inputFocusStyles,
  inputSelectionStyles,
  inputDarkStyles,
  inputTransitionStyles,
  inputTextStyles,
  'min-h-[80px] w-full rounded-md border px-3 py-2 shadow-xs resize-none',
].join(' ')
