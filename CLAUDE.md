# Charles Portfolio - Development Guidelines

## Project Overview

Personal portfolio website for Charles Jackson showcasing projects, skills, and 3D art experiments.

### Live URLs

- **Primary**: https://shaolincharles.dev
- **WWW**: https://www.shaolincharles.dev
- **Vercel**: https://shaolin-charles.vercel.app

### Repository

- **GitHub**: https://github.com/versalarchitect/shaolin-charles-portfolio

### Deployment

- **Platform**: Vercel
- **Project**: `shaolin-charles` under `charles-jacksons-projects` team
- **Framework**: Vite + React
- **Auto-deploy**: Pushes to `main` branch trigger production deployments

### Development

```bash
# From monorepo root
npx nx dev charles-web      # Start dev server
npx nx build charles-web    # Production build
npx nx lint charles-web     # Run linter

# From this directory (standalone)
bun run dev                 # Start dev server
bun run build               # Production build
```

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| 3D | Three.js |
| Icons | Lucide React |
| i18n | i18next (EN/FR) |

## Design Philosophy

**Sophistication is in subtlety.**

Restraint is more impressive than excess. A single well-placed animation beats ten competing effects. Let the content breathe. The best design disappears - users notice the experience, not the techniques.

## Content Guidelines

### Social Links
- **GitHub**: Yes - display in footer, header, contact page, and home page
- **LinkedIn**: No - do not display anywhere on the site
- **Email**: Yes - primary contact method

### Role Titles
- **Predictive (Augure)**: "Founder & Principal Developer"
- **MyUrbanFarm.ai**: "CTO & Principal Software Developer"
- **World**: "Creator & Developer"

### Footer
- Keep it minimal - copyright only
- No "made with love" or "built with React & TypeScript" taglines

## Design System

### Color Palette
- **Monochromatic theme** - Black, white, and grays only
- Use `foreground/5`, `foreground/10`, `foreground/20` for subtle overlays
- No colors except for occasional green status indicators

### Section Boundary Grid (Primary)
The signature design element that visually delineates content sections.

**Purpose:**
- **Grid lines** define the content boundaries - they show where the container edges are (vertical) and where sections begin/end (horizontal)
- **"+" markers** highlight the intersections - they draw attention to section corners, making the grid structure feel intentional rather than accidental
- Together, they create a technical/blueprint aesthetic that reinforces the developer portfolio theme

**Visual behavior:**
- Vertical lines run the full page height at container padding positions (left and right edges of content)
- Horizontal lines span edge-to-edge at section boundaries (top and bottom of each `<Section>`)
- "+" markers appear only where vertical and horizontal lines intersect (4 corners per section)
- Lines are subtle (low opacity), markers are more visible (3:1 contrast ratio)

**Implementation:**
```tsx
// In App.tsx - wrap with provider and add the grid
import { SectionGridProvider, SectionBoundaryGrid, Section } from '@/components/ui/gradient-background'

<SectionGridProvider containerPadding={24}>
  <SectionBoundaryGrid intensity={1} markerSize={14} />
  {/* ... content ... */}
</SectionGridProvider>

// In page components - use Section wrapper instead of <section>
<Section id="hero" className="...">
  {/* section content */}
</Section>
```

**Key props:**
- `containerPadding`: Distance from viewport edge to vertical lines (default: 24px, matches `px-6`)
- `intensity`: Overall visibility scale (default: 1). Use 0.5 for subtle, 1 for default, 1.5+ for emphasis. Preserves 3:1 contrast ratio between markers (more visible) and lines.
- `markerSize`: Size of + markers in pixels (default: 12)

### Intersection Grid (Cal.com Style - Legacy)
Repeating "+" symbols across the entire background - Cal.com inspired pattern.

**Still available but not primary:**
```tsx
import { IntersectionGrid } from '@/components/ui/gradient-background'

// Basic usage - tiled plus markers with radial fade
<IntersectionGrid opacity={0.06} fadeCenter={true} gridSize={80} />
```

**Design principles:**
- **Sparse spacing** - 80-140px between plus markers
- **Subtle opacity** - 0.04-0.15 opacity range
- **Background element only** - Always use `pointer-events-none`

