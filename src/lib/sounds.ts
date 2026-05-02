let audioCtx: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Silently fail if audio context is blocked
  }
}

export function playSound(type: 'xp' | 'combo' | 'achievement' | 'levelup' | 'critical' | 'challenge') {
  switch (type) {
    case 'xp':
      playTone(880, 0.1, 'sine', 0.08)
      break
    case 'combo':
      playTone(660, 0.08, 'square', 0.06)
      setTimeout(() => playTone(880, 0.08, 'square', 0.06), 80)
      break
    case 'achievement':
      playTone(523, 0.15, 'sine', 0.12)
      setTimeout(() => playTone(659, 0.15, 'sine', 0.12), 150)
      setTimeout(() => playTone(784, 0.2, 'sine', 0.12), 300)
      break
    case 'levelup':
      playTone(440, 0.12, 'sine', 0.1)
      setTimeout(() => playTone(554, 0.12, 'sine', 0.1), 120)
      setTimeout(() => playTone(659, 0.12, 'sine', 0.1), 240)
      setTimeout(() => playTone(880, 0.3, 'sine', 0.15), 360)
      break
    case 'critical':
      playTone(330, 0.1, 'sawtooth', 0.08)
      setTimeout(() => playTone(660, 0.1, 'sawtooth', 0.08), 80)
      setTimeout(() => playTone(990, 0.2, 'sawtooth', 0.1), 160)
      break
    case 'challenge':
      playTone(784, 0.1, 'sine', 0.1)
      setTimeout(() => playTone(988, 0.15, 'sine', 0.1), 100)
      break
  }
}
