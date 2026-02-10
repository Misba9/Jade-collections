/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jade: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59', // Primary Brand Color
          900: '#134e4a', // Deep Jade
          950: '#042f2e',
        },
        gold: {
          100: '#fbf5e0',
          200: '#f5e6b3',
          300: '#ebd280',
          400: '#e0bd52',
          500: '#d4a72c', // Primary Accent
          600: '#b88622',
          700: '#94631e',
          800: '#7a4f1e',
          900: '#66411e',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
}
