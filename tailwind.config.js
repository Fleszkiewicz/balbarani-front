/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
    content: ['./src/**/*.{js,ts,jsx,tsx, html}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: ['light', 'lofi'],
    },
}
