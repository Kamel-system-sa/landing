# Kamel - Hajj Operations Management Platform

Complete SaaS platform for Hajj operations management, supporting service providers and operators with modern digital solutions.

## 🚀 Quick Start

### Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Tailwind CSS**
   ```bash
   npm run build:css
   ```

3. **Development Mode (with watch)**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Open `index.html` in your browser
   - Or use a local server like Live Server (VS Code extension)

### Production Build

For production, ensure you:
1. Run `npm run build:css` to generate minified CSS
2. Update `index.html` to use the compiled CSS instead of CDN
3. Configure the form API key in `js/main.js`
4. Add real product screenshots to replace placeholders

## 📁 File Structure

```
kamel-landing/
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   └── favicon.svg
│   └── icons/
├── css/
│   ├── custom.css           # Custom styles and animations
│   ├── tailwind.input.css   # Tailwind input file
│   └── tailwind.min.css     # Generated (gitignored)
├── js/
│   ├── main.js              # Main functionality
│   ├── content.js           # Bilingual content
│   └── exit-intent.js       # Exit intent popup
├── index.html               # Main landing page
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Form Submissions

To enable contact form submissions:

1. Get a free API key from [Web3Forms](https://web3forms.com/)
2. Open `js/main.js`
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key
4. Test the form

### Replace Placeholder Assets

Add your real assets in these locations:

- **Product Screenshots**: `assets/images/solution1-dashboard.jpg`, `solution2-gps.jpg`, `solution3-compliance.jpg`
- **OG Image**: `assets/images/og-image.jpg` (1200x630px)
- **Favicon**: Already provided as SVG, optionally add PNG versions
- **Customer Logos**: `assets/images/partners/` directory

## 🌐 Bilingual Support

The site supports English and Arabic with RTL layout:

- Content is managed in `js/content.js`
- Language preference is saved in localStorage
- All UI elements support both languages

## ♿ Accessibility Features

- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Skip-to-content link
- Proper ARIA labels
- Touch target sizes (44x44px minimum)

## 🎨 Design System

### Colors

- **Brand Teal**: `#006B6D` - Primary brand color
- **Brand Gold**: `#D4AF37` - Accent color
- **Brand Navy**: `#1A2332` - Dark backgrounds
- **Brand Charcoal**: `#2D3748` - Text color

### Typography

- **English Headings**: Plus Jakarta Sans
- **English Body**: Epilogue
- **Arabic Headings**: Almarai
- **Arabic Body**: IBM Plex Sans Arabic

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- No sensitive data in frontend code
- Form submissions use secure API
- XSS protection through proper escaping
- CSP headers recommended for production

## 📈 Performance Optimizations

- Minified CSS
- Lazy loading for images
- Optimized animations
- Reduced motion support
- Touch device optimizations

## 🚢 Deployment

### Using CDN (Current - Development)

The current setup uses Tailwind CDN for quick development. For production:

1. Run `npm run build:css`
2. Update `index.html` to replace CDN script with:
   ```html
   <link rel="stylesheet" href="css/tailwind.min.css">
   <link rel="stylesheet" href="css/custom.css">
   ```
3. Remove the Tailwind CDN script tag

### Recommended Hosting

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Traditional**: Any web server with HTTPS
- **CDN**: Cloudflare Pages, AWS S3 + CloudFront

## 📝 License

© 2024 Kamel. All rights reserved.

## 🤝 Support

For support and inquiries:
- Email: contact@kamel.sa
- Website: https://kamel.sa

---

Made with ❤️ in Saudi Arabia

