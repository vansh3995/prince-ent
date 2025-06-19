/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",         // Next.js app directory
    "./pages/**/*.{js,ts,jsx,tsx}",       // If using /pages too
    "./components/**/*.{js,ts,jsx,tsx}",  // All UI components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
