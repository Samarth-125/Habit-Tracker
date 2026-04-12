/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        serif: ['DM Serif Display', 'serif'],
      },
    },
  },
  plugins: [],
}