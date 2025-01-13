/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Dark mode class tabanlı
  mode: "jit",
  theme: {
    extend: {
      colors: {
        mainBackground: {
          DEFAULT: '#fff',
          dark: '#121212',
        },
        red:{
          DEFAULT: '#b32017',
          dark: '#b32017',
        }
      }
    },
  },
  plugins: [
  ],
};
