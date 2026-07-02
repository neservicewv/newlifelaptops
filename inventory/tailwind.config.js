/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#07071a',
          card: '#0d0d2b',
          border: 'rgba(0,168,255,0.15)',
          primary: '#00a8ff',
          secondary: '#00d4ff',
          muted: '#8892b0',
          text: '#ccd6f6',
          heading: '#e6f1ff',
        },
      },
    },
  },
  plugins: [],
};
