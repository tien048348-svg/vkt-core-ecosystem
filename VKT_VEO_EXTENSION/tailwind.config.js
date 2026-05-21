export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#fbbf24', // Amber 400
          500: '#f59e0b', // Amber 500
          600: '#d97706', // Amber 600
          700: '#b45309', // Amber 700
        },
        surface: {
          DEFAULT: '#12161e',
          hover: '#1e2230',
        },
        background: '#0a0e14',
        border: '#1e293b',
        text: {
          main: '#f3f4f6',
          muted: '#9ca3af'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
