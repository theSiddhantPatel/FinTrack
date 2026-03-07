/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 10px 30px -12px rgba(15, 23, 42, 0.22)",
      },
    },
  },
  plugins: [],
};
