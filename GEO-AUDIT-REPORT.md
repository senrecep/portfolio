# GEO Audit Report: senrecep.com

**Audit Date:** 2026-03-22
**URL:** https://senrecep.com
**Business Type:** Personal Portfolio - Software Engineer / CTO
**Pages Analyzed:** 43 (3 unique page types x 13 languages: home, resume, privacy)

---

## Executive Summary

**Overall GEO Score: 60/100 (Fair)**

senrecep.com has an exceptional technical foundation for AI discoverability - all 21 AI crawlers are explicitly allowed, a well-structured `llms.txt` is present, Next.js 15 Server Components ensure crawlable SSR output, and 9 schema types are implemented including `FAQPage` and `speakable`. However, the site's content surface is critically thin: all 7 technical blog posts and the sole academic publication live on external domains (Medium, ResearchGate), meaning the portfolio domain accumulates no topical authority from its most citable content. Combined with a modest brand footprint (41 GitHub followers, 27 Medium followers, near-zero Stack Overflow presence), the site reads as a well-optimized business card rather than an authoritative source AI systems would cite or recommend.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 58/100 | 25% | 14.50 |
| Brand Authority | 40/100 | 20% | 8.00 |
| Content E-E-A-T | 60/100 | 20% | 12.00 |
| Technical GEO | 91/100 | 15% | 13.65 |
| Schema & Structured Data | 74/100 | 10% | 7.40 |
| Platform Optimization | 42/100 | 10% | 4.20 |
| **Overall GEO Score** | | | **59.75 / 100** |

---

## Critical Issues (Fix Immediately)

No critical-severity issues found. The site avoids the most common GEO-blocking mistakes: AI crawlers are not blocked, content is not gated behind login, and SSR ensures all content is visible to crawlers without JavaScript execution.

---

## High Priority Issues

### H1 - All Blog Content Hosted Off-Domain
**Affected:** Entire content strategy
**Category:** AI Citability, Content E-E-A-T

All 7 blog posts and the academic publication are hosted externally (Medium x6, ResearchGate x1). When AI systems search for "Recep Sen microservices" or "Recep Sen Claude Code", they find medium.com as the authoritative source - not senrecep.com. Every blog post is a lost citation opportunity where a third-party platform captures domain authority. The portfolio domain currently cannot answer any specific technical question beyond the 5 FAQs on the homepage.

**Fix:** Create `/blog` section using MDX or markdown. Either migrate existing posts (using Medium as syndication target with canonical pointing to senrecep.com) or create on-site summaries (300-400 words) with a "Read on Medium" link. Even partial content on-domain begins shifting citability.

---

### H2 - Content-Security-Policy Header Missing
**Affected:** middleware.ts
**Category:** Technical GEO

No CSP header is present. This is noted as "pending" in project memory. Without CSP, the site cannot signal to AI crawlers and security evaluators that its content environment is controlled.

**Fix:** Add to `middleware.ts`:
```typescript
response.headers.set(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com;"
);
```

---

### H3 - Zero Developer Community Engagement
**Affected:** Stack Overflow (reputation: 31, 0 answers), Reddit (absent), Dev.to (absent)
**Category:** Brand Authority, Platform Optimization

Stack Overflow, Reddit (r/dotnet, r/csharp, r/csharpe), and Dev.to are the highest-trust developer credibility signals indexed by AI models. Stack Overflow profile exists but has near-zero activity. Dev.to and Hashnode have no presence.

**Fix:** Target 10-20 Stack Overflow answers in .NET/C#/microservices topics where the NuGet packages (CSharpEssentials, Aspire template) solve real problems. This directly builds entity authority in AI training data.

---

### H4 - Twitter/X Handle Inconsistency (@senrecep0)
**Affected:** All social schema, `sameAs` links
**Category:** Brand Authority

The primary branded handle (@senrecep) is held by another account. The current handle (@senrecep0) breaks brand recall and weakens entity disambiguation for AI systems that cross-reference social profiles. All other platforms use `senrecep` consistently.

**Fix:** Either attempt to claim @senrecep through Twitter's handle recovery process, or standardize all documentation/schema to explicitly note the @senrecep0 handle as the canonical identity. Update `sameAs` in the Person schema to use the exact Twitter URL.

