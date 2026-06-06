import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a3c5e',
          50:  '#f0f5fa',
          100: '#d9e8f5',
          200: '#b3d1eb',
          700: '#1a3c5e',
          800: '#152f4a',
          900: '#0f2235',
        },
        gold: {
          DEFAULT: '#c9a84c',
          50:  '#fdf9ee',
          100: '#f9efce',
          400: '#e2c06d',
          500: '#c9a84c',
          600: '#a8863a',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:   '0 2px 8px 0 rgba(0,0,0,.06), 0 0 0 1px rgba(0,0,0,.04)',
        'card-hover': '0 8px 30px 0 rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.04)',
        luxury: '0 20px 60px -10px rgba(26,60,94,.25)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(15,34,53,0.95) 0%, rgba(26,60,94,0.80) 60%, rgba(26,60,94,0.40) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn .4s ease both',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
      },
    },
  },
  plugins: [],
}

export default config
