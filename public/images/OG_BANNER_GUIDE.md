# OG Banner Creation Guide

## 🚀 Quick Start

**Preview Page:** http://localhost:3000/og-preview

Use this page to easily create OG banners for all languages.

---

## Required Banners

Create the following OG banners for each language:

| File Name | Language | Title Text |
|-----------|----------|------------|
| `og-banner.en.webp` | English | Recep Şen - Software Engineer |
| `og-banner.tr.webp` | Turkish | Recep Şen - Yazılım Mühendisi |
| `og-banner.de.webp` | German | Recep Şen - Softwareentwickler |
| `og-banner.fr.webp` | French | Recep Şen - Ingénieur Logiciel |
| `og-banner.es.webp` | Spanish | Recep Şen - Ingeniero de Software |
| `og-banner.nl.webp` | Dutch | Recep Şen - Software Engineer |
| `og-banner.pt.webp` | Portuguese | Recep Şen - Engenheiro de Software |
| `og-banner.it.webp` | Italian | Recep Şen - Ingegnere del Software |
| `og-banner.pl.webp` | Polish | Recep Şen - Inżynier Oprogramowania |
| `og-banner.ja.webp` | Japanese | Recep Şen - ソフトウェアエンジニア |
| `og-banner.ko.webp` | Korean | Recep Şen - 소프트웨어 엔지니어 |
| `og-banner.zh.webp` | Chinese | Recep Şen - 软件工程师 |

## Specifications

- **Dimensions**: 1200 × 630 pixels
- **Format**: WebP
- **Quality**: 85-90
- **Target size**: < 100KB

---

## 📸 Creation Steps

### Step 1: Take Screenshot (PNG)

1. Go to http://localhost:3000/og-preview
2. Select language from the dropdown
3. Uncheck "Show guide lines" checkbox
4. Open browser DevTools (F12)
5. Select element: `#og-banner`
6. Take screenshot using one of these methods:
   - Right-click → **"Screenshot Node"** (Firefox) or **"Capture node screenshot"** (Chrome)
   - Or use keyboard shortcuts (see below)
7. Save as PNG: `og-banner.{lang}.png`

#### Keyboard Shortcuts

| Shortcut | Browser/OS | Action |
|----------|------------|--------|
| `Ctrl+Shift+S` | Zen Browser, Firefox | Region select screenshot |
| `Ctrl+Shift+P` | Chrome DevTools | Command palette → "screenshot" |
| `Cmd+Shift+4` | macOS | Region select screenshot |
| `Win+Shift+S` | Windows 11 | Snipping Tool |

> 💡 **Tip:** After selecting the element in DevTools, some browsers allow you to use `Ctrl+Shift+S` to directly capture the selected region.

### Step 2: Convert to WebP

1. Open https://squoosh.app
2. Drag and drop the PNG file
3. Select output format: **WebP** on the right side
4. Set quality: **85-90**
5. Verify file size is <100KB
6. Download and rename to: `og-banner.{lang}.webp`

### Step 3: Add to Project

1. Copy the file to `/public/images/` folder
2. Return to Step 1 for the next language

---

## 💡 Tips

### Why PNG → WebP?

- PNG provides **lossless** quality (original)
- You can control **quality/size** balance when converting to WebP
- Keep PNG files as backups for future edits

### Batch Conversion (Optional)

To convert all PNGs at once:

```bash
# Using ImageMagick
for file in og-banner.*.png; do
  magick "$file" -quality 85 "${file%.png}.webp"
done

# Using Sharp CLI
npx sharp-cli -i "og-banner.*.png" -o . -f webp -q 85
```

---

## ✅ Checklist

- [ ] og-banner.en.webp
- [ ] og-banner.tr.webp
- [ ] og-banner.de.webp
- [ ] og-banner.fr.webp
- [ ] og-banner.es.webp
- [ ] og-banner.nl.webp
- [ ] og-banner.pt.webp
- [ ] og-banner.it.webp
- [ ] og-banner.pl.webp
- [ ] og-banner.ja.webp
- [ ] og-banner.ko.webp
- [ ] og-banner.zh.webp

---

## After Creation

Test with social media preview tools:
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator
- https://www.linkedin.com/post-inspector/
