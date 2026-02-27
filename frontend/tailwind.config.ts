import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:   ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:   ['JetBrains Mono', 'monospace'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        ged: {
          green:  '#166534',
          red:    '#c1272d',
          gold:   '#d4a843',
          navy:   '#0f1e3d',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card:     '0 1px 3px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04)',
        elevated: '0 4px 16px rgba(37,99,235,.12), 0 1px 4px rgba(0,0,0,.06)',
        button:   '0 1px 2px rgba(0,0,0,.05), 0 2px 6px rgba(37,99,235,.15)',
        sidebar:  '4px 0 24px rgba(0,0,0,.06)',
        header:   '0 1px 0 rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)',
        'inner-sm': 'inset 0 1px 2px rgba(0,0,0,.06)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'slide-in-right': {
          '0%':   { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.2s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in':        'fade-in 0.2s ease both',
        'scale-in':       'scale-in 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;