/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#fafafa',
        card: '#121212',
        'card-foreground': '#ffffff',
        primary: '#e11d48',
        'primary-foreground': '#ffffff',
        secondary: '#7c3aed',
        'secondary-foreground': '#ffffff',
        muted: '#262626',
        'muted-foreground': '#a1a1aa',
        accent: '#f59e0b',
        'accent-foreground': '#000000',
        border: '#27272a',
        input: '#27272a',
        ring: '#e11d48',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        sm: '0.5rem',
        lg: '1rem',
        pill: '9999px',
      },
    },
  },
  plugins: [],
}
