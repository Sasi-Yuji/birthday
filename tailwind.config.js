/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: '#D4AF37',
        highlight: '#D4AF37',
        accent: '#D4AF37',
      },
    },
  },
  plugins: [],
}
