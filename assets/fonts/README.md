# Font Files Required

This project uses **Source Sans 3** (same as KayOne Consulting) as the primary typeface.

## Required Font Files (WOFF2 format)

Place the following files in this directory (`assets/fonts/`):

### Latin Subset (Primary)
- `source-sans-3.latin.normal.woff2` - Variable font (weights 300-900, normal)
- `source-sans-3.latin.italic.woff2` - Variable font (weights 300-800, italic)

### Latin Extended Subset (For international characters)
- `source-sans-3.latin-ext.normal.woff2` - Variable font (weights 300-900, normal)
- `source-sans-3.latin-ext.italic.woff2` - Variable font (weights 300-800, italic)

## Download Sources

### Option 1: Google Fonts (Recommended)
1. Go to: https://fonts.google.com/specimen/Source+Sans+3
2. Click "Download family" → Get the variable font files
3. Convert to WOFF2 if needed using: https://cloudconvert.com/ttf-to-woff2 or `woff2_compress`

### Option 2: GitHub (Source)
- Repository: https://github.com/adobe-fonts/source-sans-3
- Releases: https://github.com/adobe-fonts/source-sans-3/releases

### Option 3: Google Fonts API (For reference)
```css
/* Latin */
@font-face {
  font-family: 'Source Sans 3';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/sourcesans3/v20/55hZ-aAhrD1R6TkVOeL6jOVI.woff2') format('woff2');
}

/* Latin Extended */
@font-face {
  font-family: 'Source Sans 3';
  font-style: normal;
  font-weight: 300 900;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/sourcesans3/v20/55hX-aAhrD1R6TkVOeL6jOVI.woff2') format('woff2');
}
```

## Font Weights Used in This Project
- **300** - Light (rarely used)
- **400** - Regular (body text)
- **500** - Medium (micro copy)
- **600** - Semi-bold (sub-headings, labels)
- **700** - Bold (buttons, emphasis)
- **800** - Extra bold (card titles)
- **900** - Black (main headings)

## Fallback Font Stack
The CSS includes a metric-compatible fallback:
```css
font-family: 'Source Sans 3', 'Source Sans 3 Fallback', sans-serif;
```

The fallback uses Arial/Helvetica/Liberation Sans with `size-adjust`, `ascent-override`, `descent-override` to match Source Sans 3 metrics.

## Self-Hosting Benefits
- ✅ No external requests (faster, privacy-friendly)
- ✅ Full control over font loading
- ✅ Works offline
- ✅ No Google Fonts GDPR concerns

## File Size Estimates (WOFF2 Variable)
- Latin normal: ~45 KB
- Latin italic: ~45 KB
- Latin-ext normal: ~55 KB
- Latin-ext italic: ~55 KB
- **Total: ~200 KB** (for all weights/styles)