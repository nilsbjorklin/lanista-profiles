/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
          'sm': {'max': '600px'},    
          'md': {'min': '600px', 'max': '750px'},    
          'lg': {'min': '750px', 'max': '1400px'},    
          'xl': {'min': '1400', 'max': '2400px'}
        },
        colors: {
            'dark': 'rgb(17 24 39)',
            'light': 'rgb(209 213 219)',
            'blue': '#00468B',
            'red' :'#8B0000',
            'transparent': 'rgba(0, 0, 0, 0)',
            'transparent-half': 'rgba(0,0,0,0.4)'
        },
        extend: {}
    },
    plugins: [],
}