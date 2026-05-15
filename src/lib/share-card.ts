export interface ShareCardData {
  displayName: string
  rank: string
  totalXp: number
  currentStreak: number
  lessonsCompleted: number
  totalLessons: number
  achievementsEarned: number
  totalAchievements: number
  activeTitle: string
  avatarUrl?: string
}

const W = 1200
const H = 630

const RANK_THEMES: Record<string, { primary: string; glow: string; bgTint: string }> = {
  Starter: {
    primary: 'rgba(205, 127, 50, 0.9)',
    glow: 'rgba(205, 127, 50, 0.15)',
    bgTint: 'rgba(205, 127, 50, 0.03)',
  },
  Builder: {
    primary: 'rgba(192, 192, 210, 0.9)',
    glow: 'rgba(192, 192, 210, 0.15)',
    bgTint: 'rgba(192, 192, 210, 0.03)',
  },
  Leader: {
    primary: 'rgba(255, 215, 0, 0.9)',
    glow: 'rgba(255, 215, 0, 0.12)',
    bgTint: 'rgba(255, 215, 0, 0.03)',
  },
  Strategist: {
    primary: 'rgba(160, 200, 230, 0.9)',
    glow: 'rgba(160, 200, 230, 0.12)',
    bgTint: 'rgba(160, 200, 230, 0.03)',
  },
  Visionary: {
    primary: 'rgba(185, 242, 255, 0.95)',
    glow: 'rgba(185, 242, 255, 0.15)',
    bgTint: 'rgba(185, 242, 255, 0.03)',
  },
}

function getTheme(rank: string) {
  return RANK_THEMES[rank] || RANK_THEMES.Starter
}

function drawBackground(ctx: CanvasRenderingContext2D, rank: string) {
  const theme = getTheme(rank)

  // Base: deep gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0c0c0e')
  bg.addColorStop(0.5, '#0a0a0c')
  bg.addColorStop(1, '#08080a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Ambient rank-colored glow behind center
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, 320)
  glow.addColorStop(0, theme.glow)
  glow.addColorStop(0.5, theme.bgTint)
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // Subtle corner vignettes
  const corners = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
  ]
  for (const [cx, cy] of corners) {
    const v = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400)
    v.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
    v.addColorStop(1, 'transparent')
    ctx.fillStyle = v
    ctx.fillRect(0, 0, W, H)
  }
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
  ctx.lineWidth = 1

  const spacing = 80
  for (let x = spacing; x < W; x += spacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = spacing; y < H; y += spacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }

  // "+" markers at corners of content area
  const pad = 40
  const markerSize = 8
  const markerColor = 'rgba(255, 255, 255, 0.08)'
  const positions = [
    [pad, pad],
    [W - pad, pad],
    [pad, H - pad],
    [W - pad, H - pad],
  ]

  ctx.strokeStyle = markerColor
  ctx.lineWidth = 1.5
  for (const [mx, my] of positions) {
    ctx.beginPath()
    ctx.moveTo(mx - markerSize, my)
    ctx.lineTo(mx + markerSize, my)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(mx, my - markerSize)
    ctx.lineTo(mx, my + markerSize)
    ctx.stroke()
  }
}

function drawCornerBrackets(ctx: CanvasRenderingContext2D, rank: string) {
  const theme = getTheme(rank)
  const inset = 24
  const len = 40
  const color = theme.primary.replace(/[\d.]+\)$/, '0.25)')

  ctx.strokeStyle = color
  ctx.lineWidth = 1.5

  // Top-left
  ctx.beginPath()
  ctx.moveTo(inset, inset + len)
  ctx.lineTo(inset, inset)
  ctx.lineTo(inset + len, inset)
  ctx.stroke()

  // Top-right
  ctx.beginPath()
  ctx.moveTo(W - inset - len, inset)
  ctx.lineTo(W - inset, inset)
  ctx.lineTo(W - inset, inset + len)
  ctx.stroke()

  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(inset, H - inset - len)
  ctx.lineTo(inset, H - inset)
  ctx.lineTo(inset + len, H - inset)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(W - inset - len, H - inset)
  ctx.lineTo(W - inset, H - inset)
  ctx.lineTo(W - inset, H - inset - len)
  ctx.stroke()
}

function drawTopAccent(ctx: CanvasRenderingContext2D, rank: string) {
  const theme = getTheme(rank)
  const g = ctx.createLinearGradient(0, 0, W, 0)
  g.addColorStop(0, 'transparent')
  g.addColorStop(0.25, theme.primary.replace(/[\d.]+\)$/, '0.6)'))
  g.addColorStop(0.5, theme.primary)
  g.addColorStop(0.75, theme.primary.replace(/[\d.]+\)$/, '0.6)'))
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, 2)

  // Soft glow beneath
  const glow = ctx.createLinearGradient(0, 0, 0, 30)
  glow.addColorStop(0, theme.primary.replace(/[\d.]+\)$/, '0.08)'))
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, 30)
}

