/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#F7F6F4',
        card: '#FCFBF9',
        secondary: '#7A7872',
        'secondary-border': '#E2E0DC',
        accent: '#2C2A26',
        primary: '#2C2A26',
        'dark-primary': '#161513'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        relaxed: '0.05em',
        calm: '0.08em'
      }
    }
  },
  plugins: []
};
