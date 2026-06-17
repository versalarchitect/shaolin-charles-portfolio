# Charles Jackson — Brand Keeper Guide

> The single source of truth for the brand. Read this before any visual or copy
> work. If a change would contradict this guide, change the guide first (on
> purpose), then the code — never let them drift.

---

## 1. Essence

**Who.** Charles Jackson — agentic systems engineer. Builds autonomous software:
systems that perceive a goal, reason about it, and act.

**The idea.** The site is a **precision instrument**. A calm, monochrome surface,
framed at its four corners, mostly empty in the centre — where a slow liquid-chrome
field bends toward your cursor. Sophistication lives in the detail, not in density.
Nothing is loud, nothing is a gimmick, nothing looks childish.

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
| `> focused on building predictive systems` | "Welcome to my amazing portfolio!" |
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

- **Never flat `#FFFFFF`.** The base is a soft off-white; the **chrome field** (§5) lays
  slow monochrome depth over it, so the page is never flat-bright.
- **All effects** (chrome field, glows, spotlights) use `rgba(var(--effect-rgb), a)` so they
  read correctly on the off-white base.
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

## 5. The Interface — the chrome field (the signature)

The centrepiece is **not** decoration, a HUD, or ASCII art. It is a calm, full-viewport
**liquid-chrome field** (`chrome-field.tsx`) behind everything:

- **Liquid-metal waves** — a WebGL fragment shader (FBM noise + domain warping over the
  off-white base) renders slow, monochrome chrome that drifts. Subtle, never busy.
- **Cursor ripple** — the field bends gently *toward* the pointer. It rewards attention;
  it never chases or demands it.
- **Reticle cursor** (`custom-cursor.tsx`) — a crosshair that inverts over any surface via
  `mix-blend-difference`; fine-pointer only.
- **Restraint built in** — render scale drops and the field freezes on coarse pointers and
  under `prefers-reduced-motion`.

**Hard nos for this layer:** no constant radial that chases the mouse, no random vector
fields, no ASCII "face" / mascot, no character animations, no centre crosshair-HUD. The
interaction is felt in the *subtlety*.

---

## 6. Motion

Animation communicates; it is not decoration. (Inherits the animation-first philosophy
from `~/code/CLAUDE.md`.)

- **Chrome field** — slow liquid-metal drift; bends toward the cursor; eased, faint.
- **Scroll reveals** — fade (+ small rise), staggered, `once: true`, ease `[0.22,1,0.36,1]`.
- **Micro-interactions** — link hover, button press scale, spotlight cards, directional
  arrows (`↗`/`↓`) that nudge on hover.
- **Budgets:** 150–300ms micro, 300–600ms reveals. GPU-only (`transform`, `opacity`).
  Always honour `prefers-reduced-motion`.

---

## 7. Layout & Spacing

- **24px gutters — non-negotiable.** Any content touching a viewport edge sits exactly
  24px in, horizontally *and* vertically (`px-6`, `pt-6`, `bottom-6`, `left-6`…).
- **The hero is a frame.** Four corners carry content; the centre is empty but for the
  HUD. Top bar = identity left, links right. Bottom bar = telemetry strip. Footer = the
  big cybernetic name (bottom-left) + channels (bottom-right).
- **Top-bar lockup:** the `CHARLES JACKSON` wordmark with `agentic systems engineer` on its
  own line directly beneath it (not joined by a `│`); nav links sit top-right. Light-only —
  no theme toggle.
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
- ✗ Re-introducing a theme toggle (the site is light-only), or a centre crosshair-HUD.
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
