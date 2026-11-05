<div align="center">

# SirikitVault

### My personal stash of UI/UX resources — the stuff I actually reach for when I build.

200 hand-picked sites across 12 categories: inspiration, components, animations, icons, fonts, assets, dev tools and more — wrapped in a glassy, cinematic interface.

[**Open the vault →**](https://sirikitvault.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## Why

Every designer-developer has a bookmarks folder that turned into a graveyard. SirikitVault is mine, rebuilt as something I'd actually want to open: searchable, filterable, with live previews, so finding "that one gradient site" takes seconds instead of ten tabs.

## Features

| | |
|---|---|
| 🔍 **Instant search** | Search names, descriptions and tags. Press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> from anywhere in the hero. |
| 🗂️ **12 categories** | Filter chips and a scrolling category marquee. Counters update on their own. |
| 🖼️ **Live previews** | Real website screenshots on every card, with a favicon-on-gradient fallback. |
| 🪟 **Four view modes** | Grid, Gallery, List and Single — your choice is remembered. |
| ⭐ **Favorites** | Save resources to your own shortlist (stored in your browser). |
| ✨ **Motion that feels good** | Scramble-text hero, animated section headings, orbit and particle fields — all Framer Motion. |
| 🌗 **Light & dark** | Persistent theme toggle via `next-themes`. |
| 🏷️ **Featured & Recommended** | Spotlighted picks and trusted-source labels. |

### What's inside

| Category | Count | Category | Count |
|---|---:|---|---:|
| UI Components | 36 | Animations | 17 |
| Design Assets | 34 | References | 12 |
| UI Inspiration | 23 | Fonts | 11 |
| Developer Tools | 23 | AI Tools | 9 |
| Icons | 19 | Backgrounds | 7 |
| Mockups | 5 | Productivity | 4 |

## Run it locally

```bash
git clone https://github.com/sirikitmac/sirikitvault.git
cd sirikitvault
npm install
npm run dev        # http://localhost:3000
```

Deploys to Vercel with zero config.

## Add a resource

Everything lives in [`data/resources.ts`](data/resources.ts). Add one object and the counters, chips, search index and sections update automatically:

```ts
{
  id: "my-new-site",          // unique + stable (used by favorites)
  name: "My New Site",
  url: "https://example.com/",
  description: "What it is and why it's in the vault.",
  category: "UI Components",  // see types/resource.ts
  tags: ["React", "Free"],
  featured: true,             // optional — shows in Featured
  recommended: true,          // optional — "Recommended" label
  dateAdded: "2026-07-15",    // powers Recently Added
}
```

## Project structure

```
app/          layout, page, global styles
components/   hero, navbar, resource cards + modal, filter chips,
              view switcher, scramble text, marquee, ui/
data/         resources.ts — single source of truth
hooks/        use-favorites, use-view-mode
lib/          filtering + search, gradients, favicon & preview helpers
types/        Resource + Category types
```

## Roadmap

- [x] Search, filters, categories and four view modes
- [x] Live screenshot previews
- [x] Favorites (local)
- [ ] Sign in with Google + **Supabase** to sync favorites across devices
- [ ] Personal notes and ratings on cards (fields already on the `Resource` type)
- [ ] Import resources from JSON / Markdown / Sheets

---

<div align="center">
<sub>Curated by <a href="https://github.com/sirikitmac">@sirikitmac</a> · links belong to their respective owners</sub>
</div>
