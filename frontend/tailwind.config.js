module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans"],
      },

      maxWidth: {
        "9xl": "96rem", // 1536px
        "7.5xl": "88rem", // 1408px
      },

      colors: {
        customNavy: "#0B1573",
        customLime: "#d9f99d",
        customGray: "#e2e8f0",
        indiepink: {
          100: '#FDEDEE',
          200: '#FACAD0',
          300: '#F8A8B1',
          400: '#F58593',
          500: '#F36274',
          600: '#F04156', 
          700: '#C03345',
          800: '#902634',
          900: '#601922',
        },
        customRed: "#f55151",
        customBlue: "#0e9cff",
        customHover: "#4c4e6b",
      },
    },
  },

  plugins: [],
};