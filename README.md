# MetalCraft Industries Website

## Visual Assets Guide

This guide explains how to replace the visual assets (images and videos) in the website.

### Folder Structure

All visual assets are organized in the `assets` folder with the following structure:

\`\`\`
assets/
│
├── images/
│   ├── about/
│   ├── products/
│   ├── parallax/
│   ├── partners/
│   └── logo/
│
└── videos/
    └── hero/
\`\`\`

### How to Replace Images

1. **Logo**
   - Replace `assets/images/logo/metalcraft-logo.svg` with your own logo
   - The logo will automatically be displayed in both the header and footer
   - For the footer, the logo is automatically converted to white

2. **About Section Image**
   - Replace `assets/images/about/workshop.jpg` with your own image
   - Recommended size: 800x600px or similar aspect ratio
   - The image should represent your workshop or manufacturing facility

3. **Product Images**
   - Replace the following files in `assets/images/products/`:
     - `precision-components.jpg` (Product 1)
     - `custom-molds.jpg` (Product 2)
     - `lightweight-structures.jpg` (Product 3)
   - Recommended size: 800x600px
   - Use high-quality images that clearly show your products

4. **Parallax Background Images**
   - Replace the following files in `assets/images/parallax/`:
     - `parallax-1.jpg` (First parallax section)
     - `parallax-2.jpg` (Second parallax section)
   - Recommended size: 1920x1080px (wide format)
   - Use high-resolution images with good contrast for text visibility

5. **Partner Logos**
   - Replace the placeholder logos in `assets/images/partners/` with your partners' logos
   - Name them `partner-1.png`, `partner-2.png`, etc.
   - Recommended size: 150x60px
   - Use transparent PNG files if possible

### How to Replace the Hero Video

1. Create or select a video that represents your company
2. Name it `hero-background.mp4` and place it in `assets/videos/hero/`
3. Recommended specifications:
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080px
   - Duration: 30-60 seconds (will loop automatically)
   - File size: Keep under 10MB if possible for faster loading

### Image Optimization Tips

- Compress all images to reduce file size without losing quality
- Use tools like TinyPNG, ImageOptim, or Squoosh
- Consider using WebP format with fallbacks for better performance
- Ensure all images have appropriate alt text for accessibility
