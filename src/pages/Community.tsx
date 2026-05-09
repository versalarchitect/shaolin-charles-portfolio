import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import {
  MessageSquare,
  Calendar,
  Pin,
  Users,
  Bell,
  Video,
  ChevronRight,
  Shield,
  Flame,
  Star,
  ChevronDown,
  Trophy,
  TrendingUp,
  Hash,
  Clock,
  Send,
  Plus,
  X,
  Loader2,
} from 'lucide-react'
import {
  BlurFadeIn,
  AnimatedNumber,
  SpotlightCard,
} from '@/components/ui/aaa-effects'
import {
  announcements,
  spotlightMembers,
  guidelines,
  categories,
  MAX_XP,
} from '@/data/community'
import { useAuth } from '@/hooks/use-auth'
import { useProgress, getLevel } from '@/stores/progress'
import {
  fetchThreads,
  createThread,
  timeAgo,
  type Thread,
} from '@/lib/community-api'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TierBadge({ tier }: { tier: string }) {
  const isInstructor = tier === 'Instructor'
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded ${
        isInstructor
          ? 'bg-foreground/15 text-foreground/90'
          : 'bg-foreground/[0.06] text-foreground/50'
      }`}
    >
      {tier}
    </span>
  )
}

function CategoryTag({ category }: { category: string }) {
  const cat = categories[category] || categories.general
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-full ${cat.color}`}>
      <Hash className="w-2.5 h-2.5" />
      {cat.label}
    </span>
  )
}

