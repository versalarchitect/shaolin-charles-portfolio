import {
  Lock,
  Star,
  Flame,
  Trophy,
  Crown,
  Zap,
  Target,
  Award,
  Check,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ACHIEVEMENTS } from '@/data/curriculum'
import { useProgress } from '@/stores/progress'

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  'first-lesson': Target, 'streak-3': Flame, 'streak-7': Zap, 'streak-30': Crown,
  'prework-done': Check, 'tier1-done': Star, 'tier2-done': Award, 'tier3-done': Trophy,
  'tier4-done': Crown, 'speed-learner': Zap, 'half-way': Star, 'full-course': Trophy,
}

export function AchievementsGrid() {
  const progress = useProgress()

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Achievements
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = progress.unlockedAchievements.includes(achievement.id)
          const AIcon = ACHIEVEMENT_ICONS[achievement.id] || Trophy

          return (
            <div
              key={achievement.id}
              className={`rounded-xl border p-3 text-center transition-all ${isUnlocked ? 'border-foreground/10 bg-foreground/[0.03]' : 'border-foreground/[0.08] bg-foreground/[0.02]'}`}
            >
              <div className={`mx-auto w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${isUnlocked ? 'bg-foreground/10 text-foreground/70' : 'bg-foreground/[0.06] text-foreground/40'}`}>
                {isUnlocked ? <AIcon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>
              <p className={`text-xs font-medium ${isUnlocked ? 'text-foreground/80' : 'text-foreground/50'}`}>
                {isUnlocked ? achievement.name : '???'}
              </p>
              {isUnlocked && (
                <p className="text-[10px] text-foreground/40 mt-0.5">{achievement.description}</p>
              )}
              <div className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-mono ${isUnlocked ? 'text-foreground/40' : 'text-foreground/30'}`}>
                <Zap className="w-2.5 h-2.5" />
                {achievement.xpReward} XP
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
