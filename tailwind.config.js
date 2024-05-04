/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/*.{js,jsx,ts,tsx}"],
    theme: {
        screens: {
          'sm': {'max': '600px'},
          // => @media (max-width: 600px) { ... }
    
          'md': {'min': '600px', 'max': '750px'},
          // => @media (min-width: 600px) and (max-width:750px) { ... }
    
          'lg': {'min': '750px', 'max': '1400px'},
          // => @media (min-width: 750px) and (max-width:1400px) { ... }
    
          'xl': {'min': '1400', 'max': '2400px'},
          // => @media (min-width: 1400px) { ... }
    
          '2xl': {'min': '2400px'}
        },
        colors: {
            'dark': 'rgb(17 24 39)',
            'light': 'rgb(209 213 219)',
            'transparent': 'rgba(0, 0, 0, 0)',
            'transparent-half': 'rgba(0,0,0,0.4)'
        },
        extend: {}
    },
    plugins: [],
}

