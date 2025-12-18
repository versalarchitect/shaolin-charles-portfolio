import { useState, Suspense, lazy, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/ui/gradient-background'
import { BlurFadeIn } from '@/components/ui/aaa-effects'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// Lazy load art canvases (explicit index paths to avoid Vite module resolution issues)
const AsianCityCanvas = lazy(() =>
  import('@/components/art/asian-city/index').then((m) => ({ default: m.AsianCityCanvas }))
)
const BaliSceneCanvas = lazy(() =>
  import('@/components/art/bali/index').then((m) => ({ default: m.BaliScene }))
)

// Categories
type Category = 'abstract' | 'worlds'

const categories: { id: Category; label: string }[] = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'worlds', label: 'Worlds' },
]

// Art pieces data
const artPieces = [
  {
    id: 'bali',
    title: 'Bali Sunset',
    thumbnail: '/art/bali-thumb.jpg',
    color: 'from-orange-500/20 to-amber-500/20',
    category: 'worlds' as const,
    hasCanvas: true,
  },
  {
    id: 'asian-city',
    title: 'Moonlit City',
    thumbnail: '/art/asian-city-thumb.jpg',
    color: 'from-indigo-500/20 to-purple-500/20',
    category: 'worlds' as const,
    hasCanvas: true,
  },
  {
    id: 'valley',
    title: 'Valley',
    thumbnail: '/art/valley-thumb.jpg',
    color: 'from-emerald-500/20 to-teal-500/20',
    category: 'worlds' as const,
  },
]

// Loading fallback
function CanvasLoader({ title }: { title: string }) {
  return (
    <div className="w-full h-full bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-foreground/50 font-mono">{title}</p>
      </div>
    </div>
  )
}

// Render canvas based on piece id
function ArtCanvas({ pieceId }: { pieceId: string }) {
  switch (pieceId) {
    case 'bali':
      return <BaliSceneCanvas />
    case 'asian-city':
      return <AsianCityCanvas loadExternalModels />
    default:
      return null
  }
}

// Fullscreen art canvas view - completely takes over the screen
function FullscreenArt({
  piece,
  onClose,
}: {
  piece: (typeof artPieces)[0]
  onClose: () => void
}) {
  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      {/* Back button - top left dark corner */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-5 left-5 z-20"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="font-mono gap-2 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Button>
      </motion.div>

      {/* Art canvas - full viewport */}
      <div className="w-screen h-screen">
        {piece.hasCanvas ? (
          <Suspense fallback={<CanvasLoader title={piece.title} />}>
            <ArtCanvas pieceId={piece.id} />
          </Suspense>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${piece.color} flex items-center justify-center`}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white/80 mb-2">{piece.title}</h2>
              <p className="text-sm text-white/50 font-mono">Coming soon</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Preview canvas wrapper with mouse tracking
function ArtPreview({ piece }: { piece: (typeof artPieces)[0] }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  if (!piece.hasCanvas) {
    return <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${piece.color}`} />
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Suspense
        fallback={<div className={`w-full h-full bg-gradient-to-br ${piece.color}`} />}
      >
        {piece.id === 'bali' && (
          <BaliSceneCanvas preview mouseX={mousePos.x} mouseY={mousePos.y} />
        )}
        {piece.id === 'asian-city' && (
          <AsianCityCanvas preview mouseX={mousePos.x} mouseY={mousePos.y} />
        )}
      </Suspense>
    </div>
  )
}

// Art grid item
function ArtGridItem({
  piece,
  index,
  onClick,
}: {
  piece: (typeof artPieces)[0]
  index: number
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative aspect-square cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Live 3D preview or gradient fallback */}
      <ArtPreview piece={piece} />

      {/* Title overlay */}
      <motion.div
        className="absolute inset-0 rounded-lg flex items-end p-4 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-sm font-medium text-foreground">{piece.title}</span>
      </motion.div>

      {/* Border */}
      <div className="absolute inset-0 rounded-lg border border-foreground/10 group-hover:border-foreground/20 transition-colors z-10 pointer-events-none" />
    </motion.div>
  )
}

export default function Art() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [selectedPiece, setSelectedPiece] = useState<(typeof artPieces)[0] | null>(null)

  // Validate category from URL, default to 'abstract' if invalid
  const activeCategory: Category = (category === 'abstract' || category === 'worlds')
    ? category
    : 'abstract'

  const filteredPieces = artPieces.filter((piece) => piece.category === activeCategory)

  const handleCategoryChange = (cat: Category) => {
    navigate(`/art/${cat}`)
  }

  return (
    <>
      {/* Fullscreen view */}
      <AnimatePresence>
        {selectedPiece && (
          <FullscreenArt piece={selectedPiece} onClose={() => setSelectedPiece(null)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen">
        {/* Hero */}
        <Section id="art-hero" className="relative pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <BlurFadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                  Visual Experiments
                </h1>
              </BlurFadeIn>

              <BlurFadeIn delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  Generative art, shaders, and interactive visuals.
                </p>
              </BlurFadeIn>

              {/* Category filter - simple text links */}
              <BlurFadeIn delay={0.3}>
                <nav className="flex gap-x-6 mt-8">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.id

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`
                          relative text-sm font-medium transition-colors
                          ${isActive
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {cat.label}
                        {isActive && (
                          <motion.div
                            layoutId="art-category-indicator"
                            className="absolute -bottom-1 left-0 right-0 h-px bg-foreground"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </BlurFadeIn>
            </div>
          </div>
        </Section>

        {/* Grid */}
        <Section id="art-grid" className="pb-24">
          <div className="container mx-auto px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
              >
                {filteredPieces.length > 0 ? (
                  filteredPieces.map((piece, index) => (
                    <ArtGridItem
                      key={piece.id}
                      piece={piece}
                      index={index}
                      onClick={() => setSelectedPiece(piece)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <p className="text-muted-foreground font-mono text-sm">No pieces yet</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Section>
      </div>
    </>
  )
}
