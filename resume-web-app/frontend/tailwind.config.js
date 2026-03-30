/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0a0f', surface: '#111118', card: '#1a1a24' },
        border: { DEFAULT: '#2a2a3a' },
        accent: {
          indigo: '#6366f1',
          warm: '#d4a44a',
          current: '#4ade80',
        },
        text: { primary: '#f1f5f9', secondary: '#94a3b8' }
      },
      boxShadow: {
        glow: '0 0 20px rgba(99,102,241,0.2)',
        'glow-lg': '0 0 30px rgba(99,102,241,0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
}
