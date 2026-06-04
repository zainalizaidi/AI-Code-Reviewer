/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        card: '#16161f',
        border: '#1e1e2e',
        accent: '#6ee7b7',
        'accent-dim': '#34d399',
        highlight: '#f59e0b',
        danger: '#f87171',
        warn: '#fbbf24',
        info: '#60a5fa',
        muted: '#4b5563',
        subtle: '#9ca3af',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-1': 'radial-gradient(at 20% 50%, #6ee7b720 0, transparent 50%), radial-gradient(at 80% 20%, #6366f120 0, transparent 40%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(110, 231, 183, 0.15)',
        'glow-sm': '0 0 10px rgba(110, 231, 183, 0.1)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
