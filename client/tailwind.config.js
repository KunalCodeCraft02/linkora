/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d0d0d0',
          300: '#c8c8c8',
          400: '#aaaaaa',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#222222',
          900: '#111111',
        }
      }
    },
  },
  plugins: [],
}