function Avatar({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-foreground/[0.08] border border-foreground/10 flex items-center justify-center font-mono font-bold text-foreground/50 flex-shrink-0`}>
      {initials}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatsHeader({ threadCount, onNewThread, onSubmitQuestion }: { threadCount: number; onNewThread: () => void; onSubmitQuestion: () => void }) {
  return (
    <BlurFadeIn delay={0}>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Community
            </h1>
            <p className="text-muted-foreground">
              Connect with fellow builders. Get answers. Ship together.
            </p>
          </div>
          <div className="flex gap-2 sm:flex-shrink-0">
            <Button size="lg" className="h-11 px-5 font-mono group" onClick={onNewThread}>
              <Plus className="mr-2 h-4 w-4" />
              New Thread
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-5 font-mono group" onClick={onSubmitQuestion}>
              <Send className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Submit Question</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Users className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/30">Members</span>
            </div>
            <p className="text-xl font-mono font-semibold"><AnimatedNumber value={47} duration={1.2} /></p>
          </div>
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/30">Online</span>
            </div>
            <p className="text-xl font-mono font-semibold"><AnimatedNumber value={12} duration={1.2} /></p>
          </div>
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/30">Threads</span>
            </div>
            <p className="text-xl font-mono font-semibold"><AnimatedNumber value={threadCount} duration={1.2} /></p>
          </div>
          <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/30">This week</span>
            </div>
            <p className="text-xl font-mono font-semibold">+<AnimatedNumber value={23} duration={1.2} /></p>
          </div>
        </div>
      </div>
    </BlurFadeIn>
  )
}

function DiscussionsTab({ threads, loading }: { threads: Thread[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
      </div>
    )
  }

  const pinnedThreads = threads.filter((t) => t.is_pinned)
  const regularThreads = threads.filter((t) => !t.is_pinned)

  return (
    <div className="space-y-2">
      {pinnedThreads.map((thread, i) => (
        <ThreadCard key={thread.id} thread={thread} index={i} />
      ))}

      {pinnedThreads.length > 0 && regularThreads.length > 0 && (
        <div className="h-px bg-gradient-to-r from-foreground/[0.06] via-foreground/[0.03] to-transparent my-3" />
      )}

      {regularThreads.map((thread, i) => (
        <ThreadCard key={thread.id} thread={thread} index={pinnedThreads.length + i} />
      ))}

      {threads.length === 0 && (
        <div className="text-center py-16 text-foreground/30">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-foreground/15" />
          <p className="text-sm font-mono">No threads yet. Start a discussion!</p>
        </div>
      )}
    </div>
  )
}

function ThreadCard({ thread, index }: { thread: Thread; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link to={`/course/community/thread/${thread.id}`} className="block">
        <SpotlightCard className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.015] hover:bg-foreground/[0.035] hover:border-foreground/[0.12] transition-all duration-200 cursor-pointer group">
          <div className="p-4">
            <div className="flex gap-3">
              <Avatar initials={thread.author_initial} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {thread.is_pinned && (
                        <Pin className="w-3 h-3 text-foreground/30 rotate-45 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-sm text-foreground/90 truncate">
                        {thread.title}
                      </h3>
                    </div>
                    <p className="text-xs text-foreground/40 line-clamp-1 mb-2">
                      {thread.preview}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-foreground/40 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-foreground/50 font-medium">{thread.author_name}</span>
                  <TierBadge tier={thread.author_tier} />
                  <CategoryTag category={thread.category} />
                  <span className="text-foreground/15 hidden sm:inline">·</span>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-foreground/30 font-mono">
                    <MessageSquare className="w-3 h-3" />
                    {thread.reply_count}
                  </div>
                  <span className="text-foreground/15 hidden sm:inline">·</span>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-foreground/30 font-mono">
                    <Clock className="w-3 h-3" />
                    {timeAgo(thread.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  )
}

function AnnouncementsTab() {
  return (
    <div className="space-y-4">
      {announcements.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
        >
          <div className="relative pl-6">
            {i < announcements.length - 1 && (
              <div className="absolute left-[7px] top-6 bottom-0 w-px bg-foreground/[0.06]" />
            )}
            <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-foreground/[0.12] bg-background flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full ${
                a.type === 'update' ? 'bg-blue-400/70' :
                a.type === 'recording' ? 'bg-emerald-400/70' :
                'bg-foreground/30'
              }`} />
            </div>

            <div className="pb-6">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <h3 className="font-semibold text-sm text-foreground/90">{a.title}</h3>
                <span className="text-[10px] font-mono text-foreground/25 whitespace-nowrap flex-shrink-0">{a.timeAgo}</span>
              </div>
              <p className="text-sm text-foreground/50 leading-relaxed mb-2">{a.content}</p>
              <div className="flex items-center gap-2">
                <Avatar initials="CJ" size="sm" />
                <span className="text-[11px] font-mono text-foreground/35">Charles Jackson</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function OfficeHoursCard({ onSubmitQuestion }: { onSubmitQuestion: () => void }) {
  return (
    <BlurFadeIn delay={0.15}>
      <SpotlightCard className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08]">
              <Video className="w-4 h-4 text-foreground/60" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Office Hours</h3>
              <p className="text-[11px] text-foreground/40 font-mono">with Charles</p>
            </div>
          </div>

          <div className="rounded-lg bg-foreground/[0.03] border border-foreground/[0.06] p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-3.5 h-3.5 text-foreground/40" />
              <span className="text-xs font-mono text-foreground/60">Every Thursday</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono">7 PM</span>
              <span className="text-sm font-mono text-foreground/40">ET</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-foreground/30 font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Recurring weekly
            </div>
          </div>

          <p className="text-xs text-foreground/40 leading-relaxed mb-3">
            Submit questions before each session. Priority goes to capstone students.
          </p>

          <Button size="sm" className="w-full h-9 font-mono text-xs group" onClick={onSubmitQuestion}>
            Submit a Question
            <MessageSquare className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </SpotlightCard>
    </BlurFadeIn>
  )
}

