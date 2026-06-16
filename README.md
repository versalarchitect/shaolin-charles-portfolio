# charlesjackson.dev

Personal site for **Charles Jackson** — agentic systems engineer. A monochrome,
ASCII-driven "agent interface": a living black-and-white surface that reacts to
your cursor. Light mode by default, with a dark toggle.

```bash
bun install
bun dev          # → http://localhost:3000
bun run build    # → dist/
```

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Motion · shadcn/ui · Biome · bun.

## Highlights

- **Interactive ASCII field** — a canvas of monospace glyphs that blooms into
  shapes under the cursor (`src/components/ascii-field.tsx`).
- **The agent** — an ASCII face whose eyes track your cursor, blinks, and reacts
  (`src/components/agent-face.tsx`).
- **Reticle cursor** — a crosshair that inverts over any surface.
- Fully themed (light default / dark), responsive, and `prefers-reduced-motion`-aware.

## Conventions

- All content lives in [`src/lib/site.ts`](src/lib/site.ts).
- The visual identity is documented in [`BRAND.md`](BRAND.md) — read it before
  changing anything visual.
- Working with Claude Code? See [`CLAUDE.md`](CLAUDE.md).

## Deploy

Auto-deploys to Vercel on push to `main` (framework `vite` → `dist/`).
