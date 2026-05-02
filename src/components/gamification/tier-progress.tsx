import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CURRICULUM } from '@/data/curriculum'
import { getLessonStatus, getTierProgress } from '@/stores/progress'

export function TierProgress() {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        Progress by Tier
      </h2>

      <div className="space-y-2">
        {CURRICULUM.map((tier) => {
          const tierProgress = getTierProgress(tier.id)
          const isComplete = tierProgress.percent === 100

          return (
            <div key={tier.id} className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isComplete && <Check className="w-3.5 h-3.5 text-foreground/60" />}
                  <span className="text-sm font-medium">{tier.id === 'prework' ? 'Prework' : `Tier ${tier.number}`}</span>
                  <span className="text-xs text-foreground/40">{tier.subtitle}</span>
                </div>
                <span className="text-xs font-mono text-foreground/50">{tierProgress.completed}/{tierProgress.total}</span>
              </div>
              <div className="relative h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden">
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-foreground/20" initial={{ width: 0 }} animate={{ width: `${tierProgress.percent}%` }} transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }} />
              </div>
              <div className="flex gap-1 mt-2.5">
                {tier.lessons.map((lesson) => {
                  const status = getLessonStatus(lesson.id)
                  const dotCls = status === 'completed' ? 'bg-foreground/30' : status === 'in_progress' ? 'bg-foreground/15 animate-pulse' : status === 'available' ? 'bg-foreground/10 hover:bg-foreground/15' : 'bg-foreground/[0.04]'
                  return (
                    <Link key={lesson.id} to={status !== 'locked' ? `/learn/${lesson.id}` : '#'} className={`flex-1 h-1.5 rounded-full transition-colors ${dotCls}`} title={`${lesson.number} — ${lesson.title}`} />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
