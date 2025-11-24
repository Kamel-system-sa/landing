/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'brand-teal': '#006B6D',
        'brand-teal-light': '#008B8D',
        'brand-teal-dark': '#004B4D',
        'brand-gold': '#D4AF37',
        'brand-gold-light': '#E4BF47',
        'brand-gold-dark': '#B49527',
        // Supporting Colors
        'brand-sand': '#E8D5B5',
        'brand-navy': '#1A2332',
        'brand-sage': '#8B9D83',
        'brand-green': '#2E7D32',
        // Neutrals
        'brand-charcoal': '#2D3748',
        'brand-slate': '#475569',
        'brand-silver': '#F1F5F9',
        'brand-pearl': '#FAFAFA',
      },
      fontFamily: {
        'en-heading': ['Plus Jakarta Sans', 'sans-serif'],
        'en-body': ['Epilogue', 'sans-serif'],
        'ar-heading': ['Almarai', 'sans-serif'],
        'ar-body': ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-mobile': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

