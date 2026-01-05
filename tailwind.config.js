/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
      },
      colors: {
        primary: '#334155', // slate-700
        secondary: '#64748b', // slate-500
        accent: '#ca8a04', // yellow-600
        'accent-bg': '#fef08a', // yellow-200
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
      }
    },
  },
  plugins: [],
};
