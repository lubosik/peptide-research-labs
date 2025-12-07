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
        // Vici Peptides Luxury Black-Gold Palette
        'primary-black': '#000000',
        'secondary-charcoal': '#1A1A1A',
        'luxury-gold': '#D4AF37',
        'accent-gold-light': '#F5D67B',
        'accent-gold-dark': '#B58C1B',
        'pure-white': '#FFFFFF',
        'neutral-gray': '#888888',
        // Legacy mappings for backward compatibility
        primary: {
          DEFAULT: '#D4AF37', // luxury-gold
          light: '#F5D67B', // accent-gold-light
          dark: '#B58C1B', // accent-gold-dark
        },
        secondary: {
          DEFAULT: '#1A1A1A', // secondary-charcoal
          light: '#2A2A2A',
          dark: '#000000', // primary-black
        },
        'neutral-light': '#FFFFFF',
        'accent-gray': '#1A1A1A',
        'text-gray': '#888888',
        warning: {
          50: '#F5D67B',
          400: '#D4AF37',
          800: '#B58C1B',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
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
        'glow-sm': '0 0 10px rgba(245, 214, 123, 0.3)',
        'glow-md': '0 0 20px rgba(245, 214, 123, 0.4)',
        'glow-lg': '0 0 30px rgba(245, 214, 123, 0.5)',
        'glow-xl': '0 0 40px rgba(245, 214, 123, 0.6)',
        'golden-glow': '0 0 12px rgba(245, 214, 123, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config

