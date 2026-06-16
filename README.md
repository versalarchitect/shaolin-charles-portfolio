# charlesjackson.dev

Personal site for **Charles Jackson** — agentic systems engineer. A minimal,
monochrome interface: a soft shaded black-and-white surface with a cursor-driven
gravity field and a reticle cursor. Light mode.

```bash
bun install
bun dev          # → http://localhost:3000
bun run build    # → dist/
```

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Motion · shadcn/ui · Biome · bun.

## Highlights

- **Cursor gravity** — a soft shade-mass in the background is pulled toward the
  cursor with heavy inertia (`src/components/cursor-gravity.tsx`).
- **Reticle cursor** — a crosshair that inverts over any surface
  (`src/components/custom-cursor.tsx`).
- **Minimal & monochrome** — soft shaded off-white, Chakra Petch / Space Grotesk /
  Space Mono, a strict 24px viewport frame.
- Responsive and `prefers-reduced-motion`-aware.

## Conventions

- All content lives in [`src/lib/site.ts`](src/lib/site.ts).
- The visual identity is documented in [`BRAND.md`](BRAND.md) — read it before
  changing anything visual.
- Working with Claude Code? See [`CLAUDE.md`](CLAUDE.md).

## Deploy

Auto-deploys to Vercel on push to `main` (framework `vite` → `dist/`).
