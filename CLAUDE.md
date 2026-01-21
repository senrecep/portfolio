# Portfolio - senrecep.dev

## WHAT - Project Overview

**Next.js 15 portfolio** with internationalization support for 12 languages.

### Tech Stack
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript 5, React 19
- **Styling**: Tailwind CSS 3.4, Shadcn UI
- **i18n**: next-intl (12 languages: en, tr, de, es, fr, it, ja, ko, nl, pl, pt, zh)
- **Linting**: Biome (format + lint)

### Structure
```
app/
├── [lang]/           → Internationalized routes
│   ├── page.tsx      → Home page
│   └── resume/       → Resume/CV page
├── api/              → API routes (OG images, PDF download)
└── sitemap.ts        → Dynamic sitemap

components/
├── ui/               → Shadcn UI components
├── sections/         → Page sections (Skills, Projects, Blog, etc.)
├── layout/           → Header, Footer
└── shared/           → Reusable utilities (ThemeToggle, LordIcon, etc.)

content/
└── {lang}/           → JSON content files per language

lib/
├── i18n/             → Content loaders
├── utils.ts          → Utility functions (cn, etc.)
└── validation.ts     → Input validation
```

## WHY - Architecture Decisions

- **App Router**: Server Components for better SEO and performance
- **next-intl**: Chosen over next-i18next for better App Router support
- **Biome**: Single tool for both linting and formatting (faster than ESLint + Prettier)
- **Shadcn UI**: Copy-paste components, no black-box dependencies

## HOW - Code Conventions (with WHY)

### TypeScript
- Explicit types (avoid `var`) — *implicit inference caused type bugs*
- No `any` type — *production bugs from untyped data*
- Interface over type for objects — *better extensibility and error messages*

### React
- Server Components by default — *better performance, smaller bundles*
- `"use client"` only when needed — *minimize client JavaScript*
- Avoid `useEffect` for data fetching — *use Server Components instead*

### Styling
- Use `cn()` utility for conditional classes — *consistent class merging*
- Tailwind tokens over hardcoded values — *theme consistency*
- Mobile-first responsive design — *most portfolio visitors are mobile*

### i18n
- Content in `content/{lang}/*.json` — *separation of concerns*
- Type-safe translations — *catch missing keys at build time*
- Fallback to English for missing keys — *graceful degradation*

## NOT TO DO (Claude Tendencies)

- **Don't create new files** if task can be done in existing file
- **Don't add error handling** for impossible scenarios
- **Don't over-engineer** — no extra abstractions beyond request
- **Don't add comments** to unchanged code
- **Don't use console.log** — use proper logging if needed

## Testing

| Type | Command | Notes |
|------|---------|-------|
| Build verification | `npm run build` | Must pass before commit |
| Type checking | TypeScript compiler via build | Zero errors required |
| Lint + Format | `npm run check:fix` | Biome handles both |

**No test framework currently** — if adding tests, prefer Vitest for consistency with modern tooling.

## Git Workflow

- **Branch naming**: `[type]/[description]` (e.g., `feat/add-contact-form`, `fix/mobile-nav`)
- **Commit format**: Semantic commits (`feat:`, `fix:`, `docs:`, `refactor:`, `style:`)
- **PR process**: Use `/git-pr` command, include Co-Authored-By for Claude
- **Main branch**: Always deployable, auto-deploys to Vercel

## Boundaries

- ✅ **Always do**: Run `npm run check:fix` before commit, follow existing patterns
- ⚠️ **Ask first**: Adding new dependencies, modifying i18n config, changing routing structure
- 🚫 **Never do**: Commit secrets, edit `node_modules/`, remove existing translations

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | Next.js linter |
| `npm run check:fix` | Biome lint + format |
| `npm run lang:add` | Add new language |

## Custom Commands

| Command | Description |
|---------|-------------|
| `/git-pr` | Commit, push, and create PR |
| `/lighthouse` | Run Lighthouse audit |

## Reference Documentation

| Topic | File |
|-------|------|
| External Memory | `SCRATCHPAD.md` |
| Translation Glossary | `content/TRANSLATION_GLOSSARY.md` |
