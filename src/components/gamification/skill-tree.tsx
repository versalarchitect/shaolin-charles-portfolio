import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { CURRICULUM } from '@/data/curriculum'
import type { Lesson, Tier } from '@/data/curriculum'
import { useProgress, getLessonStatus, getTierProgress } from '@/stores/progress'

interface SkillTreeProps {
  compact?: boolean
}

const NODE_SIZE = 32
const NODE_SIZE_COMPACT = 20
const CAPSTONE_SIZE = 40
const CAPSTONE_SIZE_COMPACT = 26
const NODE_GAP = 16
const NODE_GAP_COMPACT = 10
const TIER_GAP = 48
const TIER_GAP_COMPACT = 28
const LABEL_WIDTH = 120
const LABEL_WIDTH_COMPACT = 72

interface NodeLayout {
  lesson: Lesson
  tier: Tier
  x: number
  y: number
  size: number
  isCapstone: boolean
}

function useLayout(compact: boolean) {
  return useMemo(() => {
    const nodeSize = compact ? NODE_SIZE_COMPACT : NODE_SIZE
    const capstoneSize = compact ? CAPSTONE_SIZE_COMPACT : CAPSTONE_SIZE
    const gap = compact ? NODE_GAP_COMPACT : NODE_GAP
    const tierGap = compact ? TIER_GAP_COMPACT : TIER_GAP
    const labelW = compact ? LABEL_WIDTH_COMPACT : LABEL_WIDTH

    const nodes: NodeLayout[] = []
    let currentY = 0

    for (const tier of CURRICULUM) {
      const rowWidth = tier.lessons.reduce((sum, l, i) => {
        const s = l.isCapstone ? capstoneSize : nodeSize
        return sum + s + (i < tier.lessons.length - 1 ? gap : 0)
      }, 0)

      let currentX = labelW
      const rowCenterY = currentY + capstoneSize / 2

      for (const lesson of tier.lessons) {
        const s = lesson.isCapstone ? capstoneSize : nodeSize
        nodes.push({
          lesson,
          tier,
          x: currentX + s / 2,
          y: rowCenterY,
          size: s,
          isCapstone: lesson.isCapstone,
        })
        currentX += s + gap
      }

      currentY += capstoneSize + tierGap
    }

    const totalWidth = Math.max(
      ...CURRICULUM.map((tier) => {
        return (
          labelW +
          tier.lessons.reduce((sum, l, i) => {
            const s = l.isCapstone ? capstoneSize : nodeSize
            return sum + s + (i < tier.lessons.length - 1 ? gap : 0)
          }, 0)
        )
      })
    )

    const totalHeight = currentY - tierGap + 8

    return { nodes, totalWidth, totalHeight, labelW, tierGap, capstoneSize }
  }, [compact])
}

