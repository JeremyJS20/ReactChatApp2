const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}",
    "./src/Components/Pages/SignIn/*.{js,jsx,ts,tsx}",
    "./src/Components/Pages/SignUp/*.{js,jsx,ts,tsx}",
    "./src/Components/Pages/ChatUI/*.{js,jsx,ts,tsx}",
    "./src/Components/Pages/ChatUI/ChatUISubComponents/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/src/components/*.js"
  ],
  theme: {
    extend: {
      fontFamily:{
        sans: ['Fredoka', ...defaultTheme.fontFamily.sans]
      },
      height: {
        'n': '5.5%',
        'b': '94.5%',
        'b2': '93%',
        'available': '-webkit-fill-available'
      },
      width: {
        'half': '50%',
        '4/12': '33.3333333333%',
        '1/5': '20%',
        '3/5': '60%',
        'available': '-webkit-fill-available'
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('daisyui')
  ],
}
