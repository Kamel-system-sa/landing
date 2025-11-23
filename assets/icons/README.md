# Icons Folder

Place custom icon files here if needed.

## Current Setup

The landing page currently uses:
- **Inline SVG icons** for features, navigation, and buttons
- **Heroicons** style inline SVG elements

No external icon files are required for basic functionality.

## If You Want to Add Custom Icons

1. Export icons as SVG files
2. Place them in this folder
3. Update the `<svg>` tags in `index.html` to reference your files:

```html
<!-- Current (inline): -->
<svg class="w-8 h-8" fill="none" stroke="currentColor">...</svg>

<!-- With external file: -->
<img src="assets/icons/your-icon.svg" class="w-8 h-8" alt="Icon">
```

## Recommended Icon Libraries

If you want more icons:
- [Heroicons](https://heroicons.com/) - Free, MIT license
- [Feather Icons](https://feathericons.com/) - Free, MIT license  
- [Font Awesome](https://fontawesome.com/) - Free tier available
- [Material Icons](https://fonts.google.com/icons) - Free, Apache 2.0

## Icon Guidelines

- Keep SVGs simple and clean
- Use consistent stroke width (2px recommended)
- Maintain 24x24 or 64x64 viewBox
- Use currentColor for fill/stroke to inherit text color

