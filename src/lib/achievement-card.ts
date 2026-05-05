export interface AchievementCardData {
  name: string
  description: string
  icon: string // emoji
  xpReward: number
  earnedDate?: string
  userName: string
  rank: string
}

const CARD_WIDTH = 800
const CARD_HEIGHT = 400

const COLORS = {
  bg: '#0a0a0a',
  gridLine: 'rgba(255, 255, 255, 0.04)',
  border: 'rgba(255, 255, 255, 0.08)',
  muted: 'rgba(255, 255, 255, 0.4)',
  subtle: 'rgba(255, 255, 255, 0.6)',
  text: 'rgba(255, 255, 255, 0.9)',
  white: '#ffffff',
  xpBadgeBg: 'rgba(255, 255, 255, 0.06)',
  xpBadgeBorder: 'rgba(255, 255, 255, 0.12)',
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = COLORS.gridLine
  ctx.lineWidth = 1

  const spacing = 80
  for (let x = spacing; x < CARD_WIDTH; x += spacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, CARD_HEIGHT)
    ctx.stroke()
  }
  for (let y = spacing; y < CARD_HEIGHT; y += spacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(CARD_WIDTH, y)
    ctx.stroke()
  }
}

export async function generateAchievementCard(data: AchievementCardData): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // Grid
  drawGrid(ctx)

  // Border
  ctx.strokeStyle = COLORS.border
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, CARD_WIDTH - 1, CARD_HEIGHT - 1)

  // Emoji icon (centered, large)
  ctx.font = '60px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(data.icon, CARD_WIDTH / 2, 120)

  // Achievement name
  ctx.font = 'bold 24px "Geist", system-ui, sans-serif'
  ctx.fillStyle = COLORS.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(data.name, CARD_WIDTH / 2, 170)

  // Description
  ctx.font = '14px "Geist", system-ui, sans-serif'
  ctx.fillStyle = COLORS.muted
  ctx.fillText(data.description, CARD_WIDTH / 2, 206)

  // XP reward badge
  const xpText = `+${data.xpReward} XP`
  ctx.font = 'bold 14px "Geist Mono", "SF Mono", "Fira Code", monospace'
  const xpMetrics = ctx.measureText(xpText)
  const badgeW = xpMetrics.width + 24
  const badgeH = 28
  const badgeX = (CARD_WIDTH - badgeW) / 2
  const badgeY = 240

  // Badge background
  ctx.fillStyle = COLORS.xpBadgeBg
  ctx.beginPath()
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14)
  ctx.fill()
  ctx.strokeStyle = COLORS.xpBadgeBorder
  ctx.lineWidth = 1
  ctx.stroke()

  // Badge text
  ctx.fillStyle = COLORS.subtle
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(xpText, CARD_WIDTH / 2, badgeY + badgeH / 2)

  // Separator
  const sepY = 300
  const gradient = ctx.createLinearGradient(150, sepY, CARD_WIDTH - 150, sepY)
  gradient.addColorStop(0, 'transparent')
  gradient.addColorStop(0.2, COLORS.border)
  gradient.addColorStop(0.8, COLORS.border)
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(150, sepY, CARD_WIDTH - 300, 1)

  // Bottom: "Earned by {userName} · {rank}"
  ctx.font = '13px "Geist", system-ui, sans-serif'
  ctx.fillStyle = COLORS.muted
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const earnedText = `Earned by ${data.userName} · ${data.rank}`
  ctx.fillText(earnedText, CARD_WIDTH / 2, 325)

  // Site URL
  ctx.font = '12px "Geist Mono", "SF Mono", "Fira Code", monospace'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.fillText('charlesjackson.dev', CARD_WIDTH / 2, 355)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to generate achievement card image'))
    }, 'image/png')
  })
}
