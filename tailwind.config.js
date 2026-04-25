/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lime: '#84cc16',
          volt: '#ccff00',
          dark: '#0f0f0f',
          light: '#f9fafb',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
      lineHeight: {
        'tight': '0.85',
        'snug': '0.9',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
}
