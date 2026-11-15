# CFOAssociates Website

A modern, professional website for **CFOAssociates** - fractional CFO and virtual CFO services for founder-led companies.

Based on the design of [KayOne Consulting](https://kayoneconsulting.com/), adapted with a **blue accent color** (#1E40AF) for trust and professionalism in financial services.

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--blue` | `#1E40AF` | Primary brand color, CTAs, links |
| `--blue-dark` | `#1E3A8A` | Hover states |
| `--blue-light` | `#3B82F6` | Subtle accents |
| `--blue-pale` | `#DBEAFE` | Backgrounds, badges |
| `--black` | `#0E0E0E` | Headings on light bg |
| `--dark` | `#1A1A1A` | Body text |
| `--mid` | `#333333` | Secondary text |
| `--gray` | `#777777` | Muted text |
| `--border` | `#EBEBEB` | Dividers, borders |
| `--white` | `#FFFFFF` | Backgrounds, text on dark |

### Typography
- **Font**: Source Sans 3 (variable, weights 300-900)
- **Fallback**: Metric-compatible Arial/Helvetica stack
- **Scale**: Fluid, responsive with clamp()

### Spacing
- Base unit: 4px
- Scale: xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96)

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 960px
- Desktop: > 960px

---

## 📁 Project Structure

```
CFOAssociates/
├── index.html              # Main homepage
├── css/
│   └── main.css           # All styles (single file, no build step)
├── js/
│   └── main.js            # All interactions (vanilla JS, no dependencies)
├── assets/
│   ├── fonts/             # Source Sans 3 WOFF2 files (see fonts/README.md)
│   └── images/
│       ├── hero.webp      # Hero background (1920x1080)
│       ├── og-image.jpg   # Social sharing (1200x630)
│       ├── avatars/       # Client/testimonial avatars
│       ├── logos/         # Client logo marquee
│       └── team/          # Team member photos
└── README.md              # This file
```

---

## 🚀 Quick Start

### 1. Add Font Files
Download Source Sans 3 variable fonts (WOFF2) and place in `assets/fonts/`. See `assets/fonts/README.md` for details.

### 2. Replace Placeholder Images
Replace all SVG placeholders in `assets/images/` with actual images:
- `hero.webp` - Dark, abstract finance-themed background
- `og-image.jpg` - Social sharing card (1200×630)
- `avatars/*.svg` - Client logos & testimonial photos
- `logos/*.svg` - Client logo marquee (8+ logos)
- `team/*.svg` - Founder & team photos (320×320)

### 3. Customize Content
Edit `index.html` and replace all `[bracketed placeholders]`:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `[Legal Company Name]` | Registered company name | "CFOAssociates Private Limited" |
| `[Your Custom Tagline Here]` | Hero tagline | "Your Finance Partner from Startup to Scale" |
| `[Year Founded]` | Founding year | "2024" |
| `[Phone Number]` | Contact phone | "+91 22 4000 1234" |
| `[Email Address]` | Contact email | "hello@cfoassociates.com" |
| `[Street Address]` | Office street | "123 Finance Tower, 5th Floor" |
| `[City]` | City | "Mumbai" |
| `[State/Province]` | State | "Maharashtra" |
| `[Postal Code]` | PIN/ZIP | "400001" |
| `[Country]` | Country | "India" |
| `[Country Code]` | ISO code | "IN" |
| `[Founder Name]` | Founder full name | "Rajesh Kumar" |
| `[Founder Website URL]` | Founder personal site | "https://rajeshkumar.com" |
| `[founder-handle]` | LinkedIn handle | "rajeshkumar-cfo" |
| `[Company Registration Number]` | CIN/registration | "U74999MH2024PTC123456" |
| `[Number]+` | Founders served | "150+" |
| `[Number]+ years` | Avg relationship | "3+" |
| `$[Number]M+` | Capital raised | "$50M+" |
| `[Number]+` | Engagements | "75+" |
| `[Client Name]` | Testimonial client | "Priya Sharma" |
| `[Title]` | Client title | "CEO" |
| `[Company Name]` | Client company | "TechScale Inc" |
| `[Specific outcome...]` | Results metrics | "Raised $8M Series A • 35% cash flow improvement" |
| `[Industry 1], [Industry 2]` | Target industries | "SaaS, FinTech" |
| `[Role]` | Team member role | "Principal" |
| `[Team Member Name]` | Team member name | "Anita Desai" |
| `[member-handle]` | LinkedIn handle | "anita-desai-cfo" |
| `[Year]` | Copyright year | "2025" |

### 4. Update Structured Data (JSON-LD)
The `index.html` includes comprehensive Schema.org markup. Update all values in the `<script type="application/ld+json">` block to match your actual business details.

### 5. Test Locally
```bash
# Using Python (built-in)
python3 -m http.server 8000

# Or Node.js
npx serve .

# Or VS Code Live Server extension
```

Open http://localhost:8000

---

## 🧩 Page Sections (in order)