function NodeCircle({
  node,
  compact,
  onHover,
  onLeave,
}: {
  node: NodeLayout
  compact: boolean
  onHover: (node: NodeLayout, rect: DOMRect) => void
  onLeave: () => void
}) {
  const status = getLessonStatus(node.lesson.id)
  const r = node.size / 2

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<SVGGElement>) => {
      if (compact) return
      const rect = (e.currentTarget as SVGGElement).getBoundingClientRect()
      onHover(node, rect)
    },
    [compact, node, onHover]
  )

  const isClickable = status !== 'locked'

  const inner = (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      className={isClickable ? 'cursor-pointer' : 'cursor-default'}
    >
      {/* Background circle */}
      {status === 'completed' ? (
        <circle
          cx={node.x}
          cy={node.y}
          r={r}
          className="fill-foreground/[0.15]"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeWidth={1.5}
        />
      ) : status === 'in_progress' ? (
        <>
          <circle
            cx={node.x}
            cy={node.y}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={2}
          >
            <animate
              attributeName="stroke-opacity"
              values="0.15;0.35;0.15"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={node.x}
            cy={node.y}
            r={r - 3}
            className="fill-foreground/[0.06]"
          />
        </>
      ) : status === 'available' ? (
        <circle
          cx={node.x}
          cy={node.y}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1.5}
        />
      ) : (
        <circle
          cx={node.x}
          cy={node.y}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.06}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      )}

      {/* Inner icon */}
      {status === 'completed' ? (
        <foreignObject
          x={node.x - (compact ? 5 : 7)}
          y={node.y - (compact ? 5 : 7)}
          width={compact ? 10 : 14}
          height={compact ? 10 : 14}
        >
          <Check
            className="text-foreground/50"
            style={{ width: '100%', height: '100%' }}
          />
        </foreignObject>
      ) : status === 'locked' ? (
        !compact && (
          <foreignObject
            x={node.x - 5}
            y={node.y - 5}
            width={10}
            height={10}
          >
            <Lock
              className="text-foreground/20"
              style={{ width: '100%', height: '100%' }}
            />
          </foreignObject>
        )
      ) : null}

      {/* Capstone ring */}
      {node.isCapstone && (
        <circle
          cx={node.x}
          cy={node.y}
          r={r + 3}
          fill="none"
          stroke="currentColor"
          strokeOpacity={status === 'completed' ? 0.15 : 0.06}
          strokeWidth={1}
          strokeDasharray={status === 'completed' ? 'none' : '4 2'}
        />
      )}
    </g>
  )

  if (isClickable) {
    return (
      <Link to={`/course/learn/${node.lesson.id}`}>
        {inner}
      </Link>
    )
  }

  return inner
}

