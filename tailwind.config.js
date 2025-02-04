/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class', // Dark mode class tabanlı
  mode: "jit",
  theme: {
    extend: {
      colors: {
        toggleButton: {
          DEFAULT: '#ecca2f', // Light mode
          dark: '#292929',   // Dark mode
        },
        mainBackground: {
          DEFAULT: '#6886c5',
          dark: '#271818',
        },
        contentBackground: {
          DEFAULT: '#fff',
          dark: '#141414',
        },
        textColor: {
          DEFAULT: '#fff',
          dark: '#dddad5',
        },
        gridBackground: {
          DEFAULT: '',
          dark: '#181a1b',
        },
        primary: {
          DEFAULT: "#6886c5",
          dark: "#4b5563", 
        },
        secondary: {
          DEFAULT: "#6b7280",
          dark: "#9ca3af",
        },
      },
    },
  },
  plugins: [],
};
