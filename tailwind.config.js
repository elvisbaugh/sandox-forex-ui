/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        bnp: {
          green: '#009639',
          dark: '#0a1f1c',
          panel: '#11302b',
        },
      },
    },
  },
  plugins: [],
};