---

## Medium Priority Issues

### M1 - `Person.image` Uses Relative URL
**Affected:** `JsonLd.tsx` - Person schema
**Category:** Schema & Structured Data

`image: "/images/profile.webp"` is a relative path. Schema.org requires fully qualified URLs. AI crawlers and Google's structured data parser may fail to resolve the image, weakening the Person entity card.

**Fix:** One-line change in `JsonLd.tsx` - prepend `siteUrl` to the image path.

---

### M2 - `llms-full.txt` Missing (404)
**Affected:** `app/llms-full.txt/route.ts` (does not exist)
**Category:** Technical GEO

`llms.txt` exists and is well-structured. `llms-full.txt` (the extended version for deep AI context) returns 404. This file should contain full resume, complete skills inventory, project architectural descriptions, and work history - enabling AI models to build rich contextual understanding.

**Fix:** Create `app/llms-full.txt/route.ts` with complete professional content. Add a link from `llms.txt` pointing to it.

---

### M3 - Permissions-Policy Header Missing
**Affected:** `middleware.ts`
**Category:** Technical GEO

No browser feature restrictions are defined. Minor security/privacy signal gap.

**Fix:**
```typescript
response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
```

---

### M4 - No Standalone Organization Schema for Taptoweb
**Affected:** `JsonLd.tsx`
**Category:** Schema & Structured Data

Taptoweb is only expressed as a nested `worksFor` object on the Person schema. A top-level `Organization` schema with its own `@id`, `logo`, and `sameAs` would create an independent entity node in AI knowledge graphs, enabling both Recep Sen and Taptoweb to be resolved as distinct entities.

---

### M5 - NuGet Success Underpromoted (59,809 Downloads)
**Affected:** GitHub READMEs, portfolio projects section
**Category:** Brand Authority, Platform Optimization

16 published NuGet packages have accumulated ~60k total downloads - a meaningful developer traction signal. None of the backing GitHub repositories have proper README descriptions, topics/tags, or homepage links pointing to the NuGet package pages. This is the highest-signal existing asset that is being left underperforming.

**Fix:** Add README files, GitHub topics (`csharp`, `dotnet`, `result-pattern`, `functional-programming`), and NuGet badge links to CSharpEssentials and SenRecep.Aspire repos. Surface the download count prominently on the portfolio's projects section.

---

### M6 - FAQ Answer Depth Insufficient for Standalone Citation
**Affected:** Homepage `FAQPage` schema
**Category:** AI Citability

FAQPage schema is present with 5 questions - excellent. However, FAQ answers that are 1-2 sentences are not detailed enough to be cited verbatim for complex queries. Each answer should be 3-5 sentences with the technology, context of use, and a concrete outcome.

---

### M7 - No Testimonials or Third-Party Validation
**Affected:** Homepage, resume page
**Category:** Content E-E-A-T

No testimonials, colleague recommendations, or client quotes appear on the site. Third-party validation is the fastest Authoritativeness improvement - the data likely exists on LinkedIn (recommendations) and could be surfaced with permission.

---

## Low Priority Issues

### L1 - WebSite Schema Missing SearchAction
No `potentialAction` with `SearchAction` on the WebSite schema. Prevents sitelinks search box eligibility (low impact for a portfolio).

### L2 - SoftwareApplication Schema Missing `downloadUrl` and `aggregateRating`
The Easyapp SoftwareApplication schema is rich result eligible but lacks App Store URL, Play Store URL, and rating data. These properties enable the app installation panel in search results.

### L3 - BreadcrumbList Only on Resume/Privacy Pages
Homepage lacks BreadcrumbList. Lower priority since homepage is the root and has no parent in the breadcrumb hierarchy.

### L4 - Privacy Page Is Thin (220-250 words)
At 220-250 words covering 3 analytics tools, the privacy page is minimal. A more detailed privacy policy with specific data retention periods, GDPR rights, and cookie categories signals higher trustworthiness.

### L5 - Root `<html lang>` Static Workaround
Root layout starts with `lang="en"` and uses an inline script to correct it. Known Next.js 15 App Router limitation. `Content-Language` HTTP header partially compensates. Consider adding `<link rel="alternate" hreflang>` tags in `<head>` as additional signal.

---

## Category Deep Dives

