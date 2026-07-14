/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Colors are mapped to CSS variables so themes can be swapped at runtime
      colors: {
        stage: {
          bg: 'var(--color-stage-bg)',
          panel: 'var(--color-stage-panel)',
          panel2: 'var(--color-stage-panel2)',
          line: 'var(--color-stage-line)',
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
          soft: 'var(--color-gold-soft)',
        },
        teal: {
          DEFAULT: 'var(--color-teal)',
        },
        coral: {
          DEFAULT: 'var(--color-coral)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          dim: 'var(--color-ink-dim)',
          faint: 'var(--color-ink-faint)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        stage: '0 20px 60px -20px rgba(0,0,0,0.6)',
        glow: '0 0 0 1px rgba(242,183,5,0.4), 0 0 30px -5px rgba(242,183,5,0.35)',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.85' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(400px) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.4s ease-in-out infinite',
        confettiFall: 'confettiFall 2.2s ease-in forwards',
      },
    },
  },
  plugins: [],
}
