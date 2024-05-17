/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT')
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
module.exports = withMT({
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      wide: '1000px',
    },
    extend: {
      colors: {
        ...colors,
        'dark-blue': '#43466a',
        ruliweb: '#1a70dc',
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        cardIdle: {
          '0%': { height: '100px' },
          '50%': { height: '200px' },
          '100%': { height: '100px' },
        },
      },
      animation: {
        cardIdle: 'cardIdle 5s cubic-bezier(0.65, 0.05, 0.36, 1) infinite',
        slideIn: 'slideIn .25s ease-in-out forwards var(--delay, 0)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      )
    }),
  ],
})