### AI Citability (58/100)

**Strengths:**
- FAQPage schema with 5 entity-rich Q&As is a direct AI citation signal
- `llms.txt` provides a machine-readable professional summary
- `speakable` property implemented with correct CSS selector targeting
- Quantified claims are self-contained: "250,000+ users", "28-service microservices platform", "CTO at Taptoweb"

**Weaknesses:**
- All 7 technical blog posts hosted on Medium - domain receives zero citability credit
- Only 3 page types (home, resume, privacy) = extremely thin citable surface
- FAQ answer texts likely 1-2 sentences; insufficient for verbatim citation
- Resume page is a download-oriented page, not a narrative one

**Opportunity:** Blog migration to on-domain MDX would increase citability score to estimated 72-78/100.

---

### Brand Authority (40/100)

**Strengths:**
- LinkedIn: 1,399 connections, 1,392 followers - strong professional network
- NuGet: 59,809 package downloads across 16 packages - highest-signal asset
- GitHub: 16-star library (CSharpEssentials), 50 repositories, active contributions
- Academic publication on ResearchGate (blockchain e-voting, 2022)

**Weaknesses:**
- Not mentioned by name in any Easyapp press coverage (3 Turkish tech articles cover the product but name other founders)
- No Wikipedia or Wikidata entry - weakest gap for AI entity disambiguation
- Stack Overflow reputation: 31 (negligible developer community footprint)
- No conference speaker profile, talks, or recorded presentations
- Medium: only 27 followers despite 7 published articles

---

### Content E-E-A-T (60/100)

**Experience (14/25):** CTO role and 250K user platform claim are strong specificity signals, but no case studies, architectural post-mortems, or "how we built it" narratives exist on-domain.

**Expertise (16/25):** 5 certificates with schema markup from credible sources (Milan Jovanovic Tech is a respected .NET educator), technical skills matrix, academic publication. Weakened by blog content living off-domain.

**Authoritativeness (13/25):** GitHub projects with verifiable artifacts, ResearchGate publication, multi-platform social presence. No press mentions by name, no testimonials, no organizational endorsements.

**Trustworthiness (15/25):** Contact info (email + phone + WhatsApp), privacy policy with analytics disclosure (GA, GTM, Clarity), HTTPS, clear ownership. No dedicated About page.

---

### Technical GEO (91/100)

**Excellent foundations:**
- 21 AI crawlers explicitly allowed in robots.txt (GPTBot, anthropic-ai, Claude-Web, PerplexityBot, CCBot, cohere-ai, OAI-SearchBot, and 14 others)
- `llms.txt` present and well-structured
- Next.js 15 Server Components = full SSR, AI crawlers see complete content without JS execution
- Sitemap: 43 URLs, hreflang across 13 languages, x-default=en, lastmod current (2026-03-21)
- All OG/Twitter Card tags present
- HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy present
- PWA manifest, responsive images via next/image

**Only gaps:** CSP header missing (High), Permissions-Policy missing (Medium), llms-full.txt missing (Medium).

---

### Schema & Structured Data (74/100)

**9 schema types implemented:**

| Type | Status | Notes |
|---|---|---|
| Person | Good | Missing: absolute image URL, Wikipedia in sameAs |
| FAQPage | Excellent | 5 questions, entity-rich content, ideal for AI parsing |
| ProfilePage | Good | dateModified current, mainEntity linked |
| WebSite | Partial | Missing SearchAction |
| SoftwareApplication | Good | Missing downloadUrl, aggregateRating |
| BlogPosting ItemList | Good | 7 posts structured |
| EducationalOccupationalCredential | Excellent | 5 certs with schema |
| BreadcrumbList | Partial | Resume/privacy only, not homepage |
| DigitalDocument | Good | Resume PDF properly typed |

**Delivery:** JSON-LD exclusively, server-rendered (no JS execution required) - correct implementation.

**Unique strength:** `speakable` property with `SpeakableSpecification` and CSS selectors is an advanced GEO signal that most portfolio sites miss entirely.

---

### Platform Optimization (42/100)

