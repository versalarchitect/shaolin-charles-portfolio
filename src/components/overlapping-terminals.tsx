import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface TerminalContent {
  title: string
  lines: Array<{
    type: 'command' | 'output' | 'comment'
    content: string
  }>
}

interface TerminalWindowProps {
  content: TerminalContent
  style: {
    x: string
    y: string
    rotate: number
    scale: number
    zIndex: number
    opacity: number
  }
}

function TerminalWindow({ content, style }: TerminalWindowProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: style.x,
        top: style.y,
        zIndex: style.zIndex,
        opacity: style.opacity,
        transform: `scale(${style.scale}) rotate(${prefersReducedMotion ? 0 : style.rotate}deg)`,
      }}
    >
      <div className="w-[240px] md:w-[280px] rounded-lg border border-foreground/15 bg-background/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/30">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-foreground/5 border-b border-foreground/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/70 ml-2">
            {content.title}
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-3 font-mono text-[11px] leading-relaxed">
          {content.lines.map((line, index) => (
            <div
              key={index}
              className={`mb-0.5 ${
                line.type === 'command'
                  ? 'text-foreground/90'
                  : line.type === 'output'
                    ? 'text-foreground/70'
                    : 'text-foreground/50'
              }`}
            >
              {line.type === 'command' && <span className="text-green-500/80 mr-1.5">$</span>}
              {line.type === 'comment' && <span className="text-foreground/40"># </span>}
              <span>{line.content}</span>
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="text-foreground/90">
            <span className="text-green-500/80 mr-1.5">$</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3 bg-foreground/70 align-middle"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const terminalContents: TerminalContent[] = [
  {
    title: 'student@tier1 ~ foundations',
    lines: [
      { type: 'command', content: 'claude "build a tip calculator"' },
      { type: 'output', content: '✓ Generated 47 lines' },
      { type: 'output', content: '✓ All lines reviewed' },
      { type: 'output', content: '→ Principle 2: generate ≤ read' },
    ],
  },
  {
    title: 'student@tier2 ~ builder',
    lines: [
      { type: 'comment', content: 'Spec before you generate...' },
      { type: 'command', content: 'cat spec.md | claude "implement"' },
      { type: 'output', content: '✓ Auth, DB, payments wired' },
      { type: 'output', content: '✓ Deployed to Vercel' },
    ],
  },
  {
    title: 'student@tier2 ~ deploy',
    lines: [
      { type: 'command', content: 'vercel --prod' },
      { type: 'output', content: '▲ Deploying to production...' },
      { type: 'output', content: '✓ Ready: https://my-saas.vercel.app' },
    ],
  },
  {
    title: 'student@tier3 ~ operator',
    lines: [
      { type: 'command', content: 'bun run test' },
      { type: 'output', content: 'PASS src/lib/stripe.test.ts' },
      { type: 'output', content: 'PASS src/lib/auth.test.ts' },
      { type: 'output', content: '✓ 24 tests passed' },
    ],
  },
  {
    title: 'student@tier3 ~ monitor',
    lines: [
      { type: 'command', content: 'inngest dev' },
      { type: 'output', content: '✓ 3 functions registered' },
      { type: 'output', content: '✓ Webhook handler: active' },
    ],
  },
  {
    title: 'student@tier4 ~ architect',
    lines: [
      { type: 'command', content: 'cat teardown.md | wc -w' },
      { type: 'output', content: '3,847 words' },
      { type: 'output', content: '→ Principle 8: taste is the moat' },
    ],
  },
]

// Terminal positions - surrounding the center main terminal
const terminalStyles = [
  // Top left
  { x: '5%', y: '5%', rotate: -3, scale: 0.9, zIndex: 1, opacity: 0.9 },
  // Top right
  { x: '70%', y: '0%', rotate: 2, scale: 0.88, zIndex: 1, opacity: 0.75 },
  // Left side
  { x: '-5%', y: '35%', rotate: -2, scale: 0.92, zIndex: 1, opacity: 0.85 },
  // Right side
  { x: '75%', y: '30%', rotate: 3, scale: 0.85, zIndex: 1, opacity: 0.8 },
  // Bottom left
  { x: '2%', y: '65%', rotate: 2, scale: 0.87, zIndex: 1, opacity: 0.7 },
  // Bottom right
  { x: '72%', y: '60%', rotate: -2.5, scale: 0.9, zIndex: 1, opacity: 0.9 },
  // Far top center-left
  { x: '25%', y: '-5%', rotate: 1, scale: 0.82, zIndex: 1, opacity: 0.65 },
  // Far bottom center-right
  { x: '55%', y: '75%', rotate: -1.5, scale: 0.85, zIndex: 1, opacity: 0.75 },
]

interface OverlappingTerminalsProps {
  className?: string
  /** Number of terminals to display */
  count?: number
}

export function OverlappingTerminals({
  className = '',
  count = 6,
}: OverlappingTerminalsProps) {
  const prefersReducedMotion = useReducedMotion()

  // Pick which terminals to show (stable selection)
  const terminalsToShow = useMemo(() => {
    return terminalContents.slice(0, Math.min(count, terminalContents.length))
  }, [count])

  if (prefersReducedMotion) return null

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />

      {terminalsToShow.map((content, index) => (
        <TerminalWindow
          key={index}
          content={content}
          style={terminalStyles[index % terminalStyles.length]}
        />
      ))}
    </div>
  )
}
