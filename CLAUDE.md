<!--
  Project memory for Claude Code. Lean by design (Anthropic's guidance: a bloated
  CLAUDE.md gets ignored). Litmus test for every line: "would removing this cause
  a mistake on THIS repo?" If not, cut it. Inherits ~/.claude/CLAUDE.md and
  ~/code/CLAUDE.md — don't repeat those here.
-->

# charlesjackson.dev

Personal site for Charles Jackson — a minimal, monochrome "agent interface": a soft
shaded black-&-white surface with a precise, cursor-driven HUD. Vite + React SPA,
deployed to **charlesjackson.dev** on Vercel.

The brand is the product. **Read `BRAND.md` before any visual or copy change** —
it is the source of truth for colour, type, motion, the ASCII system, and content rules.

## Commands

```bash
bun dev          # dev server (localhost:3000; falls through if taken)
bun run build    # production build → dist/
bun run typecheck   # tsc --noEmit
bun run lint     # biome lint ./src
bun run check    # biome lint+format, writes fixes
```

Use **bun** (not npm/yarn). `bun run check` before committing.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind v4 (`@tailwindcss/vite`) · Motion
(`motion/react`) · lucide-react · shadcn/ui (new-york). Biome for lint+format.

## Architecture (the non-obvious parts)

- **`src/lib/site.ts`** — all copy and links. Edit content here, not in components.
- **`src/lib/pointer.ts`** — global pointer state read by rAF loops *without* React
  re-renders. The hero HUD and custom cursor read it inside their own tick.
- **`src/components/hero-hud.tsx`** — the hero's centre interaction: faint crosshair
  guides + a live coordinate readout track the cursor, a static reticle marks centre.
  Writes transforms/`textContent` directly each frame; gates on `prefers-reduced-motion`.
- **`src/components/custom-cursor.tsx`** — reticle cursor via `mix-blend-difference`.
- **Theme:** `src/hooks/use-theme.tsx`, default **light**. Dark = `.dark` on `<html>`;
  an inline script in `index.html` sets it before first paint (no FOUC).
- **Background:** soft off-white (`--background`), never flat `#fff`; subtle corner
  shading via `body::before` + `--shade-rgb`. `--effect-rgb` carries the theme colour
  into HUD/cursor effects.

## Code style

- Biome: single quotes, no semicolons, trailing commas, 2-space, width 100.
- `cn()` (`@/lib/utils`) to compose classes. `@/*` → `src/*`.
- **Semantic Tailwind tokens only** — `bg-background`, `text-foreground`,
  `border-border`. Greys via `text-foreground/60`. Never hardcode `bg-white`/`text-black`.
- `font-mono` = Geist Mono for anything technical; `font-sans` = Geist for prose.

## Brand rules — do not violate (full guide in `BRAND.md`)

- **Monochrome only.** Black & white; greys are foreground-at-opacity. No accent colours.
- **Light is the default**, a soft shaded off-white — never flat `#fff`.
- **24px gutters.** Content sits 24px from every viewport edge (`px-6`, `*-6`).
- **Never two lines.** Wordmark, role lockup, footer name — each stays on one line.
- **Role rides with the name** in the top bar (`CHARLES JACKSON │ agentic systems
  engineer`); the theme toggle is a **bare** icon beside it — no sphere, never after the links.
- **GitHub + email only. NEVER add LinkedIn.** Footer stays minimal.
- **No mascots / ASCII faces.** The interaction is a calm precision HUD, not a character.
- Every interaction respects `prefers-reduced-motion`.

## Workflow

- **Explore → plan → code → verify.** Use plan mode for multi-file or unfamiliar
  changes; skip it for one-line fixes you could describe in a sentence.
- **YOU MUST verify before calling work done:** `bun run build` + `bun run typecheck`
  + `bun run lint` all green, **and** screenshot the UI at 1440px and 375px in
  **both** light and dark. Type-checking proves the code compiles, not that the
  feature looks right.
- `/clear` between unrelated tasks to keep context clean.

## Deploy

- Pushing to **`main`** auto-deploys on Vercel (framework `vite` → `dist/`).
- No PRs unless explicitly asked — push direct to `main` (see `~/code/CLAUDE.md`).
- Always confirm the deploy went green after pushing.
- Remote: `versalarchitect/shaolin-charles-portfolio` (the historical repo name;
  the brand is unrelated — don't reintroduce old branding).

## Gotchas

- **Fonts:** Chakra Petch = `font-display` (cybernetic wordmark/name), Space Grotesk =
  `font-sans`, Space Mono = `font-mono`. Imported in `src/main.tsx`; families in `@theme`.
- **Tailwind v4** lives in `src/globals.css` (`@theme inline`, `@custom-variant dark`).
  Biome can't parse Tailwind directives, so `*.css` is excluded in `biome.json` — keep it that way.
- **Fontsource** CSS side-effect imports need the module declaration in `src/vite-env.d.ts`.
- TS 6: no `baseUrl` (deprecated) — path aliases resolve via `paths` + `moduleResolution: bundler`.
