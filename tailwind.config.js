/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#07071a',
        'navy-2': '#0a0a1f',
        'nll-blue': '#00a8ff',
        'nll-blue-dark': '#0077cc',
      },
    },
  },
  plugins: [],
};
