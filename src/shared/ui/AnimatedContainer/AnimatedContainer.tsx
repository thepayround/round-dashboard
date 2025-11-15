import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'

import { useMotionPresets } from '@/shared/hooks/useMotionPresets'

export type AnimationPreset =
  | 'fadeIn'
  | 'slideUp'
  | 'slideUpLarge'
  | 'slideDown'
  | 'slideDownSmall'
  | 'scale'
  | 'scaleWithSlide'
  | 'staggerChildren'

interface AnimatedContainerProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'> {
  /** Animation preset to use */
  preset?: AnimationPreset
  /** Optional delay before animation starts (in seconds) */
  delay?: number
  /** Optional custom duration (in seconds) */
  duration?: number
  /** Child elements to animate */
  children: React.ReactNode
}

/**
 * AnimatedContainer component
 *
 * A reusable wrapper for Framer Motion animations with predefined presets.
 * Use this instead of motion.div for consistent animations across the app.
 *
 * @example
 * ```tsx
 * <AnimatedContainer preset="slideUp">
 *   <Card>Content</Card>
 * </AnimatedContainer>
 * ```
 *
 * @example
 * ```tsx
 * <AnimatedContainer preset="fadeIn" delay={0.2} duration={0.5}>
 *   <div>Delayed fade in</div>
 * </AnimatedContainer>
 * ```
 */
export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ preset = 'fadeIn', delay, duration, children, className, ...restProps }, ref) => {
    const presets = useMotionPresets()
    const selectedPreset = presets[preset]

    // Override transition if delay or duration is provided
    const transition = {
      ...selectedPreset.transition,
      ...(delay !== undefined && { delay }),
      ...(duration !== undefined && { duration }),
    }

    return (
      <motion.div
        ref={ref}
        initial={selectedPreset.initial}
        animate={selectedPreset.animate}
        exit={selectedPreset.exit}
        transition={transition}
        className={className}
        {...restProps}
      >
        {children}
      </motion.div>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'
