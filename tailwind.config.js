module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      height: theme => ({
        "screen/2": "50vh",
        "half": "50%",
        "c-full": "100%",
        "screen": "100vh",
      }),
      boxShadow: {
        '3xl': '0px 10px 13px -6px rgba(0, 0, 0, 0.08), 0px 20px 31px 3px rgba(0, 0, 0, 0.09), 0px 8px 20px 7px rgba(0, 0, 0, 0.02)'
      },
      colors: {
        'do-first': '#04d98b',
        'do-first-alpha': '#04d98b37',
        'do-later': '#0396a6',
        'do-later-alpha': '#0396a637',
        'delegate': '#f2bd1d',
        'delegate-alpha': '#f2bd1d37',
        'eliminate': '#d92b04',
        'eliminate-alpha': '#d92b0437',
        'company': '#FF3709',
        'company-alpha': '#FF370937',
        'black': '#000000',
        'white': '#FFFFFF',
        'done': '#00cc0e',
        'modal-background': '#00000080',
        'keys': '#1f2021',
        'disable-button': '#8c8c8c',
        'pastel-red': '#e95454',
        'light-blue': '#60a9ff',
        'pricing-border': '#e1f1ff',
        'pricing-header': '#888',
        'pricing-feature': '#016FF9',
        "red": "#f44336",
        "active-link": "#15cdfc",
        "google-button": "#4285f4",
        "white-rgba": "rgba(255, 255, 255, 0.1)",
        "dark": "#121212",
        "dark-gray": "#575757"
      },
      fontFamily: {
        'poppins-light': ["Poppins light", "sans-serif"],
        'poppins-regular': ["Poppins regular", "sans-serif"],
        'poppins-bold': ["Poppins bold", "sans-serif"],
        'poppins-medium': ["Poppins medium", "sans-serif"]
      },
      animation: {
        'rotate': 'rotate-animation 1s linear',
      },
      keyframes: {
        'rotate-animation': {
          'from': {
            'transform': 'rotate(0deg)',
          },
          'to': {
            'transform': 'rotate(360deg)',
          },
        }
      }
    },
  },
  plugins: [],
}