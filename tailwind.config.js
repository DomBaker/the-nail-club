/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Override rose with The Nail Club brand pink palette
        rose: {
          50:  '#fdf0f6',
          100: '#fce4ee',
          200: '#f9c7dc',
          300: '#f59ec2',
          400: '#ef6da1',
          500: '#D4769E',
          600: '#c2517a',
          700: '#a03860',
          800: '#7d2b4b',
          900: '#5c2038',
          950: '#3a0f23',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Lobster', 'cursive']
      }
    }
  },
  plugins: []
}
