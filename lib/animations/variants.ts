/**
 * Strevo Animation System
 * Premium cubic-bezier easing with Framer Motion variants
 */

// Easing functions
export const easing = {
  premium: [0.19, 1, 0.22, 1] as const,
  bounceSubtle: [0.34, 1.56, 0.64, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
}

// Duration tokens (in seconds)
export const duration = {
  micro: 0.15,
  short: 0.2,
  medium: 0.3,
  long: 0.6,
}

// Fade Up - Primary entrance animation
export const fadeUp = {
  hidden: { y: 18, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: duration.medium, ease: easing.premium },
  },
}

// Fade In - Simple opacity
export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: duration.short, ease: 'easeOut' },
  },
}

// Scale In - For modals and popovers
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.short, ease: easing.premium },
  },
}

// Slide from Right - For drawers
export const slideRight = {
  hidden: { x: '100%' },
  show: {
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
  exit: {
    x: '100%',
    transition: { duration: duration.short, ease: 'easeOut' },
  },
}

// Slide from Left - For sidebars
export const slideLeft = {
  hidden: { x: '-100%' },
  show: {
    x: 0,
    transition: { duration: duration.medium, ease: easing.premium },
  },
  exit: {
    x: '-100%',
    transition: { duration: duration.short, ease: 'easeOut' },
  },
}

// Stagger Container - For lists/grids
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
}

// Stagger Item - Child of stagger container
export const staggerItem = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: duration.medium, ease: easing.premium },
  },
}

// Hero variants - Orchestrated sequence
export const heroHeading = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: easing.premium, delay: 0.1 },
  },
}

export const heroSubtitle = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: easing.premium, delay: 0.22 },
  },
}

export const heroCTA = {
  hidden: { y: 12, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: easing.premium, delay: 0.34 },
  },
}

// Mega Menu variants
export const megaMenuContainer = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.short,
      ease: easing.premium,
      staggerChildren: 0.03,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.12, ease: 'easeOut' },
  },
}

export const megaMenuColumn = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.short, ease: easing.premium },
  },
}

// Product Card hover
export const productCardHover = {
  rest: { y: 0 },
  hover: {
    y: -6,
    transition: { duration: 0.12, ease: 'easeOut' as const },
  },
}

// Product Image hover
export const productImageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: easing.premium },
  },
}

// Button tap
export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
}

// Wishlist heart bounce
export const heartBounce = {
  rest: { scale: 1 },
  tap: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.25, ease: easing.bounceSubtle },
  },
}

// Toast slide up
export const toastSlide = {
  hidden: { y: 100, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: duration.micro, ease: easing.premium },
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
}

// Backdrop fade
export const backdropFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: duration.micro },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
}

// Accordion height animation
export const accordionContent = {
  hidden: { height: 0, opacity: 0 },
  show: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.16, ease: 'easeOut' },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.12, ease: 'easeOut' },
  },
}

// Crossfade for image galleries
export const crossfade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

// Parallax helper (use with useTransform)
export const parallaxConfig = {
  subtle: { inputRange: [0, 1], outputRange: [0, -20] },
  medium: { inputRange: [0, 1], outputRange: [0, -50] },
  strong: { inputRange: [0, 1], outputRange: [0, -100] },
}
