# Charles Jackson — Brand Keeper Guide

> The single source of truth for the brand. Read this before any visual or copy
> work. If a change would contradict this guide, change the guide first (on
> purpose), then the code — never let them drift.

---

## 1. Essence

**Who.** Charles Jackson — agentic systems engineer. Builds autonomous software:
systems that perceive a goal, reason about it, and act.

**The idea.** The site is a **precision instrument**. A calm, monochrome surface,
framed at its four corners, mostly empty in the centre — where a quiet cursor-driven
HUD responds to you. Sophistication lives in the detail, not in density. Nothing is
loud, nothing is a gimmick, nothing looks childish.

**Personality.** Precise · restrained · autonomous · exact.

**Three words to hold onto:** minimal · precise · monochrome.

---

## 2. Voice & Tone

- **Lowercase, terse, command-line cadence.** Short declaratives, no marketing fluff.
- **Mono accents punctuate copy:** `>` (prompt), `·` (separator), `↗ ↓` (direction),
  `key value` telemetry pairs.
- **Confident, not loud.** State capability plainly; let the interface do the showing.

| Do | Don't |
|---|---|
| `> perceive · decide · act` | "Welcome to my amazing portfolio!" |
| `agentic systems engineer` | "I'm passionate about leveraging synergy 🚀" |

---

## 3. Colour — Monochrome, Light-First, Never Flat

Black and white only. **No accent colours, ever.** Greys are the *foreground* colour
at reduced opacity — never separate hues.

| Token | Light (default) | Dark |
|---|---|---|
| `--background` | `#F3F2F0` (soft shaded off-white) | `#0A0A0A` |
| `--foreground` | `#0A0A0A` | `#FAFAF9` |
| `--border` | `foreground / 10%` | `foreground / 12%` |
| `--effect-rgb` | `10, 10, 10` | `250, 250, 250` |
| `--shade-rgb` | `28, 26, 22` | `210, 214, 224` |

- **Never flat `#FFFFFF`.** The base is a soft off-white, and `body::before` lays four
  *very subtle* radial gradients into the corners (`rgba(var(--shade-rgb), ~0.04)`) so
  the page has depth without colour. In dark mode the corners glow faintly lighter.
- **All effects** (HUD, glows, spotlights) use `rgba(var(--effect-rgb), a)` so they
  invert correctly between themes.
- **Inverted selection** (`::selection` → ink on paper / paper on ink).
- **No status colours** — "online / available" is a small pulsing mono dot, never green.

Opacity scale (foreground over background): `/[0.02]` fills · `/10–/15` hairlines &
guides · `/40–/45` muted labels · `/50–/70` secondary text · `100%` wordmark.

---

## 4. Typography

Three faces, all technical and serious — never the friendly/geometric look that reads
as childish.

- **`font-display` — Chakra Petch.** The cybernetic wordmark and the big footer name.
  Angular, techno, distinctive. Always **uppercase**, tracked.
- **`font-sans` — Space Grotesk (variable).** UI, headings, body. Modern grotesque.
- **`font-mono` — Space Mono.** Labels, links, telemetry, the HUD readout — anything
  technical/aligned.

**Rules**
- The wordmark **"Charles Jackson" stays on one line**, everywhere, always.
- The footer name is one line of Chakra Petch, scaled to fit the viewport.
- Section headlines use a two-tone pattern: full-strength phrase + a `text-foreground/40`
  continuation. e.g. **Software that acts** *— not just responds.*

---

## 5. The Interface — a precision HUD (the signature)

The centrepiece is **not** decoration or ASCII art. It is a calm instrument
(`hero-hud.tsx`):

- **Crosshair guides** — faint hairlines (`foreground/15`) track the cursor across the
  empty centre. Subtle, exact, never a glowing bloom.
- **Live readout** — a small mono coordinate (`0.685 : 0.427`) follows the cursor.
- **Centre reticle** — a static dashed ring + `+`, the focal anchor; a slow rotation
  under `motion-safe`.
- **Reticle cursor** (`custom-cursor.tsx`) — a crosshair that inverts over any surface
  via `mix-blend-difference`; fine-pointer only.

**Hard nos for this layer:** no constant radial that chases the mouse, no random vector
fields, no ASCII "face" / mascot, no character animations. The interaction is felt in
the *subtlety* — it should reward attention, not demand it.

---

## 6. Motion

Animation communicates; it is not decoration. (Inherits the animation-first philosophy
from `~/code/CLAUDE.md`.)

- **Cursor HUD** — guides + readout track the pointer; eased, faint.
- **Scroll reveals** — fade (+ small rise), staggered, `once: true`, ease `[0.22,1,0.36,1]`.
- **Theme toggle** — a bare icon (no border) cross-fades sun/moon.
- **Micro-interactions** — link hover, button press scale, spotlight cards.
- **Budgets:** 150–300ms micro, 300–600ms reveals. GPU-only (`transform`, `opacity`).
  Always honour `prefers-reduced-motion`.

---

## 7. Layout & Spacing

- **24px gutters — non-negotiable.** Any content touching a viewport edge sits exactly
  24px in, horizontally *and* vertically (`px-6`, `pt-6`, `bottom-6`, `left-6`…).
- **The hero is a frame.** Four corners carry content; the centre is empty but for the
  HUD. Top bar = identity left, links right. Bottom bar = telemetry strip. Footer = the
  big cybernetic name (bottom-left) + channels (bottom-right).
- **Top-bar lockup:** `CHARLES JACKSON` │ `agentic systems engineer` + a **bare** theme
  icon — in that order, the role riding with the name, on one line.
- **Content sections** (about/work/stack/contact) are centred columns (`max-w-6xl`),
  not full-bleed.
- **Cards** (`spotlight-card.tsx`): `rounded-2xl`, `border-foreground/10`,
  `bg-foreground/[0.02]`, with a monochrome cursor-follow spotlight on hover.

---

## 8. Content Rules

- **GitHub:** yes — `github.com/versalarchitect`. **Email:** yes —
  `charles@charlesjackson.dev`. **LinkedIn: never.**
- **Footer is minimal:** the name, two channels, copyright + domain.
- **All content lives in `src/lib/site.ts`** — edit copy/links there.
- Domain: **charlesjackson.dev**.

---

## 9. Hard Don'ts

- ✗ Flat pure-white background (too bright) — use the shaded off-white.
- ✗ Any colour beyond black & white. No green status dots.
- ✗ The ASCII agent face / any mascot or character animation.
- ✗ A constant radial or random vector field chasing the cursor.
- ✗ Two-line wraps — the wordmark, role lockup, and footer name stay one line.
- ✗ The theme toggle inside a circle/sphere, or trailing the nav links.
- ✗ Content closer than 24px to a viewport edge.
- ✗ LinkedIn, anywhere. Hardcoded `bg-white`/`text-black`. Heavy shadows.

---

## 10. Token Quick-Reference

```
bg-background / text-foreground / border-border   ← semantic, theme-aware
text-foreground/60                                ← greys via opacity
rgba(var(--effect-rgb), a)                         ← HUD + cursor colour
rgba(var(--shade-rgb), a)                          ← subtle corner shading
font-display → Chakra Petch   font-sans → Space Grotesk   font-mono → Space Mono
.dark on <html>             ← dark mode (default = light, no class)
24px (px-6 / *-6)           ← the universal gutter
```

*Minimal. Precise. Monochrome. The detail is the design.*
