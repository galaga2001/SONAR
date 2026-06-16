/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sonar: {
          bg: '#080d08',
          phosphor: '#4caf74',
          amber: '#c97d2e',
          teal: '#1a3a3a',
          dim: '#2e5c3e',
          border: '#1f3d2a',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        head: ['"Oswald"', 'sans-serif'],
      },
      keyframes: {
        bootfade: {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        pulseonce: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.8)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        bootfade: 'bootfade 0.3s ease-out both',
        blink: 'blink 1s step-end infinite',
        pulseonce: 'pulseonce 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
