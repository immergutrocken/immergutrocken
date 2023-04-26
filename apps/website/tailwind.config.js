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
        tertiary: "#FFEF26",
        ciYellow: "#FFEF26",
        ciGray: "#cacac9",
        ciPurple: "#a97ee6",
        ciOrange: "#ef7c17",
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