1. **Cookie Consent** - GDPR-compliant banner with preferences
2. **Header** - Logo, navigation, CTA button (sticky, backdrop blur)
3. **Hero** - Dark background, gradient overlay, headline, dual CTAs, social proof
4. **Logos/Stats Bar** - Split dark/light with animated logo marquee
5. **Problem/Pain Points** - 4 pain points + solution callout
6. **Why CFOAssociates (Services)** - 6 service cards on dark background
7. **ICP (Ideal Customer Profile)** - 4-checklist qualification card
8. **Client Outcomes** - Testimonial carousel (4 cards, swipe/keyboard/touch)
9. **Team** - Founder + 2 team members (expandable)
10. **Final CTA** - Conversion section
11. **Footer** - Links, contact, social, legal

---

## ⚡ JavaScript Features

| Feature | Description |
|---------|-------------|
| Mobile Navigation | Hamburger menu, overlay, focus trap, ESC to close |
| Cookie Consent | Banner + preferences modal, localStorage, GDPR-ready |
| Testimonial Carousel | Auto-sizing, dots, arrows, keyboard, touch swipe |
| Logo Marquee | Pause on hover/focus, infinite loop |
| Smooth Scroll | Anchor links with header offset |
| Scroll Animations | IntersectionObserver fade-up (respects `prefers-reduced-motion`) |
| Active Nav Highlight | Section-based on scroll |
| Header Scroll Effect | Subtle shadow on scroll |
| Form Handling | AJAX submission with toast notifications |
| Lazy Load Images | Native `loading="lazy"` + fade-in |

All vanilla JS, **zero dependencies**, ~3KB gzipped.

---

## ♿ Accessibility

- ✅ Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`)
- ✅ ARIA labels, roles, live regions
- ✅ Focus visible outlines (blue)
- ✅ Keyboard navigation (tab order, ESC, arrows)
- ✅ Color contrast (WCAG AA on all text)
- ✅ Reduced motion support
- ✅ Alt text on all images
- ✅ Form labels and error handling
- ✅ Skip links (add if needed)

---

## 🔧 Customization Guide

### Changing the Accent Color
Update these CSS custom properties in `css/main.css`:

```css
:root {
  --blue:         #YOUR_COLOR;      /* Primary */
  --blue-dark:    #YOUR_DARKER;     /* Hover */
  --blue-light:   #YOUR_LIGHTER;    /* Subtle */
  --blue-pale:    #YOUR_PALEST;     /* Backgrounds */
}
```

**Recommended finance blues:**
- Professional: `#1E40AF` (current)
- Navy: `#1E3A8A`
- Bright: `#3B82F6`
- Teal: `#0D9488`

### Adding/Removing Services
Edit the `.why-c-grid` in `index.html` - each `.why-card` is a service. Update the JSON-LD `serviceType` array accordingly.

### Modifying ICP Criteria
Edit the `.icp-a-grid` items - 2 left column, 2 right column checkboxes.

### Adding Team Members
Duplicate `.team-card` in `.team-grid`. For founder card, keep `founder-card` class with `grid-column: span 3`.

---

## 📦 Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag & drop, auto HTTPS, forms, headers
- **Vercel**: Git integration, edge network
- **GitHub Pages**: Free, custom domain
- **Cloudflare Pages**: Fast, free tier generous
- **AWS S3 + CloudFront**: Enterprise

### Required Headers
```nginx
# Cache static assets
location ~* \.(css|js|woff2|webp|jpg|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
```

### Performance Checklist
- [ ] Fonts preloaded (already in HTML)
- [ ] Hero image preloaded (already in HTML)
- [ ] Images optimized (WebP, proper dimensions)
- [ ] CSS/JS minified (optional - files are small)
- [ ] Gzip/Brotli compression enabled
- [ ] HTTP/2 or HTTP/3

---

## 📋 SEO Checklist

- [ ] Update `<title>` and `<meta name="description">`
- [ ] Update Open Graph / Twitter Card tags
- [ ] Update JSON-LD structured data (all fields)
- [ ] Add real `hero.webp` and `og-image.jpg`
- [ ] Create `/sitemap.xml` (auto-generate)
- [ ] Create `/robots.txt`
- [ ] Submit to Google Search Console
- [ ] Set up Google Analytics / Plausible (respect cookie consent)

---

## 🔒 Privacy & Compliance

- Cookie consent banner (GDPR/CCPA ready)
- No third-party trackers by default
- Forms submit to your endpoint
- All assets self-hosted
- Privacy Policy, Terms, Cookie Policy pages needed (create `/privacy-policy/`, `/terms-of-service/`, `/cookie-policy/`)

---

## 📝 License & Credits

### Design Inspiration
- **KayOne Consulting** - Original design reference
- Adapted for CFOAssociates with permission for educational/reference use

### Fonts
- **Source Sans 3** - Adobe Fonts, SIL Open Font License 1.1

### Icons
- Inline SVGs (custom, no icon library)

### Code
- Original implementation for CFOAssociates
- MIT License - feel free to use for your own projects

---

## 🤝 Support

For questions about this implementation:
- Review the code comments in `css/main.css` and `js/main.js`
- Check browser DevTools for CSS custom property values
- All functionality is in single files - easy to debug

---

## 📋 TODO / Future Enhancements

- [ ] Services detail pages (`/services/`)
- [ ] Our Work case studies (`/our-work/`)
- [ ] About page (`/about/`)
- [ ] Team page (`/team/`)
- [ ] Insights/Blog (`/insights/`)
- [ ] Contact form backend
- [ ] Newsletter signup
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] CMS integration (Contentful, Sanity, etc.)

---

**Built with care for CFOAssociates** 💙