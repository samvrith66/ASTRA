/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0a',
                surface: '#111111',
                border: '#1a1a1a',
                primary: '#b8ff57',
                secondary: '#ff9a3c',
                text: {
                    primary: '#f0f0f0',
                    secondary: '#888888',
                },
                success: '#57ffa8',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                body: ['IBM Plex Mono', 'monospace'],
                label: ['Space Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
