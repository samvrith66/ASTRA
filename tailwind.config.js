/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        border: 'var(--border)',
        'border-hover': 'var(--border-hover)',
        primary: 'var(--accent-blue)', /* Blue as primary */
        secondary: '#f59e0b', /* Amber */
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
