/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Jua"', "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#0BB8F9",
          light: "#3CC7FA",
          dark: "#0A9ED9",
        },
      },
    },
  },
  plugins: [],
};