| Platform | Status | Quality |
|---|---|---|
| Personal site (senrecep.com) | Active | Strong - SSR, multilingual, schema-rich |
| LinkedIn | Active | Strong - 1,399 connections |
| GitHub | Active | Moderate - 41 followers, modest stars |
| NuGet | Active | Good - 59,809 downloads (underpromoted) |
| Medium | Active | Weak - 27 followers, 7 posts |
| Twitter/X (@senrecep0) | Active | Unknown - handle inconsistency |
| Stack Overflow | Minimal | Weak - reputation 31, 0 answers |
| ResearchGate | Passive | 1 publication |
| Reddit | Absent | No presence |
| YouTube | Absent | No channel or talk recordings |
| Dev.to / Hashnode | Absent | No profiles |
| Crunchbase / AngelList | Absent | No listings |
| Wikipedia / Wikidata | Absent | No entries |

---

## Quick Wins (Implement This Week)

1. **Fix Person.image to absolute URL** - One line in `JsonLd.tsx`, prepend `siteUrl` to `/images/profile.webp`. Fixes schema validation warning, strengthens entity card rendering. (15 minutes)

2. **Add CSP header to `middleware.ts`** - Closes the known security gap, improves Technical GEO score from 91 to ~95. (30 minutes)

3. **Add Permissions-Policy header to `middleware.ts`** - Complements the privacy page, strengthens security posture. (5 minutes)

4. **Create `llms-full.txt` route handler** - Full resume, project descriptions, skills, and work history for AI deep-context consumption. Differentiating signal - most sites only have `llms.txt`. (1-2 hours)

5. **Add GitHub topics and NuGet badge to CSharpEssentials/Aspire repos** - Surface the 60k NuGet downloads as visible traction. Fixes the most underpromoted existing asset. (30 minutes)

---

## 30-Day Action Plan

### Week 1: Technical & Schema Fixes
- [ ] Fix `Person.image` relative URL to absolute in `JsonLd.tsx`
- [ ] Add Content-Security-Policy header in `middleware.ts`
- [ ] Add Permissions-Policy header in `middleware.ts`
- [ ] Add standalone Organization schema for Taptoweb in `JsonLd.tsx`
- [ ] Add `downloadUrl` and `aggregateRating` to SoftwareApplication schema
- [ ] Fix WebSite schema to add SearchAction

### Week 2: Content Infrastructure
- [ ] Create `/blog` route structure (can use MDX or simple markdown)
- [ ] Publish 2-3 blog post summaries on-domain with "Read full article" links to Medium
- [ ] Create `llms-full.txt` with complete professional content
- [ ] Expand FAQ answer texts from 1-2 sentences to 3-5 sentences per answer

### Week 3: Platform Expansion
- [ ] Add GitHub topics, README descriptions, and NuGet badges to CSharpEssentials and Aspire repos
- [ ] Answer 5-10 Stack Overflow questions in C#/.NET/microservices area
- [ ] Surface 60k NuGet download count prominently in the portfolio projects section
- [ ] Add testimonials/recommendations section (pull from LinkedIn with permission)

### Week 4: Content Depth & Authority
- [ ] Write one project deep-dive page (recommend: "Building Easyapp's 28-Service Microservices Platform")
- [ ] Create an About page (500-800 words: origin story, technical philosophy, career arc)
- [ ] Add visible last-updated dates to resume and skills content
- [ ] Update privacy page with more detailed GDPR/cookie information (target 400-500 words)

---

## Appendix: Pages Analyzed

| URL | Title | GEO Issues |
|---|---|---|
| https://senrecep.com | Recep Sen - Software Engineer | H1, M6 |
| https://www.senrecep.com/en | Recep Sen - Software Engineer (EN) | H1, M6 |
| https://www.senrecep.com/en/resume | Recep Sen - Resume | L3 |
| https://www.senrecep.com/en/privacy | Privacy Policy - Recep Sen | L4 |
| All 13 language variants | (same as above, 3 page types) | Same issues per type |
| https://senrecep.com/llms.txt | llms.txt | M2 (llms-full.txt missing) |
| https://senrecep.com/sitemap.xml | XML Sitemap | L5 |
| https://senrecep.com/robots.txt | robots.txt | No issues |

---

*Report generated by GEO Audit skill. Scores are based on analysis of 43 URLs, robots.txt, llms.txt, schema markup, platform presence research across 15+ platforms, and technical infrastructure assessment.*
