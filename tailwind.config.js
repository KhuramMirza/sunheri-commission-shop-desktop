/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        mandi: {
          50: '#fbf8ee',
          100: '#f5edd3',
          200: '#ecdaa8',
          300: '#dfbf74',
          400: '#d3a547',
          500: '#b9872e',
          600: '#9b6824',
          700: '#7c4d20',
          800: '#673f1f',
          900: '#58361d',
          950: '#321c0e'
        }
      }
    }
  },
  plugins: []
}