function LeaderboardCard() {
  const progress = useProgress()
  const level = getLevel()
  const { user } = useAuth()

  const userRank = spotlightMembers.filter((m) => m.xp > progress.totalXp).length + 1
  const userInitials = user?.email?.split('@')[0].slice(0, 2).toUpperCase() ?? '?'

  return (
    <BlurFadeIn delay={0.2}>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
        <div className="px-4 py-3 border-b border-foreground/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-foreground/40" />
            <h3 className="text-sm font-semibold">Leaderboard</h3>
          </div>
          <span className="text-[10px] font-mono text-foreground/25 uppercase tracking-wider">This month</span>
        </div>

        <div className="p-2">
          {spotlightMembers.map((member, i) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-foreground/[0.03] transition-colors group"
            >
              <span className={`w-5 text-center font-mono font-bold text-sm ${
                i === 0 ? 'text-foreground/60' : 'text-foreground/25'
              }`}>
                {i + 1}
              </span>

              <Avatar initials={member.initial} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-medium text-foreground/80 truncate">{member.name}</span>
                  <TierBadge tier={member.tier} />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foreground/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${(member.xp / MAX_XP) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-foreground/30 flex-shrink-0">{member.xp.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Flame className="w-3 h-3 text-foreground/25" />
                <span className="text-[10px] font-mono text-foreground/30">{member.streak}d</span>
              </div>
            </div>
          ))}

          {/* Current user position */}
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-foreground/[0.04] border border-foreground/10 mt-2">
            <span className="w-5 text-center font-mono font-bold text-sm text-foreground/50">
              {userRank}
            </span>

            <Avatar initials={userInitials} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-medium text-foreground/90 truncate">You</span>
                <TierBadge tier={level.name} />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-foreground/25"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.totalXp / MAX_XP) * 100}%` }}
                    transition={{ delay: 0.6, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  />
                </div>
                <span className="text-[10px] font-mono text-foreground/50 flex-shrink-0">{progress.totalXp.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Flame className="w-3 h-3 text-foreground/40" />
              <span className="text-[10px] font-mono text-foreground/50">{progress.currentStreak}d</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-foreground/[0.06]">
          <div className="flex items-start gap-2">
            <Star className="w-3.5 h-3.5 text-foreground/20 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-foreground/40 italic leading-relaxed">
                &ldquo;{spotlightMembers[0].quote}&rdquo;
              </p>
              <span className="text-[10px] font-mono text-foreground/25 mt-1 inline-block">
                — {spotlightMembers[0].name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BlurFadeIn>
  )
}

function GuidelinesCard() {
  const [open, setOpen] = useState(false)

  return (
    <BlurFadeIn delay={0.25}>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-foreground/[0.03] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-foreground/40" />
            <h3 className="text-sm font-semibold">Guidelines</h3>
          </div>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-foreground/30" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1">
                <ul className="space-y-2">
                  {guidelines.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/50">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground/[0.08] mt-0.5">
                        <span className="text-[9px] font-mono font-bold text-foreground/40">{i + 1}</span>
                      </span>
                      <span className="text-foreground/55 leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurFadeIn>
  )
}

// ---------------------------------------------------------------------------
// New Thread Modal
// ---------------------------------------------------------------------------

function NewThreadModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (thread: Thread) => void
}) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('discussion')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !user || submitting) return

    setSubmitting(true)
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
    const initial = displayName.slice(0, 2).toUpperCase()
    const tier = user.user_metadata?.tier || 'Tier 1'
    const preview = content.slice(0, 150).replace(/\n/g, ' ')

    try {
      const thread = await createThread(
        { title: title.trim(), content: content.trim(), preview, category },
        { id: user.id, name: displayName, initial, tier },
      )
      onCreated(thread)
      setTitle('')
      setContent('')
      setCategory('discussion')
      onClose()
      toast.success('Thread created')
    } catch {
      toast.error('Failed to create thread')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl rounded-xl border border-foreground/[0.1] bg-background shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/[0.06]">
                <h2 className="text-lg font-semibold">New Thread</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-foreground/[0.06] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-foreground/40" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Thread title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-4 py-3 text-sm text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-foreground/[0.15] transition-all font-mono"
                    autoFocus
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Write your post... (supports **bold** and `code`)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-4 py-3 text-sm text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-foreground/[0.15] transition-all font-mono resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-foreground/40 uppercase tracking-wider block mb-2">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categories).map(([key, cat]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border transition-all cursor-pointer ${
                          category === key
                            ? `${cat.color} border-foreground/[0.15]`
                            : 'text-foreground/30 bg-foreground/[0.02] border-foreground/[0.06] hover:border-foreground/[0.1]'
                        }`}
                      >
                        <Hash className="w-3 h-3" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-foreground/[0.06]">
                <Button type="button" variant="ghost" size="sm" onClick={onClose} className="font-mono text-xs">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="font-mono text-xs px-6"
                  disabled={!title.trim() || !content.trim() || submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {submitting ? 'Posting...' : 'Post Thread'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------------------------------------------------------------------------
// Submit Question Modal
// ---------------------------------------------------------------------------

function SubmitQuestionModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { user } = useAuth()
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !user || submitting) return

    setSubmitting(true)
    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'

    try {
      const subject = encodeURIComponent(`Office Hours Question from ${displayName}`)
      const body = encodeURIComponent(
        `Question:\n${question.trim()}\n\n${context.trim() ? `Context:\n${context.trim()}` : ''}`,
      )
      window.open(`mailto:hello@charlesjackson.dev?subject=${subject}&body=${body}`, '_blank')
      toast.success('Question submitted — check your email client')
      setQuestion('')
      setContext('')
      onOpenChange(false)
    } catch {
      toast.error('Failed to submit question')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-mono">Submit a Question</DialogTitle>
            <DialogDescription>
              Ask a question for the next Office Hours session. Priority goes to capstone students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-xs font-mono uppercase tracking-wider text-foreground/50">
                Your Question
              </Label>
              <Input
                id="question"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="font-mono text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context" className="text-xs font-mono uppercase tracking-wider text-foreground/50">
                Context <span className="text-foreground/25">(optional)</span>
              </Label>
              <Textarea
                id="context"
                placeholder="Any relevant context — what you've tried, error messages, links to your code..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                className="font-mono text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="font-mono text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="font-mono text-xs px-6"
              disabled={!question.trim() || submitting}
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1.5" />
              )}
              {submitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Tab System
// ---------------------------------------------------------------------------

type Tab = 'discussions' | 'announcements'

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function Community() {
  const [activeTab, setActiveTab] = useState<Tab>('discussions')
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewThread, setShowNewThread] = useState(false)
  const [showSubmitQuestion, setShowSubmitQuestion] = useState(false)

  const loadThreads = useCallback(async () => {
    try {
      const data = await fetchThreads()
      setThreads(data)
    } catch {
      toast.error('Failed to load threads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadThreads()
  }, [loadThreads])

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare; count?: number }[] = [
    { id: 'discussions', label: 'Discussions', icon: MessageSquare, count: threads.length },
    { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
  ]

  function handleThreadCreated(thread: Thread) {
    setThreads((prev) => [thread, ...prev])
  }

  return (
    <>
      <SEO
        title="Community — The Agentic SaaS Course"
        description="Connect with fellow builders. Weekly office hours, discussion threads, and member spotlights for paid members of The Agentic SaaS Course."
        path="/course/community"
        image="/og-image.png"
        imageAlt="Community — The Agentic SaaS Course"
        keywords="agentic saas community, course community, developer community, office hours, peer feedback, claude code students"
        noindex
      />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <StatsHeader threadCount={threads.length} onNewThread={() => setShowNewThread(true)} onSubmitQuestion={() => setShowSubmitQuestion(true)} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* Main Column */}
            <div>
              {/* Tabs */}
              <BlurFadeIn delay={0.1}>
                <div className="flex items-center gap-1 mb-5 border-b border-foreground/[0.06] pb-px">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'text-foreground'
                            : 'text-foreground/40 hover:text-foreground/70'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-mono">{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-foreground/10 text-foreground/60'
                              : 'bg-foreground/[0.04] text-foreground/25'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="community-tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/60 rounded-full"
                            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>
              </BlurFadeIn>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'discussions' && <DiscussionsTab threads={threads} loading={loading} />}
                  {activeTab === 'announcements' && <AnnouncementsTab />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <OfficeHoursCard onSubmitQuestion={() => setShowSubmitQuestion(true)} />
              <LeaderboardCard />
              <GuidelinesCard />
            </div>
          </div>
        </div>
      </div>

      <NewThreadModal
        open={showNewThread}
        onClose={() => setShowNewThread(false)}
        onCreated={handleThreadCreated}
      />

      <SubmitQuestionModal
        open={showSubmitQuestion}
        onOpenChange={setShowSubmitQuestion}
      />
    </>
  )
}
