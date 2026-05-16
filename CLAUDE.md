# CLAUDE.md — Visari Project Rules

## Language Synchronization (CRITICAL)

This project supports **three languages**: German (default), English, Spanish.

### File Structure

| Language | Location | URL Pattern |
|---|---|---|
| German (Default) | `/` (root) | `visari.ch/index.html` |
| English | `/en/` | `visari.ch/en/index.html` |
| Spanish | `/es/` | `visari.ch/es/index.html` |

### Page Mapping

Every page exists in three synchronized versions:

| German | English | Spanish |
|---|---|---|
| `index.html` | `en/index.html` | `es/index.html` |
| `models.html` | `en/models.html` | `es/models.html` |
| `ai-models-buchen.html` | `en/ai-models-buchen.html` | `es/ai-models-buchen.html` |
| `ai-model-werden-schweiz.html` | `en/ai-model-werden-schweiz.html` | `es/ai-model-werden-schweiz.html` |
| `verdienst-rechner.html` | `en/verdienst-rechner.html` | `es/verdienst-rechner.html` |
| `ueber-uns.html` | `en/ueber-uns.html` | `es/ueber-uns.html` |
| `rechtslage.html` | `en/rechtslage.html` | `es/rechtslage.html` |
| `datenschutz.html` | `en/datenschutz.html` | `es/datenschutz.html` |
| `impressum.html` | `en/impressum.html` | `es/impressum.html` |

**URL slugs stay the same across languages** to keep image/file references simple. Translations happen inside the HTML, not in the path.

### MANDATORY: Automatic Synchronization

**Every change to a German file MUST be replicated in the English AND Spanish equivalents in the same commit.**

This applies to:
- Text content (translate to EN and ES)
- Structural changes (add/remove sections, HTML structure)
- Link changes
- Meta tags, JSON-LD schemas
- Images, alt tags (translate alt texts)
- New sections or components

The user will NOT ask for this explicitly. Always sync automatically.

### What is Shared (edit only once)

These are shared across all three languages:
- `css/style.css`, `css/client.css`, `css/models.css`
- `js/main.js`
- `images/*`
- `fonts/*`
- `vercel.json`, `robots.txt`
- `favi_icon.png`

CSS/JS changes apply to all languages automatically via relative path from language folders (`../css/style.css`).

### Path Conventions

From root (`/index.html`):
- CSS: `css/style.css`
- JS: `js/main.js`
- Images: `images/foo.jpg`
- Internal link: `models.html`

From `/en/` or `/es/`:
- CSS: `../css/style.css`
- JS: `../js/main.js`
- Images: `../images/foo.jpg`
- Internal link (same language): `models.html` (stays in same folder)
- Link to other language version: `../models.html` (DE) or `../en/models.html` (EN) or `../es/models.html` (ES)

### Required Meta Tags per Language

Every page needs hreflang pointing to all three language versions:

```html
<link rel="alternate" hreflang="de" href="https://www.visari.ch/FILENAME">
<link rel="alternate" hreflang="en" href="https://www.visari.ch/en/FILENAME">
<link rel="alternate" hreflang="es" href="https://www.visari.ch/es/FILENAME">
<link rel="alternate" hreflang="x-default" href="https://www.visari.ch/FILENAME">
```

And `<html lang="XX">`:
- German: `<html lang="de">`
- English: `<html lang="en">`
- Spanish: `<html lang="es">`

Open Graph locale:
- German: `og:locale` = `de_CH`
- English: `og:locale` = `en_US`
- Spanish: `og:locale` = `es_ES`

### Language Switcher

Present in navigation on ALL pages. Format: `DE | EN | ES`
Links point to the same page in the target language.

### Translation Guidelines

- Tone: Professional, editorial, confident — same as German
- Keep brand names in original: "Visari", "Brand Architects", "Zürich" (can be "Zurich" in EN/ES)
- Legal terms keep Swiss law references: "Swiss Law (Art. 28 ZGB)" / "Derecho suizo (Art. 28 ZGB)"
- CHF stays CHF (currency)
- Don't translate proper product names: "Starter", "Campaign", "Extended", "Synthetic Origin", "Human Origin", "Branded Model"

### Commit Convention

When making changes, commit message should reflect multi-language scope:
```
feat: [description]

DE/EN/ES: [what was changed in all three]
```

## Project Info

- **Brand:** Visari — AI Model Agency (offered by Brand Architects Design GmbH, Zürich)
- **Stack:** Static HTML/CSS/JS, deployed on Vercel
- **Design:** Dark theme for client pages, light theme with gold accent for model pages
- **Fonts:** AncizarSerif (titles, h1-h4) + NotoSans (body, h5-h6) — all local, no Google Fonts
- **Primary colors:** `#3B82F6` (client blue) / `#b29146` (model gold)

## Contact

- **General:** info@visari.ch
- **Parent company:** https://www.brandarchitects.ch

## SEO Conventions

- Canonical URL format: WITHOUT `.html` extension (Vercel cleanUrls)
  Pattern: `https://www.visari.ch/<page>` (DE) / `https://www.visari.ch/en/<page>` (EN) / `https://www.visari.ch/es/<page>` (ES)
- Hreflang: same pattern, no `.html`
- og:url: same pattern, no `.html`
- Internal navigation links: omit `.html` (Vercel resolves them)
- JSON-LD schemas embedded in `<head>` of each page; FAQPage where visible Q&A exists on page; Organization+WebSite+Service on homepage; BreadcrumbList on all subpages; HowTo on process pages
- Sitemap.xml lastmod must be updated on every content change
