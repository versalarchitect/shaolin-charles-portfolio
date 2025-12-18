import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Floating tech badges with staggered animations
export function FloatingBadges() {
  const badges = [
    { text: 'React', x: '10%', y: '15%', delay: 0 },
    { text: 'TypeScript', x: '85%', y: '20%', delay: 0.5 },
    { text: 'Supabase', x: '75%', y: '70%', delay: 1 },
    { text: 'Nx', x: '15%', y: '75%', delay: 1.5 },
    { text: 'Tailwind', x: '50%', y: '10%', delay: 2 },
    { text: 'Node.js', x: '5%', y: '45%', delay: 2.5 },
    { text: 'PostgreSQL', x: '90%', y: '45%', delay: 3 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.text}
          className="absolute"
          style={{ left: badge.x, top: badge.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: badge.delay, duration: 0.5 }}
        >
          <motion.div
            className="px-3 py-1.5 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full text-xs font-mono text-foreground/40"
            animate={{
              y: [0, -15, 0],
              rotate: [0, i % 2 === 0 ? 3 : -3, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          >
            {badge.text}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

// Floating geometric shapes
export function FloatingShapes() {
  const shapes = [
    { type: 'circle', size: 100, x: '20%', y: '30%', duration: 20 },
    { type: 'circle', size: 60, x: '80%', y: '60%', duration: 25 },
    { type: 'square', size: 40, x: '70%', y: '20%', duration: 18 },
    { type: 'square', size: 80, x: '10%', y: '70%', duration: 22 },
    { type: 'circle', size: 120, x: '50%', y: '80%', duration: 30 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.type === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.03)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Animated dots grid
export function FloatingDots() {
  const [dots, setDots] = useState<Array<{ x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const newDots = []
    for (let i = 0; i < 50; i++) {
      newDots.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      })
    }
    setDots(newDots)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground/10"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: dot.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Floating code snippets
export function FloatingCode() {
  const snippets = [
    { code: 'const data = await fetch()', x: '5%', y: '25%' },
    { code: '<Component />', x: '80%', y: '15%' },
    { code: 'export default', x: '70%', y: '75%' },
    { code: 'async function()', x: '15%', y: '80%' },
    { code: 'useState()', x: '85%', y: '50%' },
    { code: 'return { }', x: '8%', y: '55%' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[10px] text-foreground/10"
          style={{ left: snippet.x, top: snippet.y }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        >
          {snippet.code}
        </motion.div>
      ))}
    </div>
  )
}

// Floating lines/connections
export function FloatingLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 20}%`}
            y1="0%"
            x2={`${30 + i * 15}%`}
            y2="100%"
            stroke="url(#line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Orbiting elements around a center point
export function OrbitingElements() {
  const items = ['React', 'TS', 'DB', 'API']

  return (
    <div className="relative w-64 h-64">
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground/20" />

      {/* Orbit path */}
      <div className="absolute inset-4 rounded-full border border-foreground/5" />

      {/* Orbiting items */}
      {items.map((item, i) => (
        <motion.div
          key={item}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 5,
          }}
        >
          <div
            className="absolute px-2 py-1 bg-foreground/5 rounded text-[10px] font-mono text-foreground/30"
            style={{ transform: `translateX(${100}px)` }}
          >
            {item}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Pulse rings effect
export function PulseRings({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-foreground/10"
          animate={{
            scale: [1, 2, 2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
      <div className="relative w-full h-full rounded-full bg-foreground/5" />
    </div>
  )
}
