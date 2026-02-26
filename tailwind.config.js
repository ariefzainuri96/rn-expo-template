/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#5D3FD3',
        'background-light': '#f6f6f8',
        'background-dark': '#101622',
        'accent-purple': '#5D3FD3',
        'accent-purple-light': '#F3F0FF',
        'accent-purple-soft': '#EBE5FF',
        'accent-purple-hover': '#4b32b0',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
      },
    },
  },
  plugins: [],
}