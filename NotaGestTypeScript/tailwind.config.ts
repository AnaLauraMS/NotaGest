const { fontFamily } = require('tailwindcss/defaultTheme');
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          jakarta: ["'Plus Jakarta Sans'", ...fontFamily.sans],
        },
      },
    },
    plugins: [],
  };