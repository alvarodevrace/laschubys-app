/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          DEFAULT: '#1fa634',
          dark:    '#167828',
          soft:    '#6ede7a',
        },
        fire: {
          DEFAULT: '#f2600c',
          dark:    '#d94f0a',
        },
        canvas: '#f5f4f0',
      },
      fontFamily: {
        sans:    ['"Satoshi"', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                                 to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.93)' },       to: { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'fade-in':  'fadeIn 0.22s ease',
        'scale-in': 'scaleIn 0.28s ease',
      },
    },
  },
  plugins: [],
};