### Typography
- Name "Charles Jackson" should always be on **one line** (use `whitespace-nowrap`)
- Font: Geist (variable weight)
- Monospace: Geist Mono for technical elements

### Floating Elements
- Tech badges floating on the right side of hero
- Subtle animations (gentle float, slight rotation)
- Should complement, not distract from main content

### Animation Philosophy
- Subtle and purposeful
- No jarring transitions
- Use Framer Motion for smooth interactions
- Magnetic buttons for interactive elements

### Opacity & Transparency Scale

Use consistent opacity values for the monochromatic theme:

| Opacity | Use Case | Example |
|---------|----------|---------|
| `foreground/[0.02]` | Subtle backgrounds, large watermark numbers | Card backgrounds |
| `foreground/[0.03]` | Slightly more visible backgrounds | Open accordion state |
| `foreground/[0.04]` | Icon box backgrounds | Small bento cards |
| `foreground/[0.05]` | Default subtle fills | Badges, tags |
| `foreground/[0.08]` | Default borders | Card borders |
| `foreground/10` | Slightly visible borders | Hover states |
| `foreground/15` | Hover borders | Interactive elements |
| `foreground/20` | Active/focus borders | Open states |
| `foreground/40` | Muted text | Secondary labels |
| `foreground/60` | Icons, subtle text | Icon default state |
| `foreground/70` | Semi-visible text | Descriptions |
| `foreground/80` | Near-full text | Primary text |

### Border Radius Scale

| Radius | Use Case |
|--------|----------|
| `rounded` | Small tags, badges |
| `rounded-lg` | Icon boxes, small cards |
| `rounded-xl` | Standard cards |
| `rounded-2xl` | Large cards, accordions |
| `rounded-full` | Pills, circular buttons |

### Spacing Conventions

- **Container padding**: `px-6 lg:px-8` (24px to 32px)
- **Section padding**: `py-24 lg:py-32` (96px to 128px)
- **Card padding**: `p-6 md:p-8` (24px to 32px)
- **Gap between cards**: `gap-3 md:gap-4` (12px to 16px)

## UI Components

### Accordion (`@/components/ui/accordion`)

