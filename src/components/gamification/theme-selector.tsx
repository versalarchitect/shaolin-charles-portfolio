import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Check, Lock, Palette, RotateCcw } from 'lucide-react'
import { useTheme, type CosmeticTheme } from '@/components/theme-provider'
import { useProgress } from '@/stores/progress'
import { XP_LEVELS } from '@/data/curriculum'

interface CosmeticThemeDefinition {
  id: CosmeticTheme
  name: string
  description: string
  darkOnly: boolean
  unlockCondition: string
  unlockLabel: string
  /** Swatch colors [background, foreground, accent] */
  swatchColors: [string, string, string]
}

const COSMETIC_THEME_REGISTRY: CosmeticThemeDefinition[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'True black OLED aesthetic with crisper contrast',
    darkOnly: true,
    unlockCondition: 'level_gold',
    unlockLabel: 'Reach Gold level',
    swatchColors: ['#050508', '#f2f2f2', '#1e1e24'],
  },
  {
    id: 'ghost',
    name: 'Ghost',
    description: 'Ethereal, faded aesthetic with reduced visual weight',
    darkOnly: false,
    unlockCondition: 'streak_7',
    unlockLabel: '7-day streak',
    swatchColors: ['#282838', '#c8c8dc', '#363646'],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Retro CRT with green phosphor text and scanlines',
    darkOnly: true,
    unlockCondition: 'level_platinum',
    unlockLabel: 'Reach Platinum level',
    swatchColors: ['#0a140a', '#33ff33', '#1a3d1a'],
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    description: 'Technical drawing aesthetic with grid paper',
    darkOnly: false,
    unlockCondition: 'lessons_10',
    unlockLabel: 'Complete 10 lessons',
    swatchColors: ['#1a2a4a', '#d8e4ff', '#2a3a5a'],
  },
]

function isThemeUnlocked(condition: string, progress: ReturnType<typeof useProgress>): boolean {
  const completedCount = Object.values(progress.lessonProgress).filter(p => p.status === 'completed').length

  switch (condition) {
    case 'level_gold': {
      const goldLevel = XP_LEVELS.find(l => l.name === 'Gold')
      return goldLevel ? progress.totalXp >= goldLevel.minXp : false
    }
    case 'level_platinum': {
      const platLevel = XP_LEVELS.find(l => l.name === 'Platinum')
      return platLevel ? progress.totalXp >= platLevel.minXp : false
    }
    case 'streak_7':
      return progress.longestStreak >= 7
    case 'lessons_10':
      return completedCount >= 10
    default:
      return false
  }
}

function ThemeSwatch({ colors }: { colors: [string, string, string] }) {
  return (
    <div
      className="w-full h-16 rounded-lg border border-foreground/[0.08] overflow-hidden relative"
      style={{ backgroundColor: colors[0] }}
    >
      {/* Text line previews */}
      <div className="absolute inset-0 p-3 flex flex-col justify-center gap-1.5">
        <div
          className="h-2 rounded-full w-3/4"
          style={{ backgroundColor: colors[1], opacity: 0.9 }}
        />
        <div
          className="h-1.5 rounded-full w-1/2"
          style={{ backgroundColor: colors[1], opacity: 0.4 }}
        />
        <div
          className="h-1.5 rounded-full w-2/3"
          style={{ backgroundColor: colors[1], opacity: 0.3 }}
        />
      </div>
      {/* Accent card preview */}
      <div
        className="absolute bottom-2 right-2 w-8 h-8 rounded"
        style={{ backgroundColor: colors[2], border: `1px solid ${colors[1]}20` }}
      />
    </div>
  )
}

export function ThemeSelector() {
  const { cosmeticTheme, setCosmeticTheme, resolvedTheme } = useTheme()
  const progress = useProgress()
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-foreground/60" />
          <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
            {t('themeSelector.title')}
          </h2>
        </div>
        {cosmeticTheme && (
          <motion.button
            onClick={() => setCosmeticTheme(null)}
            aria-label="Reset cosmetic theme to default"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs font-mono text-foreground/60 hover:text-foreground hover:border-foreground/20 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-3 h-3" />
            {t('themeSelector.reset')}
          </motion.button>
        )}
      </div>

      <div role="radiogroup" aria-label="Cosmetic theme selection" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {COSMETIC_THEME_REGISTRY.map((themeDef) => {
          const unlocked = isThemeUnlocked(themeDef.unlockCondition, progress)
          const isActive = cosmeticTheme === themeDef.id
          const isDarkOnlyBlocked = themeDef.darkOnly && resolvedTheme === 'light'

          return (
            <motion.button
              key={themeDef.id}
              role="radio"
              aria-checked={isActive}
              aria-label={`${themeDef.name} theme${!unlocked ? ' (locked)' : isDarkOnlyBlocked ? ' (dark mode only)' : ''}`}
              onClick={() => {
                if (!unlocked || isDarkOnlyBlocked) return
                setCosmeticTheme(isActive ? null : themeDef.id)
              }}
              className={`
                relative rounded-xl border p-3 text-left transition-all
                ${isActive
                  ? 'border-foreground/30 bg-foreground/[0.04]'
                  : unlocked && !isDarkOnlyBlocked
                    ? 'border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.03]'
                    : 'border-foreground/[0.06] bg-foreground/[0.01] opacity-60 cursor-not-allowed'
                }
              `}
              whileHover={unlocked && !isDarkOnlyBlocked ? { scale: 1.01 } : undefined}
              whileTap={unlocked && !isDarkOnlyBlocked ? { scale: 0.99 } : undefined}
              disabled={!unlocked || isDarkOnlyBlocked}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <Check className="w-3 h-3 text-foreground/80" />
                </motion.div>
              )}

              {/* Lock indicator */}
              {!unlocked && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-foreground/40" />
                </div>
              )}

              {/* Swatch preview */}
              <ThemeSwatch colors={themeDef.swatchColors} />

              {/* Theme info */}
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground/90">
                    {themeDef.name}
                  </span>
                  {themeDef.darkOnly && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/10 text-foreground/40">
                      DARK
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  {themeDef.description}
                </p>
              </div>

              {/* Unlock requirement */}
              {!unlocked && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-foreground/40">
                  <Lock className="w-3 h-3" />
                  <span>{themeDef.unlockLabel}</span>
                </div>
              )}

              {/* Dark-only warning in light mode */}
              {unlocked && isDarkOnlyBlocked && (
                <div className="mt-2 text-[10px] font-mono text-foreground/40">
                  Switch to dark mode to use
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
