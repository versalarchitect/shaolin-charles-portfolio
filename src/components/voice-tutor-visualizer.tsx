import { useRef, useEffect, useCallback } from 'react'
import type { VoiceConnectionState } from '@/hooks/use-livekit-voice'

interface VoiceTutorVisualizerProps {
  connectionState: VoiceConnectionState
  audioLevel: number
  agentAudioLevel: number
  frequencyData: Uint8Array | null
  agentFrequencyData: Uint8Array | null
  isSpeaking: boolean
  agentIsSpeaking: boolean
  size?: number
  className?: string
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function VoiceTutorVisualizer({
  connectionState,
  audioLevel,
  agentAudioLevel,
  frequencyData,
  agentFrequencyData,
  isSpeaking,
  agentIsSpeaking,
  size = 200,
  className = '',
}: VoiceTutorVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const smoothAudioRef = useRef(0)
  const smoothAgentAudioRef = useRef(0)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const getColors = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return { fg: '255, 255, 255', bg: '0, 0, 0' }
    const style = getComputedStyle(canvas)
    const effectRgb = style.getPropertyValue('--effect-rgb').trim() || '255, 255, 255'
    return { fg: effectRgb, bg: effectRgb === '255, 255, 255' ? '0, 0, 0' : '255, 255, 255' }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
      canvas.width = size * dpr
      canvas.height = size * dpr
      ctx.scale(dpr, dpr)
    }

    timeRef.current += 0.016
    const t = timeRef.current

    smoothAudioRef.current = lerp(smoothAudioRef.current, audioLevel, 0.15)
    smoothAgentAudioRef.current = lerp(smoothAgentAudioRef.current, agentAudioLevel, 0.15)

    const { fg } = getColors()
    const cx = size / 2
    const cy = size / 2
    const baseRadius = size * 0.18

    ctx.clearRect(0, 0, size, size)

    const isActive = connectionState === 'connected' || connectionState === 'reconnecting'
    const isIdle = connectionState === 'disconnected' || connectionState === 'unavailable'

    if (prefersReducedMotion.current) {
      const opacity = isActive
        ? agentIsSpeaking ? 0.25 : isSpeaking ? 0.15 : 0.08
        : 0.05
      ctx.beginPath()
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${fg}, ${opacity})`
      ctx.fill()

      if (isActive) {
        ctx.beginPath()
        ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${fg}, ${opacity * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
      animRef.current = requestAnimationFrame(draw)
      return
    }

    const ringCount = 5
    for (let i = 0; i < ringCount; i++) {
      const ringProgress = i / ringCount
      const breathe = Math.sin(t * 0.5 + ringProgress * Math.PI) * 0.05

      let radius: number
      let opacity: number
      let lineWidth: number

      if (isActive && agentIsSpeaking) {
        const agentPulse = smoothAgentAudioRef.current * 0.4
        radius = baseRadius * (1 + ringProgress * 1.2 + agentPulse * (1 - ringProgress * 0.5)) + breathe * baseRadius
        opacity = lerp(0.2, 0.04, ringProgress) * (1 + smoothAgentAudioRef.current * 1.5)
        lineWidth = lerp(2.5, 0.5, ringProgress)
      } else if (isActive && isSpeaking) {
        const userPulse = smoothAudioRef.current * 0.3
        radius = baseRadius * (1 + ringProgress * 0.9 - userPulse * ringProgress * 0.2) + breathe * baseRadius
        opacity = lerp(0.12, 0.03, ringProgress) * (1 + smoothAudioRef.current)
        lineWidth = lerp(2, 0.5, ringProgress)
      } else if (isActive) {
        radius = baseRadius * (1 + ringProgress * 0.8) + breathe * baseRadius
        opacity = lerp(0.08, 0.02, ringProgress)
        lineWidth = lerp(1.5, 0.5, ringProgress)
      } else if (connectionState === 'connecting') {
        const spin = (t * 2 + ringProgress * 2) % (Math.PI * 2)
        radius = baseRadius * (1 + ringProgress * 0.6) + Math.sin(spin) * 5
        opacity = lerp(0.1, 0.02, ringProgress) * (0.5 + Math.sin(t * 3) * 0.3)
        lineWidth = lerp(1.5, 0.5, ringProgress)
      } else {
        radius = baseRadius * (1 + ringProgress * 0.5) + breathe * baseRadius * 0.5
        opacity = lerp(0.05, 0.01, ringProgress)
        lineWidth = lerp(1, 0.3, ringProgress)
      }

      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${fg}, ${Math.min(1, opacity)})`
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }

    if (isActive && agentFrequencyData && agentIsSpeaking) {
      const bins = agentFrequencyData
      const sliceCount = Math.min(bins.length, 32)
      ctx.beginPath()
      for (let i = 0; i < sliceCount; i++) {
        const angle = (i / sliceCount) * Math.PI * 2 - Math.PI / 2
        const amp = bins[i] / 255
        const innerR = baseRadius * 0.9
        const outerR = baseRadius * (1 + amp * 0.8)
        const x1 = cx + Math.cos(angle) * innerR
        const y1 = cy + Math.sin(angle) * innerR
        const x2 = cx + Math.cos(angle) * outerR
        const y2 = cy + Math.sin(angle) * outerR
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
      }
      ctx.strokeStyle = `rgba(${fg}, 0.15)`
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    if (isActive && frequencyData && isSpeaking) {
      const bins = frequencyData
      const sliceCount = Math.min(bins.length, 24)
      const waveRadius = baseRadius * 1.6
      ctx.beginPath()
      for (let i = 0; i <= sliceCount; i++) {
        const angle = (i / sliceCount) * Math.PI * 2 - Math.PI / 2
        const amp = (bins[i % bins.length] || 0) / 255
        const r = waveRadius + amp * baseRadius * 0.3
        const x = cx + Math.cos(angle) * r
        const y = cy + Math.sin(angle) * r
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(${fg}, 0.08)`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    if (isActive || connectionState === 'connecting') {
      const coreOpacity = agentIsSpeaking
        ? 0.12 + smoothAgentAudioRef.current * 0.15
        : isSpeaking
          ? 0.06 + smoothAudioRef.current * 0.1
          : 0.04 + Math.sin(t * 0.8) * 0.02
      const coreRadius = baseRadius * (agentIsSpeaking ? 0.7 + smoothAgentAudioRef.current * 0.15 : 0.6)

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius)
      gradient.addColorStop(0, `rgba(${fg}, ${coreOpacity})`)
      gradient.addColorStop(1, `rgba(${fg}, 0)`)
      ctx.beginPath()
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    if (isIdle) {
      const dotOpacity = 0.06 + Math.sin(t * 0.6) * 0.03
      const dotRadius = 3 + Math.sin(t * 0.4) * 0.5
      ctx.beginPath()
      ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${fg}, ${dotOpacity})`
      ctx.fill()
    }

    animRef.current = requestAnimationFrame(draw)
  }, [
    connectionState, audioLevel, agentAudioLevel, frequencyData,
    agentFrequencyData, isSpeaking, agentIsSpeaking, size, getColors,
  ])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
