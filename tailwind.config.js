/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d6edff',
          200: '#b3dcff',
          300: '#85c5ff',
          400: '#56a6ff',
          500: '#2b84ff', // primary
          600: '#1e66e6',
          700: '#184fba',
          800: '#163f93',
          900: '#143674',
        },
        ink: '#0b1020',
      },
    },
  },
  plugins: [],
};