Large, expandable sections with rich content support.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" defaultValue="first-item">
  <AccordionItem value="first-item" index={0}>
    <AccordionTrigger
      value="first-item"
      subtitle="Optional subtitle"
      icon={<Icon className="w-6 h-6 text-foreground/70" />}
    >
      Title
    </AccordionTrigger>
    <AccordionContent value="first-item">
      {/* Rich content: description, bullet points, tags */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Features:**
- Plus/Minus toggle button (fills on open)
- Large watermark index numbers (01, 02, 03...)
- Subtitle support in trigger
- Icon rotation animation on open
- Decorative separator line in content

### Bento Grid (`@/components/bento-grid`)

Asymmetric grid for displaying skills/expertise.

**Structure:**
- One featured card (2x2 span) with large styling
- Multiple smaller cards (1x1) with compact styling
- Large decorative numbers in backgrounds
- Tech tags at bottom of each card

### Effects Library (`@/components/ui/aaa-effects`)

| Component | Purpose |
|-----------|---------|
| `TiltCard` | 3D tilt effect on hover |
| `SpotlightCard` | Mouse-following spotlight gradient |
| `ScrollFadeIn` | Fade in on scroll into view |
| `BlurFadeIn` | Blur + fade entrance animation |
| `Magnetic` | Magnetic cursor attraction |
| `AnimatedNumber` | Count-up number animation |
| `StaggerContainer` | Staggered children animations |
| `GlowBorder` | Subtle glow effect on borders |

### Decorative Patterns

**Large Watermark Numbers:**
```tsx
<div className="absolute -right-4 -top-4 text-[180px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none">
  01
</div>
```

**Corner Accent Lines:**
```tsx
<div className="absolute top-0 right-0 w-24 h-24">
  <div className="absolute top-6 right-6 w-px h-12 bg-gradient-to-b from-foreground/20 to-transparent" />
  <div className="absolute top-6 right-6 w-12 h-px bg-gradient-to-r from-foreground/20 to-transparent" />
</div>
```

**Decorative Separator:**
```tsx
<div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />
```

### Button Patterns

**Primary CTA:**
```tsx
<Button size="lg" className="h-12 px-8 font-mono group">
  Label
  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
</Button>
```

**Icon-only (circular):**
```tsx
<motion.a
  whileHover={{ scale: 1.1, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center justify-center w-11 h-11 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-foreground/10 transition-all"
>
  <Icon className="h-5 w-5" />
</motion.a>
```

### Tag/Badge Patterns

**Tech tag (small):**
```tsx
<span className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60">
  React
</span>
```

**Status badge:**
```tsx
<span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-mono rounded flex items-center gap-1.5">
  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
  LIVE
</span>
```

## 3D Assets & Model Libraries

Open source CC0 libraries for Three.js scenes. Use these based on scene requirements.

### Library Selection Guide

| Scene Type | Primary Library | Why |
|------------|-----------------|-----|
| City/Urban | Kenney | Modular building kits, roads, vehicles |
| Nature/Outdoor | Quaternius | Trees, rocks, plants, terrain |
| Characters/NPCs | Quaternius | Rigged low-poly characters with animations |
| Asian/Fantasy | Quaternius + Poly Pizza | Temples, lanterns, themed architecture |
| Sci-Fi/Space | Kenney | Spaceships, planets, space stations |
| Interior | Poly Pizza | Furniture, appliances, decor |
| Prototype/Testing | Khronos glTF | Reference models, format validation |

### Kenney (kenney.nl/assets)

**Best for:** Modular kits, UI elements, game-ready assets

| Asset Pack | URL | Use Case |
|------------|-----|----------|
| City Kit (Roads) | `kenney.nl/assets/city-kit-roads` | Streets, intersections, sidewalks |
| City Kit (Commercial) | `kenney.nl/assets/city-kit-commercial` | Shops, offices, urban buildings |
| City Kit (Suburban) | `kenney.nl/assets/city-kit-suburban` | Houses, residential areas |
| Nature Kit | `kenney.nl/assets/nature-kit` | Trees, rocks, grass patches |
| Space Kit | `kenney.nl/assets/space-kit` | Spaceships, asteroids, planets |
| Furniture Kit | `kenney.nl/assets/furniture-kit` | Interior decoration |
| Car Kit | `kenney.nl/assets/car-kit` | Vehicles for city scenes |

```bash
# Download City Kit Roads
curl -L -o city-roads.zip "https://kenney.nl/assets/city-kit-roads/releases/1/kenney_city-kit-roads.zip"
unzip city-roads.zip -d public/models/kenney/city-roads/
```

### Quaternius (quaternius.com)

**Best for:** Characters, nature, fantasy/medieval themes

| Asset Pack | Description |
|------------|-------------|
| Ultimate Nature Pack | 100+ trees, rocks, bushes, flowers |
| Ultimate Buildings | Medieval, fantasy, Asian-style buildings |
| Animated Characters | Rigged humans, animals with walk/idle/run |
| Stylized Characters | Cartoon-style NPCs |
| Ultimate Space Kit | Detailed spacecraft and stations |
| Fantasy Buildings | Castles, towers, temples |

```bash
# Clone full library (recommended - all assets)
git clone --depth 1 https://github.com/quaternius/lowpoly-assets public/models/quaternius/

# Or browse: https://quaternius.com/packs.html
```

### Poly Pizza (poly.pizza)

**Best for:** Searching for specific items, community-contributed models

- Searchable database of 10,000+ free models
- Filter by license (CC0, CC-BY)
- Direct GLB downloads
- API available for programmatic access

```bash
# Search and download via browser, then:
# https://poly.pizza/m/XXXXX -> Download GLB

# Example: Japanese lantern
curl -L -o lantern.glb "https://poly.pizza/api/download/dLbKgYMVRG"
```

### Khronos glTF Sample Assets

**Best for:** Testing loaders, format reference, PBR examples

```bash
# Get specific model
curl -L -o public/models/damaged-helmet.glb \
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"

# Clone all samples
git clone --depth 1 https://github.com/KhronosGroup/glTF-Sample-Assets public/models/gltf-samples/
```

### Loading Models in Three.js

```typescript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

// Setup Draco for compressed models
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)

// Load model
loader.load('/models/building.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(gltf.scene)
})
```

### Performance Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Format | GLB (binary) over GLTF (JSON + separate files) |
| Compression | Use Draco for models > 500KB |
| Polygon count | < 10K triangles per model for web |
| Textures | Max 1024x1024, prefer 512x512 |
| Instancing | Use `InstancedMesh` for repeated objects |
| LOD | Implement for large scenes (> 50 models) |

### Directory Structure

```
public/models/
├── kenney/
│   ├── city-roads/
│   ├── city-commercial/
│   └── nature/
├── quaternius/
│   ├── buildings/
│   ├── nature/
│   └── characters/
├── poly-pizza/
│   └── [downloaded models by theme]
├── kaylousberg/
│   └── [low-poly packs]
└── custom/
    └── [project-specific models]
```

### Model Selection Workflow

When building a themed 3D scene, follow this process:

**1. Identify Scene Requirements**
```
Scene: Asian Night City
├── Architecture: pagodas, houses, temples, bridges
├── Props: lanterns, stone lamps, barrels, crates
├── Nature: cherry trees, bamboo, lotus, rocks
├── Lighting: lantern glow, moonlight, fireflies
└── Atmosphere: fog, water reflections, stars
```

**2. Search Libraries by Category**

| Category | Search Terms | Priority Libraries |
|----------|--------------|-------------------|
| Architecture | "pagoda", "temple", "japanese house" | Poly Pizza, Quaternius |
| Props | "lantern", "stone lamp", "barrel" | Kay Lousberg, Kenney |
| Nature | "cherry tree", "bamboo", "rock" | Quaternius Nature Pack |
| Vehicles | "boat", "cart", "rickshaw" | Kenney, Poly Pizza |

**3. Evaluate Models**
- **Poly count**: < 5K for props, < 15K for hero objects
- **Style consistency**: Match art direction (low-poly, stylized, realistic)
- **License**: Prefer CC0, accept CC-BY with attribution
- **Format**: GLB preferred, GLTF acceptable

**4. Download & Organize**
```bash
# Create themed subfolder
mkdir -p public/models/poly-pizza/asian-city

# Download with descriptive names
curl -L -o public/models/poly-pizza/asian-city/pagoda-main.glb "URL"
curl -L -o public/models/poly-pizza/asian-city/stone-lantern.glb "URL"
```

**5. Track Attribution**
Create `public/models/ATTRIBUTION.md`:
```markdown
# Model Attribution

## Poly Pizza
- pagoda-main.glb - "Pagoda" by Artist Name (CC-BY 3.0)
- stone-lantern.glb - "Japanese Stone Lamp" by Flopsi (CC-BY 3.0)

## Quaternius (CC0)
- cherry-tree.glb - Ultimate Nature Pack
```

### Kay Lousberg (kaylousberg.com)

**Best for:** Low-poly props, modular pieces, consistent style

GitHub: `github.com/KayLousberg/free-3d-assets`

| Pack | Contents |
|------|----------|
| Prototype Kit | Basic shapes, platforms, ramps |
| Nature Pack | Trees, rocks, grass |
| Dungeon Pack | Medieval props, chests, barrels |
| Holiday Pack | Seasonal decorations |

```bash
# Clone Kay Lousberg's free assets
git clone --depth 1 https://github.com/KayLousberg/free-3d-assets public/models/kaylousberg/
```

### Poly Pizza Download Methods

Poly Pizza models require manual download or API access:

```bash
# Method 1: Direct GLB URL (when available)
curl -L -o model.glb "https://poly.pizza/download/{model-id}/glb"

# Method 2: Via poly.pizza page - download manually
# Visit: https://poly.pizza/m/{model-id}
# Click "Download" → Select GLB format

# Common Model IDs for Asian Scenes:
# Pagoda: 1zS7ucaAd4J, d1M5ncMBUDi, eHOI2VgW1ol
# Torii Gate: cXyQGUwmlA5, 07__lYTDdEH
# Stone Lamp: 5gZfOZIW92k
# Lantern: 9YMVn5hMiv8
# Red Lantern: 7PZhxLFiGc2
```
