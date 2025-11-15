/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
          glow: '#9333EA',
        },
        dark: {
          bg: '#0A0A0A',
          card: '#1A1A1A',
          border: '#2A2A2A',
          hover: '#252525',
        },
        neutral: {
          bg: '#F4F4F7',
          card: '#FFFFFF',
          heading: '#0F0F0F',
          body: '#3B3B3B',
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        heading: '600',
        subhead: '500',
        body: '400',
        meta: '300',
      },
      borderRadius: {
        card: '20px',
        button: '15px',
        input: '11px',
        panel: '23px',
      },
      boxShadow: {
        visionos: '0px 8px 20px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6A5AE0 0%, #9B8CFF 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lift': 'lift 0.2s ease-out',
        'fade-up': 'fade-up 0.26s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        'lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
