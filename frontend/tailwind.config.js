/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        main: "#26253d",
        sub: "#00CBCC",
        darkgray: "#444444",
        lightgray: "#888888",
      },
      fontFamily: {
        reggae: ["Montserrat"],
      },
    },
  },
  plugins: [],
};
