import { useMemo } from 'react'
import { motion } from 'framer-motion'

export type NodeShape = 'rect' | 'diamond' | 'rounded' | 'pill'

export interface FlowNode {
  id: string
  label: string
  sublabel?: string
  shape?: NodeShape
  highlight?: boolean
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface FlowDiagramData {
  nodes: FlowNode[]
  edges: FlowEdge[]
  direction?: 'TB' | 'LR'
}

interface FlowDiagramProps extends FlowDiagramData {
  animated?: boolean
  className?: string
}

interface Pos {
  x: number
  y: number
  w: number
  h: number
}

const DIMS = {
  TB: { nw: 148, nh: 44, hg: 40, vg: 56 },
  LR: { nw: 100, nh: 44, hg: 24, vg: 40 },
}
const DIAMOND = 68
const PAD = 24

function layoutGraph(
  nodes: FlowNode[],
  edges: FlowEdge[],
  dir: 'TB' | 'LR',
): { positions: Map<string, Pos>; width: number; height: number } {
  const d = DIMS[dir]
  const adj = new Map<string, string[]>()
  const indeg = new Map<string, number>()

  for (const n of nodes) {
    adj.set(n.id, [])
    indeg.set(n.id, 0)
  }
  for (const e of edges) {
    adj.get(e.from)?.push(e.to)
    indeg.set(e.to, (indeg.get(e.to) ?? 0) + 1)
  }

  const layer = new Map<string, number>()
  const q: string[] = []

  for (const [id, deg] of indeg) {
    if (deg === 0) {
      q.push(id)
      layer.set(id, 0)
    }
  }
  if (q.length === 0 && nodes.length > 0) {
    q.push(nodes[0].id)
    layer.set(nodes[0].id, 0)
  }

  let qi = 0
  while (qi < q.length) {
    const cur = q[qi++]
    const cl = layer.get(cur)!
    for (const nxt of adj.get(cur) ?? []) {
      const prev = layer.get(nxt)
      if (prev === undefined) {
        layer.set(nxt, cl + 1)
        q.push(nxt)
      } else if (cl + 1 > prev) {
        layer.set(nxt, cl + 1)
      }
    }
  }
  for (const n of nodes) {
    if (!layer.has(n.id)) layer.set(n.id, 0)
  }

  const groups = new Map<number, FlowNode[]>()
  let maxL = 0
  for (const n of nodes) {
    const l = layer.get(n.id)!
    maxL = Math.max(maxL, l)
    if (!groups.has(l)) groups.set(l, [])
    groups.get(l)!.push(n)
  }

  let maxPerLayer = 1
  for (let l = 0; l <= maxL; l++) {
    maxPerLayer = Math.max(maxPerLayer, (groups.get(l) ?? []).length)
  }

  const numLayers = maxL + 1
  const positions = new Map<string, Pos>()

  if (dir === 'TB') {
    const totalW = maxPerLayer * d.nw + (maxPerLayer - 1) * d.hg + PAD * 2
    const totalH = numLayers * d.nh + (numLayers - 1) * d.vg + PAD * 2

    for (let l = 0; l <= maxL; l++) {
      const grp = groups.get(l) ?? []
      const layerW = grp.length * d.nw + (grp.length - 1) * d.hg
      const startX = (totalW - layerW) / 2

      grp.forEach((n, i) => {
        const w = n.shape === 'diamond' ? DIAMOND : d.nw
        const h = n.shape === 'diamond' ? DIAMOND : d.nh
        positions.set(n.id, {
          x: startX + i * (d.nw + d.hg) + d.nw / 2,
          y: PAD + l * (d.nh + d.vg) + d.nh / 2,
          w,
          h,
        })
      })
    }
    return { positions, width: totalW, height: totalH }
  }

  const totalW = numLayers * d.nw + (numLayers - 1) * d.hg + PAD * 2
  const totalH = maxPerLayer * d.nh + (maxPerLayer - 1) * d.vg + PAD * 2

  for (let l = 0; l <= maxL; l++) {
    const grp = groups.get(l) ?? []
    const layerH = grp.length * d.nh + (grp.length - 1) * d.vg
    const startY = (totalH - layerH) / 2

    grp.forEach((n, i) => {
      const w = n.shape === 'diamond' ? DIAMOND : d.nw
      const h = n.shape === 'diamond' ? DIAMOND : d.nh
      positions.set(n.id, {
        x: PAD + l * (d.nw + d.hg) + d.nw / 2,
        y: startY + i * (d.nh + d.vg) + d.nh / 2,
        w,
        h,
      })
    })
  }
  return { positions, width: totalW, height: totalH }
}

function buildEdgePath(from: Pos, to: Pos, dir: 'TB' | 'LR'): string {
  if (dir === 'LR') {
    const sx = from.x + from.w / 2
    const sy = from.y
    const ex = to.x - to.w / 2
    const ey = to.y
    const mx = (sx + ex) / 2
    return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`
  }
  const sx = from.x
  const sy = from.y + from.h / 2
  const ex = to.x
  const ey = to.y - to.h / 2
  const my = (sy + ey) / 2
  return `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`
}

function DiagramNode({
  node,
  pos,
  index,
  animated,
}: {
  node: FlowNode
  pos: Pos
  index: number
  animated: boolean
}) {
  const shape = node.shape ?? 'rect'
  const isDiamond = shape === 'diamond'

  const radius = {
    rect: 'rounded-lg',
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
    diamond: 'rounded-md',
  }[shape]

  const bg = node.highlight
    ? 'bg-foreground/[0.08] border-foreground/20'
    : 'bg-foreground/[0.03] border-foreground/[0.10]'

  return (
    <motion.div
      className={`absolute flex items-center justify-center border ${radius} ${bg}`}
      style={{
        left: pos.x - pos.w / 2,
        top: pos.y - pos.h / 2,
        width: pos.w,
        height: pos.h,
        ...(isDiamond ? { transform: 'rotate(45deg)' } : {}),
      }}
      initial={animated ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className="flex flex-col items-center text-center px-1.5"
        style={isDiamond ? { transform: 'rotate(-45deg)' } : undefined}
      >
        <span
          className={`text-[11px] font-mono leading-tight ${
            node.highlight
              ? 'text-foreground/90 font-semibold'
              : 'text-foreground/70'
          }`}
        >
          {node.label}
        </span>
        {node.sublabel && (
          <span className="text-[9px] font-mono text-foreground/40 leading-tight mt-0.5">
            {node.sublabel}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function FlowDiagram({
  nodes,
  edges,
  direction = 'TB',
  animated = true,
  className,
}: FlowDiagramProps) {
  const markerId = useMemo(
    () => `fd-${Math.random().toString(36).slice(2, 8)}`,
    [],
  )

  const { positions, width, height } = useMemo(
    () => layoutGraph(nodes, edges, direction),
    [nodes, edges, direction],
  )

  return (
    <div className={`overflow-x-auto ${className ?? ''}`}>
      <div
        className="relative mx-auto"
        style={{ width, height, minWidth: width }}
      >
        <svg
          className="absolute inset-0 pointer-events-none text-foreground"
          width={width}
          height={height}
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="currentColor"
                fillOpacity={0.25}
              />
            </marker>
          </defs>
          {edges.map((edge, i) => {
            const from = positions.get(edge.from)
            const to = positions.get(edge.to)
            if (!from || !to) return null
            const d = buildEdgePath(from, to, direction)
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            const labelOffset =
              direction === 'TB'
                ? {
                    x: from.x !== to.x ? (from.x < to.x ? -14 : 14) : 14,
                    y: -6,
                  }
                : {
                    x: 0,
                    y: from.y !== to.y ? (from.y < to.y ? -8 : 8) : -8,
                  }

            return (
              <motion.g
                key={`${edge.from}-${edge.to}`}
                initial={animated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.4 }}
              >
                <path
                  d={d}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray={edge.dashed ? '6,4' : undefined}
                  markerEnd={`url(#${markerId})`}
                />
                {edge.label && (
                  <text
                    x={mx + labelOffset.x}
                    y={my + labelOffset.y}
                    textAnchor="middle"
                    fill="currentColor"
                    fillOpacity={0.35}
                    style={{ fontSize: 10, fontFamily: 'monospace' }}
                  >
                    {edge.label}
                  </text>
                )}
              </motion.g>
            )
          })}
        </svg>

        {nodes.map((node, i) => {
          const pos = positions.get(node.id)
          if (!pos) return null
          return (
            <DiagramNode
              key={node.id}
              node={node}
              pos={pos}
              index={i}
              animated={animated}
            />
          )
        })}
      </div>
    </div>
  )
}
