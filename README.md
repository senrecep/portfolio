# Personal Portfolio Website

A modern, internationalized personal portfolio website built with Next.js 15.5, React 19, and TailwindCSS. Features a clean, responsive design with support for multiple languages, dark/light themes, and comprehensive SEO optimizations.

## Features

### Core
- Next.js 15.5 with App Router and Turbopack
- React 19 with Server Components
- TypeScript for type safety
- TailwindCSS with shadcn/ui components

### Internationalization
- Multi-language support (12 languages)
  - 🇬🇧 English, 🇹🇷 Turkish, 🇩🇪 German
  - 🇫🇷 French, 🇪🇸 Spanish, 🇳🇱 Dutch, 🇵🇹 Portuguese, 🇮🇹 Italian, 🇵🇱 Polish
  - 🇯🇵 Japanese, 🇰🇷 Korean, 🇨🇳 Chinese (Simplified)
- Automatic language detection from browser
- hreflang tags for SEO
- Localized metadata and content

### SEO & Performance
- JSON-LD structured data (Person + WebSite schema)
- Automatic sitemap generation with alternates
- Canonical URLs and hreflang tags
- Image optimization (AVIF/WebP)
- LCP optimization with preloading
- Static page generation (SSG)
- GZIP compression

### Analytics & Tracking
- Google Analytics 4 integration
- Google Tag Manager integration
- Microsoft Clarity user behavior analytics

### Developer Experience
- Biome for fast linting and formatting
- ESLint with Next.js config
- Docker support with standalone output
- Pino logger for structured logging

### Security
- Security headers (HSTS, X-Frame-Options, etc.)
- Input validation and sanitization
- Rate limiting support

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15.5.7 |
| UI Library | React 19.2.1 |
| Styling | TailwindCSS 3.4 |
| Components | shadcn/ui, Radix UI |
| Icons | Lucide React, Lordicon |
| Linting | Biome 2.3, ESLint 9 |
| Language | TypeScript 5 |

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/senrecep/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXXX"
NEXT_PUBLIC_CLARITY_PROJECT_ID="XXXXXXXXXX"
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your site.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run Next.js ESLint |
| `npm run lint:biome` | Run Biome linter |
| `npm run format` | Format code with Biome |
| `npm run check` | Run Biome check (lint + format) |
| `npm run check:fix` | Auto-fix Biome issues |

## Project Structure

```
portfolio/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Language-specific routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── layout/            # Layout components (Header, Footer)
│   ├── sections/          # Page sections (Blog, Projects, Skills)
│   ├── shared/            # Shared components (JsonLd, OptimizedImage)
│   └── ui/                # UI primitives (Button, Card, etc.)
├── content/               # Multilingual content (12 languages)
│   ├── en/               # English
│   ├── tr/               # Turkish
│   ├── de/               # German
│   ├── fr/               # French
│   ├── es/               # Spanish
│   ├── nl/               # Dutch
│   ├── pt/               # Portuguese
│   ├── it/               # Italian
│   ├── pl/               # Polish
│   ├── ja/               # Japanese
│   ├── ko/               # Korean
│   └── zh/               # Chinese (Simplified)
├── lib/
│   ├── i18n/             # Internationalization utilities
│   ├── logger/           # Pino logger configuration
│   └── utils.ts          # Utility functions
├── public/
│   ├── files/            # Downloadable files (CV)
│   └── images/           # Static images
├── biome.json            # Biome configuration
├── next.config.js        # Next.js configuration
└── tailwind.config.ts    # Tailwind configuration
```

## Configuration

### Adding a New Language

1. Create a new directory in `content/` with the language code:

```bash
mkdir content/fr
```

2. Copy and translate the JSON files:

```bash
cp content/en/*.json content/fr/
```

3. Update `lib/i18n/config.ts`:

```typescript
export const languages: Language[] = [
  // ... existing languages
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    locale: "fr-FR",
    direction: "ltr",
  },
];
```

4. Add translations in `lib/i18n/translations.ts`

### Content Management

Content is managed through JSON files:

- `content/{lang}/profile.json` - Personal info, skills, projects, blog posts
- `content/{lang}/metadata.json` - SEO metadata, OpenGraph, Twitter Card

### Analytics Setup

#### Google Analytics 4

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com/)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.local`: `NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"`

#### Google Tag Manager

1. Create a container at [tagmanager.google.com](https://tagmanager.google.com/)
2. Get your Container ID (GTM-XXXXXXXX)
3. Add to `.env.local`: `NEXT_PUBLIC_GTM_ID="GTM-XXXXXXXX"`

#### Microsoft Clarity

1. Create a project at [clarity.microsoft.com](https://clarity.microsoft.com/)
2. Get your Project ID
3. Add to `.env.local`: `NEXT_PUBLIC_CLARITY_PROJECT_ID="XXXXXXXXXX"`

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

### Vercel

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/senrecep/portfolio)

### Manual Deployment

```bash
npm run build
npm run start
```

## Performance

### Build Output

```
Route (app)                    Size     First Load JS
┌ ○ /_not-found               1.01 kB        123 kB
├ ● /[lang]                    160 kB        282 kB
│   ├ /en, /tr, /de
│   └ [+9 more paths]         (fr, es, nl, pt, it, pl, ja, ko, zh)
├ ƒ /api/download              143 B         123 kB
├ ○ /robots.txt                143 B         123 kB
└ ○ /sitemap.xml               143 B         123 kB
+ First Load JS shared         122 kB
```

### Optimizations

- **Static Generation**: All language pages pre-rendered at build time
- **Image Optimization**: Automatic AVIF/WebP conversion
- **Font Optimization**: Google Fonts with `display: swap`
- **Code Splitting**: Automatic per-route code splitting
- **Compression**: GZIP enabled by default

## SEO Features

- **Structured Data**: JSON-LD Person and WebSite schemas
- **hreflang**: Automatic language alternates
- **Sitemap**: Dynamic sitemap with language alternates
- **Meta Tags**: OpenGraph, Twitter Card
- **Canonical URLs**: Automatic canonical URL generation

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Biome](https://biomejs.dev/)
- [Radix UI](https://www.radix-ui.com/)
