/**
 * WeightGPT Design System Tokens
 * Based on: project/DESIGN_SYSTEM.md
 *
 * Aesthetic: Liquid glass minimalism meets BMW M × Apple Health performance energy
 * Design Philosophy: Frosted glass effects, warm nutrition gradients, cool workout precision
 */

export const tokens = {
  // =============================================================================
  // COLORS
  // =============================================================================
  colors: {
    // Primary Colors (App Theme)
    primary: {
      teal: '#14B8A6',         // Primary teal for buttons, active states
      tealLight: '#5EEAD4',    // Lighter teal for highlights
      blue: '#4C9EEB',         // Light blue accent
    },

    // Text Colors
    text: {
      primary: '#1E1E1E',      // Charcoal black - main text
      secondary: '#6E6E73',    // Muted gray - secondary text
      tertiary: '#C7C7CC',     // Light gray - disabled/subtle text
      white: '#FFFFFF',        // White text on dark backgrounds
    },

    // Background Colors
    background: {
      white: '#FFFFFF',
      offWhite: '#FAF9F7',
      frostedGlass: 'rgba(255, 255, 255, 0.7)',
      modalBackdrop: 'rgba(0, 0, 0, 0.4)',
    },

    // Nutrition Theme (Light Blue - Primary App Theme)
    nutrition: {
      blue: '#4C9EEB',           // Primary light blue (was orange)
      blueLight: '#6BADF4',      // Lighter blue (was orangeLight)
      pink: '#FCA7C5',           // Keep for accent
      green: '#81E296',          // Keep for success states
      yellow: '#FFE082',         // Keep for warnings
    },

    // Workout Theme (Cool Precision)
    workout: {
      navy: '#1F3A5F',
      blue: '#4C9EEB',
      red: '#EA4E4E',
      white: '#FFFFFF',
      steelGray: '#EDEDED',
    },

    // Progress Theme (Health Core)
    progress: {
      emerald: '#4BAE90',
      emeraldLight: '#A7F0BA',
      steelBlue: '#6C88A6',
      softGray: '#FAF9F7',
    },

    // Semantic Colors
    semantic: {
      success: '#4BAE90',
      warning: '#4C9EEB',      // Changed from orange to light blue
      error: '#EA4E4E',
      info: '#4C9EEB',
    },

    // Borders & Dividers
    borders: {
      light: 'rgba(0, 0, 0, 0.06)',
      glass: 'rgba(255, 255, 255, 0.3)',
      divider: '#EDEDED',
    },

    // Alias for backwards compatibility
    border: {
      light: 'rgba(0, 0, 0, 0.06)',
      glass: 'rgba(255, 255, 255, 0.3)',
      divider: '#EDEDED',
    },
  },

  // =============================================================================
  // GRADIENTS
  // =============================================================================
  gradients: {
    // Nutrition Context (Now Light Blue Theme)
    nutritionButton: ['#6BADF4', '#4C9EEB'], // 135deg (light blue gradient)
    nutritionRingGlow: ['#4C9EEB', '#6BADF4'], // 180deg (light blue glow)
    warmBloom: 'radial-gradient(circle, rgba(76,158,235,0.3) 0%, transparent 70%)',

    // Workout Context
    workoutButton: ['#EA4E4E', '#EA4E4E'], // Solid red (filled button)
    coolPrecision: ['#4C9EEB', '#1F3A5F'], // 180deg
    intensityPulse: 'radial-gradient(circle, rgba(234,78,78,0.3) 0%, transparent 70%)',

    // Progress Context
    progressFill: ['#4BAE90', '#4BAE90'], // Solid green (no gradient)
    successBloom: 'radial-gradient(circle, rgba(75,174,144,0.2) 0%, transparent 70%)',

    // Light Blue Button (for onboarding)
    lightBlueButton: ['#6BADF4', '#4C9EEB'], // 135deg (subtle light blue gradient)

    // Glassmorphism
    lightGloss: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
  },

  // =============================================================================
  // TYPOGRAPHY
  // =============================================================================
  typography: {
    // Font Family (React Native will use system fonts)
    fontFamily: {
      primary: 'System', // React Native uses platform defaults (SF Pro on iOS, Roboto on Android)
    },

    // Display (Large Numbers, Hero Text)
    display: {
      xl: {
        fontSize: 40,
        lineHeight: 48,
        fontWeight: '700' as const,
        letterSpacing: -0.8,
      },
      l: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
      },
      m: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: '600' as const,
        letterSpacing: -0.3,
      },
    },

    // Headings
    heading: {
      h1: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: '700' as const,
        letterSpacing: -0.2,
      },
      h2: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600' as const,
        letterSpacing: -0.1,
      },
      h3: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600' as const,
        letterSpacing: -0.1,
      },
    },

    // Body Text
    body: {
      l: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      m: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      s: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      xs: {
        fontSize: 11,
        lineHeight: 14,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
    },

    // Interactive Text (Buttons, Links)
    button: {
      l: {
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '600' as const,
        letterSpacing: 0,
      },
      m: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500' as const,
        letterSpacing: 0,
      },
      s: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500' as const,
        letterSpacing: 0,
      },
    },

    // Tab Label
    tabLabel: {
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },

    // Caption (small supporting text)
    caption: {
      l: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      m: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
      s: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '400' as const,
        letterSpacing: 0,
      },
    },
  },

  // =============================================================================
  // SPACING
  // =============================================================================
  spacing: {
    xs: 4,      // Icon-to-text gap, tight inline spacing
    sm: 8,      // Label-to-input, small element gaps
    md: 12,     // Default element separation, card internal padding (tight)
    lg: 16,     // Card padding (standard), section margins
    xl: 20,     // Card-to-card spacing (vertical stacks)
    '2xl': 24,  // Major section gaps
    '3xl': 32,  // Page horizontal padding, large breaks
    '4xl': 40,  // Extra-large section dividers
  },

  // Layout-specific spacing
  layout: {
    screenHorizontalPadding: 16,
    screenTopPadding: 8,
    cardBorderRadius: 20,
    cardPadding: 16,
    cardVerticalSpacing: 20,
  },

  // =============================================================================
  // SHADOWS
  // =============================================================================
  shadows: {
    // iOS-style shadows (React Native shadowColor, shadowOffset, shadowOpacity, shadowRadius)
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 24,
      elevation: 4, // Android
    },
    cardHover: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 32,
      elevation: 6,
    },
    button: {
      shadowColor: '#4C9EEB',  // Changed from orange to light blue
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 4,
    },
    fab: {
      shadowColor: '#4BAE90',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    },
    modal: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
    toast: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // =============================================================================
  // BORDER RADIUS
  // =============================================================================
  borderRadius: {
    none: 0,
    xs: 8,       // Small badges, labels
    sm: 12,      // Inputs, badges
    md: 16,      // Secondary buttons
    rounded: 20, // Cards, modals
    pill: 24,    // Primary buttons, toggles
    circle: 28,  // FAB (56×56px = 28px radius), icon buttons
  },

  // =============================================================================
  // ANIMATION
  // =============================================================================
  animation: {
    // Duration (in milliseconds)
    durations: {
      instant: 100,     // State changes (checkbox, button press)
      fast: 200,        // Toasts, micro-interactions, color transitions
      normal: 300,      // Most animations (cards, modals)
      medium: 400,      // Screen transitions, tab switches
      slow: 600,        // Progress fills, complex animations
      verySlow: 800,    // Graph updates, data visualizations
    },

    // Easing (React Native Animated.timing easing)
    // Use Easing.bezier() for custom curves
    easing: {
      easeOut: [0.25, 0.46, 0.45, 0.94],     // Entering elements
      easeIn: [0.55, 0.055, 0.675, 0.19],    // Exiting elements
      easeInOut: [0.645, 0.045, 0.355, 1],   // State changes
      linear: [0, 0, 1, 1],                   // Continuous motion
    },
  },

  // =============================================================================
  // GLASSMORPHISM
  // =============================================================================
  glassmorphism: {
    // Base effect (requires react-native-blur or expo-blur)
    backdrop: 20, // blur radius in pixels
    border: 'rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.7)',

    // Inner shadow (for depth)
    innerShadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },

    // Tint opacity levels
    tints: {
      background: 0.1,   // 10% opacity for background tints
      selected: 0.05,    // 5% opacity for selected states
      badge: 0.15,       // 15% opacity for badges
      glow: 0.3,         // 30% opacity for glows
    },
  },

  // =============================================================================
  // COMPONENT SIZES
  // =============================================================================
  sizes: {
    // Button Heights
    button: {
      large: 48,
      medium: 40,
      small: 32,
    },

    // Icon Sizes
    icon: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 40,
    },

    // FAB
    fab: 56,

    // Touch Targets (minimum for accessibility)
    touchTarget: 44,

    // Tab Bar
    tabBar: 80,
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type Tokens = typeof tokens;
export type ColorKey = keyof typeof tokens.colors;
export type SpacingKey = keyof typeof tokens.spacing;
export type TypographyKey = keyof typeof tokens.typography;

export default tokens;
