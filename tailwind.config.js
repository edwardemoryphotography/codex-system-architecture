/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'DM Sans', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        codex: {
          ink: '#070a10',
          elevated: '#0c111a',
          soft: '#121826',
          paper: '#f4f6f9',
          cyan: '#6ed4ff',
          amber: '#e8b86d',
          mist: '#c8d0dc',
        },
      },
      boxShadow: {
        'codex-glow': '0 0 40px rgba(110, 212, 255, 0.12)',
        'codex-panel': '0 24px 64px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        'codex-pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'codex-pulse-soft': 'codex-pulse-soft 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
