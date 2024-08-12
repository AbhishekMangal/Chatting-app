/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      inset:{
        'calc-100-plus-05rem':'calc(100% + 0.5rem)',
      }
    },
  },
  plugins: [],
}