export function SkillTree({ compact = false }: SkillTreeProps) {
  useProgress()

  const { nodes, totalWidth, totalHeight, labelW, tierGap, capstoneSize } =
    useLayout(compact)
  const [tooltip, setTooltip] = useState<{
    node: NodeLayout
    x: number
    y: number
  } | null>(null)

  const handleHover = useCallback(
    (node: NodeLayout, rect: DOMRect) => {
      setTooltip({ node, x: rect.left + rect.width / 2, y: rect.top })
    },
    []
  )

  const handleLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  // Build connections
  const connections = useMemo(() => {
    const lines: {
      x1: number
      y1: number
      x2: number
      y2: number
      completed: boolean
      type: 'horizontal' | 'vertical'
    }[] = []

    for (let tIdx = 0; tIdx < CURRICULUM.length; tIdx++) {
      const tier = CURRICULUM[tIdx]

      // Horizontal connections within tier
      for (let lIdx = 0; lIdx < tier.lessons.length - 1; lIdx++) {
        const from = nodes.find(
          (n) => n.lesson.id === tier.lessons[lIdx].id
        )!
        const to = nodes.find(
          (n) => n.lesson.id === tier.lessons[lIdx + 1].id
        )!
        const fromStatus = getLessonStatus(from.lesson.id)
        const toStatus = getLessonStatus(to.lesson.id)
        const completed =
          fromStatus === 'completed' && toStatus === 'completed'

        lines.push({
          x1: from.x + from.size / 2,
          y1: from.y,
          x2: to.x - to.size / 2,
          y2: to.y,
          completed,
          type: 'horizontal',
        })
      }

      // Vertical connection to next tier (from last lesson to first of next tier)
      if (tIdx < CURRICULUM.length - 1) {
        const lastLesson = tier.lessons[tier.lessons.length - 1]
        const nextTier = CURRICULUM[tIdx + 1]
        const firstNext = nextTier.lessons[0]

        const fromNode = nodes.find((n) => n.lesson.id === lastLesson.id)!
        const toNode = nodes.find((n) => n.lesson.id === firstNext.id)!

        const fromStatus = getLessonStatus(fromNode.lesson.id)
        const toStatus = getLessonStatus(toNode.lesson.id)
        const completed =
          fromStatus === 'completed' && toStatus === 'completed'

        // Draw a path: down from last node, then left to first node of next row
        lines.push({
          x1: fromNode.x,
          y1: fromNode.y + fromNode.size / 2 + (fromNode.isCapstone ? 3 : 0),
          x2: toNode.x,
          y2: toNode.y - toNode.size / 2,
          completed,
          type: 'vertical',
        })
      }
    }

    return lines
  }, [nodes])

  // Tier label positions
  const tierLabels = useMemo(() => {
    return CURRICULUM.map((tier, tIdx) => {
      const tierNodes = nodes.filter((n) => n.tier.id === tier.id)
      const centerY =
        tierNodes.length > 0
          ? tierNodes[0].y
          : tIdx * (capstoneSize + tierGap) + capstoneSize / 2
      const tp = getTierProgress(tier.id)
      return {
        tier,
        y: centerY,
        completed: tp.completed,
        total: tp.total,
      }
    })
  }, [nodes, capstoneSize, tierGap])

  return (
    <div className="relative">
      {/* Section header */}
      {!compact && (
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40 mb-3">
          Skill Tree
        </h2>
      )}

      <div
        className={`rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-x-auto ${
          compact ? 'p-3' : 'p-5'
        }`}
      >
        <svg
          width={totalWidth + 16}
          height={totalHeight}
          viewBox={`0 0 ${totalWidth + 16} ${totalHeight}`}
          className="block"
          style={{ minWidth: totalWidth + 16 }}
        >
          {/* Connections */}
          {connections.map((c, i) => {
            if (c.type === 'horizontal') {
              return (
                <line
                  key={`h-${i}`}
                  x1={c.x1}
                  y1={c.y1}
                  x2={c.x2}
                  y2={c.y2}
                  stroke="currentColor"
                  strokeOpacity={c.completed ? 0.15 : 0.06}
                  strokeWidth={1.5}
                  strokeDasharray={c.completed ? 'none' : '4 3'}
                />
              )
            }

            // Vertical / cross-tier connection with curved path
            const midY = (c.y1 + c.y2) / 2
            return (
              <path
                key={`v-${i}`}
                d={`M ${c.x1} ${c.y1} C ${c.x1} ${midY}, ${c.x2} ${midY}, ${c.x2} ${c.y2}`}
                fill="none"
                stroke="currentColor"
                strokeOpacity={c.completed ? 0.15 : 0.06}
                strokeWidth={1.5}
                strokeDasharray={c.completed ? 'none' : '4 3'}
              />
            )
          })}

          {/* Tier labels */}
          {tierLabels.map((tl) => (
            <g key={tl.tier.id}>
              <text
                x={compact ? 4 : 8}
                y={tl.y - (compact ? 4 : 6)}
                className="fill-foreground/50"
                fontSize={compact ? 9 : 11}
                fontFamily="var(--font-mono, monospace)"
              >
                {tl.tier.id === 'prework'
                  ? 'Prework'
                  : compact
                  ? `T${tl.tier.number}`
                  : `Tier ${tl.tier.number}`}
              </text>
              <text
                x={compact ? 4 : 8}
                y={tl.y + (compact ? 8 : 10)}
                className="fill-foreground/30"
                fontSize={compact ? 8 : 10}
                fontFamily="var(--font-mono, monospace)"
              >
                {tl.completed}/{tl.total}
              </text>
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <NodeCircle
              key={node.lesson.id}
              node={node}
              compact={compact}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
        </svg>
      </div>

      {/* Tooltip (non-compact only) */}
      {tooltip && !compact && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="px-3 py-2 rounded-lg bg-background border border-foreground/10 shadow-lg max-w-[220px]">
            <p className="text-[10px] font-mono text-foreground/40 mb-0.5">
              {tooltip.node.lesson.number}
              {tooltip.node.isCapstone && ' -- Capstone'}
            </p>
            <p className="text-xs font-medium text-foreground/80 leading-tight">
              {tooltip.node.lesson.title}
            </p>
            <p className="text-[10px] font-mono text-foreground/40 mt-1">
              {tooltip.node.lesson.duration}m -- +{tooltip.node.lesson.xp} XP
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