function drawBottomAccent(ctx: CanvasRenderingContext2D, rank: string) {
  const theme = getTheme(rank)
  const g = ctx.createLinearGradient(0, H - 2, W, H - 2)
  g.addColorStop(0, 'transparent')
  g.addColorStop(0.25, theme.primary.replace(/[\d.]+\)$/, '0.6)'))
  g.addColorStop(0.5, theme.primary)
  g.addColorStop(0.75, theme.primary.replace(/[\d.]+\)$/, '0.6)'))
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, H - 2, W, 2)
}

function drawAvatar(ctx: CanvasRenderingContext2D, name: string, rank: string, cx: number, cy: number) {
  const theme = getTheme(rank)
  const radius = 32

  // Outer glow ring
  ctx.strokeStyle = theme.primary.replace(/[\d.]+\)$/, '0.35)')
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2)
  ctx.stroke()

  // Inner circle bg
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Initials
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = 'bold 22px "Geist", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, cx, cy)
}

function drawRankBadge(ctx: CanvasRenderingContext2D, rank: string, cx: number, cy: number) {
  const theme = getTheme(rank)

  // Ambient glow behind badge
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90)
  glow.addColorStop(0, theme.glow)
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy, 90, 0, Math.PI * 2)
  ctx.fill()

  // Badge background pill
  const labelText = rank.toUpperCase()
  ctx.font = 'bold 14px "Geist Mono", "SF Mono", monospace'
  const textWidth = ctx.measureText(labelText).width
  const pillW = textWidth + 40
  const pillH = 36
  const pillR = pillH / 2

  // Pill fill
  ctx.fillStyle = theme.primary.replace(/[\d.]+\)$/, '0.12)')
  roundRect(ctx, cx - pillW / 2, cy - pillH / 2, pillW, pillH, pillR)
  ctx.fill()

  // Pill border
  ctx.strokeStyle = theme.primary.replace(/[\d.]+\)$/, '0.5)')
  ctx.lineWidth = 1.5
  roundRect(ctx, cx - pillW / 2, cy - pillH / 2, pillW, pillH, pillR)
  ctx.stroke()

  // Label
  ctx.fillStyle = theme.primary
  ctx.font = 'bold 14px "Geist Mono", "SF Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(labelText, cx, cy + 1)

  // Decorative dots flanking the badge
  const dotY = cy
  const dotOffset = pillW / 2 + 16
  ctx.fillStyle = theme.primary.replace(/[\d.]+\)$/, '0.3)')
  ctx.beginPath()
  ctx.arc(cx - dotOffset, dotY, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + dotOffset, dotY, 2, 0, Math.PI * 2)
  ctx.fill()

  // Thin connecting lines from dots outward
  ctx.strokeStyle = theme.primary.replace(/[\d.]+\)$/, '0.1)')
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - dotOffset - 4, dotY)
  ctx.lineTo(cx - dotOffset - 40, dotY)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + dotOffset + 4, dotY)
  ctx.lineTo(cx + dotOffset + 40, dotY)
  ctx.stroke()
}

function drawStatCards(ctx: CanvasRenderingContext2D, stats: { value: string; label: string }[], y: number, rank: string) {
  const theme = getTheme(rank)
  const cardCount = stats.length
  const totalWidth = W - 120
  const gap = 12
  const cardW = (totalWidth - gap * (cardCount - 1)) / cardCount
  const cardH = 72
  const startX = 60
  const radius = 12

  stats.forEach((stat, i) => {
    const x = startX + i * (cardW + gap)

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
    roundRect(ctx, x, y, cardW, cardH, radius)
    ctx.fill()

    // Card border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.lineWidth = 1
    roundRect(ctx, x, y, cardW, cardH, radius)
    ctx.stroke()

    // Value
    ctx.font = 'bold 26px "Geist", system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(stat.value, x + cardW / 2, y + 14)

    // Label
    ctx.font = '10px "Geist Mono", "SF Mono", monospace'
    ctx.fillStyle = theme.primary.replace(/[\d.]+\)$/, '0.5)')
    ctx.textAlign = 'center'
    ctx.fillText(stat.label, x + cardW / 2, y + 48)
  })
}

