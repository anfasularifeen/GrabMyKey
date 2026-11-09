/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./admin/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandNavy: {
          DEFAULT: '#0a1d37',
          dark: '#061224',
          light: '#0f2b48',
          surface: '#0d223f'
        },
        champagne: {
          light: '#f3e5ab',
          DEFAULT: '#b8860b',
          gold: '#d4af37',
          hover: '#c49f28',
        }
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', '"Cinzel"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
