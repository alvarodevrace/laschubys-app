/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#ff7a1a',
          dark: '#e06300',
          light: '#fff1e5',
        },
        surface: '#fff4e8',
        text: {
          DEFAULT: '#333333',
          muted: '#6b7280',
        },
        border: '#e0e0e0',
        dark: '#141313',
      },
      fontFamily: {
        sans: ["'Open Sans'", 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'auth-pulse': 'authPulse 1.2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        authPulse: {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
