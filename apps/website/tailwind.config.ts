import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#FFF",
        tertiary: "#F59D21",
      },
      invert: {
        partner: "0",
      },
      screens: {
        "3xl": "1700px",
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

export default config;
