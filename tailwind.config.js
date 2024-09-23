module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        customColor: "hsl(123, 10%, 63%)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
