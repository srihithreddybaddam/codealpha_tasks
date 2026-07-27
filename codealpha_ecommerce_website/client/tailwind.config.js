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
        brand: {
          primary: '#4F46E5', // Deep Indigo
          primaryHover: '#4338CA',
          secondary: '#06B6D4', // Electric Cyan
          secondaryHover: '#0891B2',
          accent: '#10B981', // Emerald
          accentHover: '#059669',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkText: '#F9FAFB',
          darkMuted: '#9CA3AF'
        }
      },
      borderRadius: {
        'card': '18px',
        '2xl': '18px',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(79, 70, 229, 0.08)',
        'floating': '0 20px 40px -15px rgba(17, 24, 39, 0.07)',
        'glow': '0 0 25px rgba(6, 182, 212, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}