function drawSeparator(ctx: CanvasRenderingContext2D, y: number) {
  const g = ctx.createLinearGradient(80, y, W - 80, y)
  g.addColorStop(0, 'transparent')
  g.addColorStop(0.15, 'rgba(255, 255, 255, 0.06)')
  g.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)')
  g.addColorStop(0.85, 'rgba(255, 255, 255, 0.06)')
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(80, y, W - 160, 1)
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function drawProgressBar(ctx: CanvasRenderingContext2D, percent: number, y: number, rank: string) {
  const theme = getTheme(rank)
  const barX = 60
  const barW = W - 120
  const barH = 6
  const radius = barH / 2

  // Track
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  roundRect(ctx, barX, y, barW, barH, radius)
  ctx.fill()

  // Fill
  if (percent > 0) {
    const fillW = Math.max(barH, barW * (percent / 100))
    const grad = ctx.createLinearGradient(barX, y, barX + fillW, y)
    grad.addColorStop(0, theme.primary.replace(/[\d.]+\)$/, '0.3)'))
    grad.addColorStop(1, theme.primary.replace(/[\d.]+\)$/, '0.6)'))
    ctx.fillStyle = grad
    roundRect(ctx, barX, y, fillW, barH, radius)
    ctx.fill()
  }

  // Percentage label
  ctx.font = '10px "Geist Mono", "SF Mono", monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillText(`${Math.round(percent)}% complete`, barX + barW, y + barH + 6)
}

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // === Background layers ===
  drawBackground(ctx, data.rank)
  drawGrid(ctx)
  drawTopAccent(ctx, data.rank)
  drawBottomAccent(ctx, data.rank)
  drawCornerBrackets(ctx, data.rank)

  // === Header row ===
  ctx.font = '12px "Geist Mono", "SF Mono", monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('charlesjackson.dev', 56, 48)

  ctx.textAlign = 'right'
  ctx.fillText(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    W - 56,
    48,
  )

  // === Avatar ===
  const avatarY = 130
  if (data.avatarUrl) {
    try {
      const img = await loadImage(data.avatarUrl)
      const r = 32
      ctx.save()
      ctx.beginPath()
      ctx.arc(W / 2, avatarY, r, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, W / 2 - r, avatarY - r, r * 2, r * 2)
      ctx.restore()

      const theme = getTheme(data.rank)
      ctx.strokeStyle = theme.primary.replace(/[\d.]+\)$/, '0.35)')
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(W / 2, avatarY, r + 6, 0, Math.PI * 2)
      ctx.stroke()
    } catch {
      drawAvatar(ctx, data.displayName, data.rank, W / 2, avatarY)
    }
  } else {
    drawAvatar(ctx, data.displayName, data.rank, W / 2, avatarY)
  }

  // === Display name ===
  const nameY = avatarY + 52
  ctx.font = 'bold 32px "Geist", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(data.displayName, W / 2, nameY)

  // === Active title ===
  ctx.font = '14px "Geist Mono", "SF Mono", monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.fillText(data.activeTitle, W / 2, nameY + 42)

  // === Rank badge ===
  drawRankBadge(ctx, data.rank, W / 2, nameY + 110)

  // === Stats ===
  const statsY = nameY + 170
  const stats = [
    { value: formatXp(data.totalXp), label: 'XP' },
    { value: `${data.currentStreak}`, label: 'DAY STREAK' },
    { value: `${data.lessonsCompleted}/${data.totalLessons}`, label: 'LESSONS' },
    { value: `${data.achievementsEarned}/${data.totalAchievements}`, label: 'ACHIEVEMENTS' },
  ]
  drawStatCards(ctx, stats, statsY, data.rank)

  // === Progress bar ===
  const completionPercent = data.totalLessons > 0 ? (data.lessonsCompleted / data.totalLessons) * 100 : 0
  drawProgressBar(ctx, completionPercent, statsY + 96, data.rank)

  // === Separator ===
  drawSeparator(ctx, statsY + 132)

  // === Footer ===
  ctx.font = '12px "Geist Mono", "SF Mono", monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('The Agentic SaaS Course', W / 2, statsY + 150)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to generate share card image'))
    }, 'image/png')
  })
}

export function downloadShareCard(blob: Blob, filename?: string): void {
  const date = new Date().toISOString().split('T')[0]
  const name = filename || `charlesjackson-dev-progress-${date}.png`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function shareCard(blob: Blob, title: string): Promise<boolean> {
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'progress-card.png', { type: 'image/png' })
    const shareData = { title, files: [file] }

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return true
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return false
      }
    }
  }

  try {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch {
    downloadShareCard(blob)
    return true
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
  return xp.toString()
}
