let audioCtx: AudioContext | null = null

// --- Sound Settings ---
const SOUND_SETTINGS_KEY = 'sound-settings'

interface SoundSettings {
  enabled: boolean
  volume: number
}

const DEFAULT_SOUND_SETTINGS: SoundSettings = { enabled: true, volume: 0.5 }

export function getSoundSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(SOUND_SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SoundSettings>
      return {
        enabled: parsed.enabled ?? DEFAULT_SOUND_SETTINGS.enabled,
        volume: parsed.volume ?? DEFAULT_SOUND_SETTINGS.volume,
      }
    }
  } catch {}
  return { ...DEFAULT_SOUND_SETTINGS }
}

function saveSoundSettings(settings: SoundSettings) {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

export function setSoundEnabled(enabled: boolean) {
  const settings = getSoundSettings()
  settings.enabled = enabled
  saveSoundSettings(settings)
}

export function setSoundVolume(volume: number) {
  const settings = getSoundSettings()
  settings.volume = Math.max(0, Math.min(1, volume))
  saveSoundSettings(settings)
}

export function toggleSounds() {
  const settings = getSoundSettings()
  settings.enabled = !settings.enabled
  saveSoundSettings(settings)
  return settings.enabled
}

// --- Notification Settings ---
const NOTIFICATION_SETTINGS_KEY = 'notification-settings'

interface NotificationSettings {
  smartTips: boolean
  streakWarnings: boolean
  dailyReward: boolean
  explorerToasts: boolean
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  smartTips: true,
  streakWarnings: true,
  dailyReward: true,
  explorerToasts: true,
}

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NotificationSettings>
      return {
        smartTips: parsed.smartTips ?? DEFAULT_NOTIFICATION_SETTINGS.smartTips,
        streakWarnings: parsed.streakWarnings ?? DEFAULT_NOTIFICATION_SETTINGS.streakWarnings,
        dailyReward: parsed.dailyReward ?? DEFAULT_NOTIFICATION_SETTINGS.dailyReward,
        explorerToasts: parsed.explorerToasts ?? DEFAULT_NOTIFICATION_SETTINGS.explorerToasts,
      }
    }
  } catch {}
  return { ...DEFAULT_NOTIFICATION_SETTINGS }
}

export function setNotificationSetting(key: keyof NotificationSettings, value: boolean) {
  const settings = getNotificationSettings()
  settings[key] = value
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
  } catch {}
}

// --- Audio Engine ---
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
    // Apply user volume setting
    const userVolume = getSoundSettings().volume
    const adjustedVolume = volume * (userVolume / 0.5) // Scale relative to default 0.5
    gain.gain.setValueAtTime(adjustedVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {
    // Silently fail if audio context is blocked
  }
}

export function playSound(type: 'xp' | 'combo' | 'achievement' | 'levelup' | 'critical' | 'challenge' | 'discovery') {
  // Respect sound enabled setting
  if (!getSoundSettings().enabled) return
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
    case 'discovery':
      // Mysterious rising arpeggio — different from achievement (which is a major triad)
      playTone(392, 0.12, 'triangle', 0.1)
      setTimeout(() => playTone(494, 0.12, 'triangle', 0.1), 100)
      setTimeout(() => playTone(587, 0.12, 'triangle', 0.1), 200)
      setTimeout(() => playTone(740, 0.15, 'triangle', 0.12), 300)
      setTimeout(() => playTone(988, 0.25, 'sine', 0.14), 420)
      break
  }
}
