/**
 * Theme Configuration
 * 
 * This file defines the design system theme for the application.
 * All colors, spacing, typography, and other design tokens are centralized here.
 */

export const theme = {
  colors: {
    // Primary colors - Royal Blue (#1B3FC4)
    primary: {
      DEFAULT: 'hsl(228 76% 44%)', // Royal Blue
      foreground: 'hsl(0 0% 100%)', // White text
    },
    
    // Background colors - White (#FFFFFF)
    background: {
      DEFAULT: 'hsl(0 0% 100%)', // White
      muted: 'hsl(228 58% 95%)', // Light Lavender for muted backgrounds
    },
    
    // Foreground colors
    foreground: {
      DEFAULT: 'hsl(228 76% 20%)', // Dark blue text
      muted: 'hsl(228 30% 40%)', // Muted blue text
      subtle: 'hsl(228 30% 60%)', // Subtle blue text
    },
    
    // Card colors
    card: {
      DEFAULT: 'hsl(0 0% 100%)', // Pure white
      foreground: 'hsl(228 76% 20%)', // Dark blue text
      border: 'hsl(228 60% 75%)', // Muted Periwinkle border
    },
    
    // Muted colors for subtle backgrounds
    muted: {
      DEFAULT: 'hsl(228 58% 95%)', // Light Lavender
      foreground: 'hsl(228 30% 40%)', // Muted blue text
      hover: 'hsl(228 58% 92%)', // Slightly darker on hover
    },
    
    // Secondary colors - Medium Blue (#3A5ACB)
    secondary: {
      DEFAULT: 'hsl(228 58% 51%)', // Medium Blue
      foreground: 'hsl(0 0% 100%)', // White text
    },
    
    // Accent colors - Vivid Lime Green (#38FE14)
    accent: {
      DEFAULT: 'hsl(110 99% 54%)', // Vivid Lime Green
      foreground: 'hsl(228 76% 20%)', // Dark blue text
    },
    
    // Border and input colors
    border: 'hsl(228 60% 75%)', // Muted Periwinkle
    input: 'hsl(228 60% 75%)',
    ring: 'hsl(228 58% 51%)', // Medium Blue for focus rings
    
    // Status colors (semantic) - using palette colors
    status: {
      drafts: {
        bg: 'hsl(228 58% 95%)',
        text: 'hsl(228 76% 44%)',
      },
      inProgress: {
        bg: 'hsl(110 99% 90%)',
        text: 'hsl(110 99% 30%)',
      },
      completed: {
        bg: 'hsl(228 60% 85%)',
        text: 'hsl(228 76% 35%)',
      },
      archived: {
        bg: 'hsl(228 58% 95%)',
        text: 'hsl(228 30% 50%)',
      },
      active: {
        bg: 'hsl(110 99% 95%)',
        text: 'hsl(110 99% 40%)',
      },
    },
    
    // Destructive (error) color
    destructive: {
      DEFAULT: 'hsl(228 76% 35%)', // Darker Royal Blue
      foreground: 'hsl(0 0% 100%)',
    },
    
    // Sidebar colors - Royal Blue sidebar
    sidebar: {
      DEFAULT: 'hsl(228 76% 44%)', // Royal Blue
      foreground: 'hsl(0 0% 100%)', // White text
      border: 'hsl(228 76% 35%)',
      accent: 'hsl(110 99% 54%)', // Lime Green for highlights
      'accent-foreground': 'hsl(228 76% 20%)', // Dark blue text
    },
  },
  
  // Border radius
  radius: {
    DEFAULT: '0.625rem', // 10px
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
    xl: 'calc(0.625rem + 4px)',
    '2xl': 'calc(0.625rem + 8px)',
    '3xl': 'calc(0.625rem + 12px)',
    '4xl': 'calc(0.625rem + 16px)',
  },
  
  // Spacing scale (using Tailwind defaults)
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
} as const

export type Theme = typeof theme
