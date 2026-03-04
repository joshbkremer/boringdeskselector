/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        matrix: {
          black:   '#050905',
          dark:    '#0a0f0a',
          surface: '#0d150d',
          border:  '#1a3a1a',
          dim:     '#2a4a2a',
          mid:     '#4a7c59',
          green:   '#00ff41',
          bright:  '#39d353',
          glow:    '#00ff4180',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'glow':    '0 0 8px #00ff41, 0 0 16px #00ff4133',
        'glow-sm': '0 0 4px #00ff41',
        'glow-lg': '0 0 12px #00ff41, 0 0 24px #00ff4155, 0 0 40px #00ff4122',
        'inner-glow': 'inset 0 0 8px #00ff4122',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.2s ease-out',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 4px #00ff41' },
          '50%': { boxShadow: '0 0 12px #00ff41, 0 0 24px #00ff4155' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
