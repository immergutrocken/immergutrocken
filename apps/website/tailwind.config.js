module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#FFF",
        tertiary: "#98CE58",
      },
      invert: {
        partner: "0",
      },
    },
    fontFamily: {
      content: ["Ludwig-Normal"],
      important: ["Ludwig-Bold"],
      icon: ["Font Awesome Free"],
    },
  },
  plugins: [],
};
