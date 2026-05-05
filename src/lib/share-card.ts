export interface ShareCardData {
  displayName: string
  rank: string // 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  totalXp: number
  currentStreak: number
  lessonsCompleted: number
  totalLessons: number
  achievementsEarned: number
  totalAchievements: number
  activeTitle: string
  avatarUrl?: string
}

const CARD_WIDTH = 1200
const CARD_HEIGHT = 630

const COLORS = {
  bg: '#0a0a0a',
  gridLine: 'rgba(255, 255, 255, 0.04)',
  muted: 'rgba(255, 255, 255, 0.4)',
  subtle: 'rgba(255, 255, 255, 0.6)',
  text: 'rgba(255, 255, 255, 0.9)',
  white: '#ffffff',
  separator: 'rgba(255, 255, 255, 0.08)',
}

const RANK_COLORS: Record<string, string> = {
  Bronze: 'rgba(205, 127, 50, 0.8)',
  Silver: 'rgba(192, 192, 192, 0.8)',
  Gold: 'rgba(255, 215, 0, 0.8)',
  Platinum: 'rgba(180, 200, 220, 0.9)',
  Diamond: 'rgba(185, 242, 255, 0.9)',
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = COLORS.gridLine
  ctx.lineWidth = 1

  // Vertical lines
  const vSpacing = 80
  for (let x = vSpacing; x < CARD_WIDTH; x += vSpacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, CARD_HEIGHT)
    ctx.stroke()
  }

  // Horizontal lines
  const hSpacing = 80
  for (let y = hSpacing; y < CARD_HEIGHT; y += hSpacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(CARD_WIDTH, y)
    ctx.stroke()
  }
}

