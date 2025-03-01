/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
    base: true,
    // darkTheme: JSON.parse(localStorage.getItem("isdark")) ? "dark" : "light",
  },
};
