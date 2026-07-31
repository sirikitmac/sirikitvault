# SirikitVault.dev

A personal, curated vault of UI/UX resources, design inspiration, components, animations, assets, and developer tools — built with a premium glassmorphism aesthetic inspired by Apple, Linear, Raycast, Arc, and Vercel.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- shadcn/ui-style owned components (`components/ui/`), `next-themes` for persistent light/dark mode

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new — zero config needed, defaults work.
3. Add your `sirikitvault.dev` domain in the Vercel project settings.

## Adding resources

Everything lives in **`data/resources.ts`**. Add one object:

```ts
{
  id: "my-new-site",           // unique, stable (used by favorites)
  name: "My New Site",
  url: "https://example.com/",
  description: "What it is and why it's in the vault.",
  category: "UI Components",   // see types/resource.ts for the list
  tags: ["React", "Free"],
  featured: true,              // optional — shows in Featured
  dateAdded: "2026-07-15",     // powers Recently Added
}
```

The counters, categories, filter chips, search index, and sections all update automatically.

### Notes

- **Descriptions**: lesser-known sites got best-guess placeholder descriptions — edit them freely.
- **Bookmarkify**: the source doc listed the same URL as Doron Supply for this entry; there's a `NOTE` comment in the data file — swap in the correct link.
- **Preview images**: cards currently use each site's favicon over a generated gradient. To use real screenshots later, add a `preview?: string` field to `types/resource.ts` and render it in `components/resource-card.tsx` — the layout is already built for it.

## Future expansion (already structured for)

- `note` and `rating` fields exist on the `Resource` type — wire them into the card UI whenever you want.
- Favorites persist in `localStorage` under `sirikitvault:favorites`.
- To import from JSON/Markdown/Sheets later, write a small script that outputs `Resource[]` and merge it into `data/resources.ts` — nothing else needs to change.

## Project structure

```
app/          layout, page, global styles
components/   navbar, hero, cards, chips, footer, ui/
lib/          utils (gradients, favicons), filter/search logic
hooks/        use-favorites
types/        Resource type
data/         resources.ts — the single source of truth
```
