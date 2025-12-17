import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vici Peptides Clinical Luxury Palette - Ivory, Charcoal, Taupe
        'ivory': '#F6F1EB', // Primary background - soft ivory
        'charcoal': '#2B2B2B', // Primary text - dark charcoal
        'stone': '#CFC7BC', // Secondary neutral - muted stone
        'taupe': '#E6DED4', // Light taupe - hover states, shadows, dividers
        // Legacy mappings for backward compatibility (mapped to new palette)
        'primary-black': '#2B2B2B', // Now charcoal
        'secondary-charcoal': '#CFC7BC', // Now stone
        'luxury-gold': '#2B2B2B', // Now charcoal
        'accent-gold-light': '#2B2B2B', // Now charcoal
        'accent-gold-dark': '#2B2B2B', // Now charcoal
        'pure-white': '#F6F1EB', // Now ivory
        'neutral-gray': '#CFC7BC', // Now stone
        primary: {
          DEFAULT: '#2B2B2B', // charcoal
          light: '#CFC7BC', // stone
          dark: '#2B2B2B', // charcoal
        },
        secondary: {
          DEFAULT: '#CFC7BC', // stone
          light: '#E6DED4', // taupe
          dark: '#2B2B2B', // charcoal
        },
        'neutral-light': '#F6F1EB', // ivory
        'accent-gray': '#CFC7BC', // stone
        'text-gray': '#2B2B2B', // charcoal
        warning: {
          50: '#E6DED4', // taupe
          400: '#CFC7BC', // stone
          800: '#2B2B2B', // charcoal
        },
      },
      fontFamily: {
        sans: ['Times New Roman', 'Times', 'serif'],
        serif: ['Times New Roman', 'Times', 'serif'],
        heading: ['Times New Roman', 'Times', 'serif'],
      },
      spacing: {
        '30': '120px', // 120px spacing for section breathing room
      },
      transitionDuration: {
        '400': '400ms', // Standardized 400ms transition duration
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(245, 214, 123, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(245, 214, 123, 0.8))' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        goldPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(245, 214, 123, 0.4)',
            borderColor: 'rgba(212, 175, 55, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(245, 214, 123, 0.7)',
            borderColor: 'rgba(245, 214, 123, 0.8)',
          },
        },
      },
      boxShadow: {
        'glow-sm': '0 2px 8px rgba(43, 43, 43, 0.1)',
        'glow-md': '0 4px 12px rgba(43, 43, 43, 0.15)',
        'glow-lg': '0 6px 16px rgba(43, 43, 43, 0.2)',
        'glow-xl': '0 8px 24px rgba(43, 43, 43, 0.25)',
        'golden-glow': '0 2px 8px rgba(230, 222, 212, 0.3)',
        'taupe': '0 2px 8px rgba(230, 222, 212, 0.3)',
        'stone': '0 4px 12px rgba(207, 199, 188, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config