function drawRankShape(ctx: CanvasRenderingContext2D, rank: string, cx: number, cy: number, size: number) {
  const color = RANK_COLORS[rank] || RANK_COLORS.Bronze
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.fillStyle = color.replace(/[\d.]+\)$/, '0.1)')

  switch (rank) {
    case 'Diamond': {
      // Diamond shape (rotated square)
      ctx.beginPath()
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size * 0.7, cy)
      ctx.lineTo(cx, cy + size)
      ctx.lineTo(cx - size * 0.7, cy)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // Inner facets
      ctx.beginPath()
      ctx.moveTo(cx, cy - size * 0.5)
      ctx.lineTo(cx + size * 0.35, cy)
      ctx.lineTo(cx, cy + size * 0.5)
      ctx.lineTo(cx - size * 0.35, cy)
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'Platinum': {
      // Pentagon
      const sides = 5
      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'Gold': {
      // Hexagon
      const sides = 6
      ctx.beginPath()
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 6
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    case 'Silver': {
      // Shield
      ctx.beginPath()
      ctx.moveTo(cx - size * 0.65, cy - size * 0.8)
      ctx.lineTo(cx + size * 0.65, cy - size * 0.8)
      ctx.lineTo(cx + size * 0.65, cy + size * 0.2)
      ctx.lineTo(cx, cy + size)
      ctx.lineTo(cx - size * 0.65, cy + size * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      break
    }
    default: {
      // Bronze: Circle
      ctx.beginPath()
      ctx.arc(cx, cy, size, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      break
    }
  }

  // Rank label inside shape
  ctx.fillStyle = color
  ctx.font = 'bold 20px "Geist", "SF Mono", "Fira Code", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(rank.toUpperCase(), cx, cy)
}

function drawInitials(ctx: CanvasRenderingContext2D, name: string, cx: number, cy: number) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)'
  ctx.beginPath()
  ctx.arc(cx, cy, 28, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = COLORS.subtle
  ctx.font = 'bold 18px "Geist", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, cx, cy)
}

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // Grid
  drawGrid(ctx)

  // Top-left: site URL
  ctx.font = '13px "Geist Mono", "SF Mono", "Fira Code", monospace'
  ctx.fillStyle = COLORS.muted
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('charlesjackson.dev', 48, 40)

  // Top-right: date
  ctx.textAlign = 'right'
  ctx.fillText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), CARD_WIDTH - 48, 40)

  // Avatar / Initials area (small, near name)
  const nameY = 120
  if (data.avatarUrl) {
    try {
      const img = await loadImage(data.avatarUrl)
      ctx.save()
      ctx.beginPath()
      ctx.arc(CARD_WIDTH / 2, nameY - 50, 28, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, CARD_WIDTH / 2 - 28, nameY - 78, 56, 56)
      ctx.restore()
    } catch {
      drawInitials(ctx, data.displayName, CARD_WIDTH / 2, nameY - 50)
    }
  } else {
    drawInitials(ctx, data.displayName, CARD_WIDTH / 2, nameY - 50)
  }

  // Display name
  ctx.font = 'bold 36px "Geist", system-ui, sans-serif'
  ctx.fillStyle = COLORS.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(data.displayName, CARD_WIDTH / 2, nameY)

  // Active title
  ctx.font = '16px "Geist Mono", "SF Mono", "Fira Code", monospace'
  ctx.fillStyle = COLORS.muted
  ctx.fillText(data.activeTitle, CARD_WIDTH / 2, nameY + 48)

  // Center: Rank badge
  const rankCenterY = 290
  drawRankShape(ctx, data.rank, CARD_WIDTH / 2, rankCenterY, 60)

  // Stats row
  const statsY = 420
  const stats = [
    { value: formatXp(data.totalXp), label: 'XP' },
    { value: `${data.currentStreak}`, label: 'DAY STREAK', prefix: '/' },
    { value: `${data.lessonsCompleted}/${data.totalLessons}`, label: 'LESSONS' },
    { value: `${data.achievementsEarned}/${data.totalAchievements}`, label: 'ACHIEVEMENTS' },
  ]

  const statWidth = CARD_WIDTH / stats.length
  stats.forEach((stat, i) => {
    const x = statWidth * i + statWidth / 2

    // Value
    ctx.font = 'bold 28px "Geist", system-ui, sans-serif'
    ctx.fillStyle = COLORS.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    const displayValue = stat.prefix ? `${stat.prefix} ${stat.value}` : stat.value
    ctx.fillText(displayValue, x, statsY)

    // Label
    ctx.font = '11px "Geist Mono", "SF Mono", "Fira Code", monospace'
    ctx.fillStyle = COLORS.muted
    ctx.fillText(stat.label, x, statsY + 38)
  })

  // Separator line (gradient)
  const sepY = 510
  const gradient = ctx.createLinearGradient(100, sepY, CARD_WIDTH - 100, sepY)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.2, COLORS.separator)
  gradient.addColorStop(0.8, COLORS.separator)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(100, sepY, CARD_WIDTH - 200, 1)

  // Bottom text
  ctx.font = '13px "Geist Mono", "SF Mono", "Fira Code", monospace'
  ctx.fillStyle = COLORS.muted
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('The Agentic SaaS Course — Built with dedication', CARD_WIDTH / 2, 540)

  // Bottom border accent
  const bottomGradient = ctx.createLinearGradient(0, CARD_HEIGHT - 3, CARD_WIDTH, CARD_HEIGHT - 3)
  bottomGradient.addColorStop(0, 'transparent')
  bottomGradient.addColorStop(0.3, RANK_COLORS[data.rank] || RANK_COLORS.Bronze)
  bottomGradient.addColorStop(0.7, RANK_COLORS[data.rank] || RANK_COLORS.Bronze)
  bottomGradient.addColorStop(1, 'transparent')
  ctx.fillStyle = bottomGradient
  ctx.fillRect(0, CARD_HEIGHT - 3, CARD_WIDTH, 3)

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
  // Web Share API with file support
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'progress-card.png', { type: 'image/png' })
    const shareData = { title, files: [file] }

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return true
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return false
        // Fall through to clipboard fallback
      }
    }
  }

  // Clipboard fallback
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
    return true
  } catch {
    // Final fallback: download
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
