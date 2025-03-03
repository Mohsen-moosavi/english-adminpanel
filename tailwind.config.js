/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "body-color" : "#156790",
        "main-color" : '#0e4b50',
        "secound-color" : '#dc7718'
        // "light-color" : "#eee",
        // "dark-color" : "#39414a",
        // // "text-color" : "#121212",


        // "primary-color" : "#009fca",

        // // "custom-blue" : "#43d7ff",
        // "custom-blue" : "#84d8fb",
        // "custom-dark-blue" : "#166d91",
        // "custom-gray" : "#808080",
        // "custom-dark-green" : "#298c89",
        // "custom-black" : "#121212",
        // "custom-red" : '#d75252'
      },
      boxShadow : {
        "shadow-inset" : 'inset 0 0 0.8rem #000',
        "shadow" : '0 0 0.8rem #000',
        "shadow-low" : '0 0 10px -3px #000'
      },
      backgroundImage : {
        'zip' : 'linear-gradient(to left, #e37a00, #fbf5e6)',
        'pdf' : 'linear-gradient(to left, #ff5757, #ffe7e7)'
      }
    },
  },
  plugins: [],
}

