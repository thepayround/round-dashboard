import type { TargetAndTransition, Transition } from 'framer-motion'

export interface MotionPreset {
  initial: TargetAndTransition
  animate: TargetAndTransition
  exit?: TargetAndTransition
  transition?: Transition
}

export interface MotionPresets {
  fadeIn: MotionPreset
  slideUp: MotionPreset
  slideUpLarge: MotionPreset
  slideDown: MotionPreset
  slideDownSmall: MotionPreset
  scale: MotionPreset
  scaleWithSlide: MotionPreset
  staggerChildren: MotionPreset
}

/**
 * Common Framer Motion animation presets
 * Use these to maintain consistent animations across the app
 */
export function useMotionPresets(): MotionPresets {
  return {
    // Simple fade in/out
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },

    // Slide up (medium distance)
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 },
    },

    // Slide up (large distance)
    slideUpLarge: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
      transition: { duration: 0.4 },
    },

    // Slide down (medium distance)
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3 },
    },

    // Slide down (small distance)
    slideDownSmall: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
      transition: { duration: 0.2 },
    },

    // Scale animation
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 },
    },

    // Scale with slide (common for modals/cards)
    scaleWithSlide: {
      initial: { opacity: 0, y: 30, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -30, scale: 0.95 },
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },

    // Stagger children animations
    staggerChildren: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
  }
}
