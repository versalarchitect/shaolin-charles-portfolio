import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Crown, Award, Trophy, Star, Target, Check, Zap, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function LevelIcon({ levelName, className }: { levelName: string; className?: string }) {
  const icons: Record<string, LucideIcon> = { Diamond: Crown, Platinum: Award, Gold: Trophy, Silver: Star }
  const Icon = icons[levelName] || Target
  return <Icon className={className} />
}

export function StatCard({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-foreground/60" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/40">{label}</span>
      </div>
      {children}
    </div>
  )
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: ReactNode; label: string }> = {
  completed: { bg: 'bg-green-500/20', text: 'text-green-500', icon: <Check className="w-3 h-3" />, label: 'Completed' },
  in_progress: { bg: 'bg-foreground/10', text: 'text-foreground/70', icon: <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />, label: 'In Progress' },
  available: { bg: 'bg-foreground/5', text: 'text-foreground/60', icon: <Zap className="w-3 h-3" />, label: 'Available' },
  locked: { bg: 'bg-foreground/5', text: 'text-foreground/40', icon: <Lock className="w-3 h-3" />, label: 'Locked' },
}

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.locked
  return (
    <span className={`px-2.5 py-1 ${style.bg} ${style.text} text-xs font-mono rounded flex items-center gap-1.5`}>
      {style.icon}
      {style.label}
    </span>
  )
}

export function MultiplierBadge({ icon: Icon, label, secondary }: { icon: LucideIcon; label: string; secondary?: string }) {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/10 border border-foreground/15"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Icon className="w-3.5 h-3.5 text-foreground/70" />
      <span className="text-xs font-mono font-semibold text-foreground/80">{label}</span>
      {secondary && <span className="text-[9px] font-mono text-foreground/40">{secondary}</span>}
    </motion.div>
  )
}
