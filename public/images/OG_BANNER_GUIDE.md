# OG Banner Creation Guide

## Required Banners

Create the following OG banners for each language:

| File Name | Language | Title Text |
|-----------|----------|------------|
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

- **Dimensions**: 1200 x 630 pixels
- **Format**: WebP (optimized for web)
- **File size**: < 100KB recommended

## Design Guidelines

1. Use the same design template as existing banners (`og-banner.en.webp`, `og-banner.tr.webp`, `og-banner.de.webp`)
2. Change only the title text to the localized version
3. Keep all other design elements consistent

## Quick Creation Options

### Option 1: Canva
1. Upload existing banner as template
2. Edit text for each language
3. Export as WebP

### Option 2: Figma
1. Create a component with text variable
2. Generate variants for each language
3. Export all at once

### Option 3: Programmatic (Node.js with Sharp/Canvas)
```javascript
// Example using sharp + canvas
const sharp = require('sharp');
const { createCanvas } = require('canvas');

// Create text overlay on base image
```

## Temporary Solution

Until banners are created, the site will fall back to the English banner (`og-banner.en.webp`) for all languages. This is functional but not optimal for SEO in non-English markets.

## After Creation

1. Place all files in `/public/images/`
2. Update `metadata.json` for each language to reference the correct banner
3. Test with social media preview tools:
   - https://developers.facebook.com/tools/debug/
   - https://cards-dev.twitter.com/validator
   - https://www.linkedin.com/post-inspector/

