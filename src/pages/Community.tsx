import { useState } from 'react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
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
  Zap,
  Send,
} from 'lucide-react'
import {
  BlurFadeIn,
  AnimatedNumber,
  SpotlightCard,
} from '@/components/ui/aaa-effects'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface DiscussionThread {
  id: string
  title: string
  author: string
  authorInitial: string
  tier: string
  replies: number
  lastActivity: string
  isPinned: boolean
  category: string
  preview: string
}

const threads: DiscussionThread[] = [
  {
    id: 'welcome',
    title: 'Welcome & Introductions',
    author: 'Charles Jackson',
    authorInitial: 'CJ',
    tier: 'Instructor',
    replies: 34,
    lastActivity: '2h ago',
    isPinned: true,
    category: 'general',
    preview: 'New here? Drop a quick intro — what you\'re building, what tier you\'re on, and one thing you want to ship this month.',
  },
  {
    id: 'study-group',
    title: 'Tier 1 Study Group — Weekly Check-ins',
    author: 'Sarah K.',
    authorInitial: 'SK',
    tier: 'Tier 1',
    replies: 21,
    lastActivity: '4h ago',
    isPinned: true,
    category: 'study-group',
    preview: 'Every Monday we sync on progress. Post your blockers and wins from the week.',
  },
  {
    id: 'mcp-config',
    title: 'Struggling with MCP server configuration',
    author: 'Devin R.',
    authorInitial: 'DR',
    tier: 'Tier 1',
    replies: 12,
    lastActivity: '6h ago',
    isPinned: false,
    category: 'help',
    preview: 'Getting a connection timeout when trying to register my first MCP tool. Running Node 22 on Mac.',
  },
  {
    id: 'capstone-feedback',
    title: 'My Tier 2 capstone — feedback wanted',
    author: 'Amara T.',
    authorInitial: 'AT',
    tier: 'Tier 2',
    replies: 8,
    lastActivity: '1d ago',
    isPinned: false,
    category: 'showcase',
    preview: 'Built an AI-powered invoice processor. Looking for feedback on my agent orchestration pattern.',
  },
  {
    id: 'parallel-agents',
    title: 'Best practices for parallel agent workflows',
    author: 'James L.',
    authorInitial: 'JL',
    tier: 'Tier 3',
    replies: 15,
    lastActivity: '1d ago',
    isPinned: false,
    category: 'discussion',
    preview: 'When do you parallelize vs. chain agents? I\'ve been experimenting with fan-out patterns.',
  },
  {
    id: 'postmortem',
    title: 'Postmortem: My first production incident',
    author: 'Nina W.',
    authorInitial: 'NW',
    tier: 'Tier 3',
    replies: 19,
    lastActivity: '2d ago',
    isPinned: false,
    category: 'showcase',
    preview: 'An agent went rogue in prod and created 400 duplicate records. Here\'s what I learned.',
  },
  {
    id: 'teardown-tips',
    title: 'Tier 4 teardown methodology tips',
    author: 'Marcus B.',
    authorInitial: 'MB',
    tier: 'Tier 4',
    replies: 7,
    lastActivity: '3d ago',
    isPinned: false,
    category: 'discussion',
    preview: 'Sharing my approach to tearing down complex agent architectures for analysis.',
  },
  {
    id: 'inngest-patterns',
    title: 'Inngest v3 event-driven patterns — what changed?',
    author: 'Priya S.',
    authorInitial: 'PS',
    tier: 'Tier 3',
    replies: 11,
    lastActivity: '4d ago',
    isPinned: false,
    category: 'help',
    preview: 'The new step.ai integration in v3 changes how we handle retries. Anyone migrated yet?',
  },
]

interface Announcement {
  id: string
  title: string
  content: string
  timeAgo: string
  type: 'update' | 'recording' | 'info'
}

const announcements: Announcement[] = [
  {
    id: 'tier3-update',
    title: 'Tier 3 content update: New lesson on Inngest v3',
    content:
      'Lesson 3.8 has been updated with the latest Inngest v3 patterns including the new step.ai integration. Re-watch if you already completed this section.',
    timeAgo: '2 days ago',
    type: 'update',
  },
  {
    id: 'recording',
    title: 'Office hours recording from April 24 now available',
    content:
      'This session covered common Tier 2 capstone blockers, Stripe webhook debugging, and a live teardown of a student project. Link in the course portal.',
    timeAgo: '5 days ago',
    type: 'recording',
  },
  {
    id: 'welcome-guidelines',
    title: 'Welcome to the community! Read the guidelines',
    content:
      'New here? Start by introducing yourself in the Welcome thread. Check the pinned guidelines below before posting. We keep signal high and noise low.',
    timeAgo: '2 weeks ago',
    type: 'info',
  },
]

interface MemberSpotlight {
  id: string
  name: string
  tier: string
  streak: number
  xp: number
  quote: string
  initial: string
}

const spotlightMembers: MemberSpotlight[] = [
  {
    id: 'james',
    name: 'James L.',
    tier: 'Tier 3',
    streak: 21,
    xp: 4120,
    quote: 'Shipping my first production incident postmortem felt like a real milestone.',
    initial: 'JL',
  },
  {
    id: 'nina',
    name: 'Nina W.',
    tier: 'Tier 3',
    streak: 9,
    xp: 3580,
    quote: 'The community feedback on my capstone caught things I never would have seen.',
    initial: 'NW',
  },
  {
    id: 'sarah',
    name: 'Sarah K.',
    tier: 'Tier 2',
    streak: 14,
    xp: 2340,
    quote: 'The principles-first approach changed how I think about every tool I use.',
    initial: 'SK',
  },
]

const guidelines = [
  'Be respectful. Critique ideas, not people.',
  'No sharing course content outside the community.',
  'Help each other — teaching is the best way to learn.',
  'Use thread topics. Keep discussions focused.',
  'Share wins and failures. Both are valuable.',
  'Tag your tier so others can give context-appropriate help.',
]

const categories: Record<string, { label: string; color: string }> = {
  general: { label: 'General', color: 'text-foreground/50 bg-foreground/[0.06]' },
  'study-group': { label: 'Study Group', color: 'text-blue-400/80 bg-blue-500/10' },
  help: { label: 'Help', color: 'text-amber-400/80 bg-amber-500/10' },
  showcase: { label: 'Showcase', color: 'text-emerald-400/80 bg-emerald-500/10' },
  discussion: { label: 'Discussion', color: 'text-purple-400/80 bg-purple-500/10' },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_XP = 5000

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

function StatsHeader() {
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
          <Button size="lg" className="h-11 px-6 font-mono group sm:flex-shrink-0" asChild>
            <a
              href="mailto:hello@charlesjackson.dev?subject=Office%20Hours%20Question"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Question
            </a>
          </Button>
        </div>

        {/* Stats row */}
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
            <p className="text-xl font-mono font-semibold"><AnimatedNumber value={threads.length} duration={1.2} /></p>
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

function DiscussionsTab() {
  const pinnedThreads = threads.filter((t) => t.isPinned)
  const regularThreads = threads.filter((t) => !t.isPinned)

  return (
    <div className="space-y-2">
      {/* Pinned */}
      {pinnedThreads.map((thread, i) => (
        <ThreadCard key={thread.id} thread={thread} index={i} />
      ))}

      {pinnedThreads.length > 0 && regularThreads.length > 0 && (
        <div className="h-px bg-gradient-to-r from-foreground/[0.06] via-foreground/[0.03] to-transparent my-3" />
      )}

      {/* Regular */}
      {regularThreads.map((thread, i) => (
        <ThreadCard key={thread.id} thread={thread} index={pinnedThreads.length + i} />
      ))}
    </div>
  )
}

function ThreadCard({ thread, index }: { thread: DiscussionThread; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <SpotlightCard className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.015] hover:bg-foreground/[0.035] hover:border-foreground/[0.12] transition-all duration-200 cursor-pointer group">
        <div className="p-4">
          <div className="flex gap-3">
            <Avatar initials={thread.authorInitial} />
            <div className="flex-1 min-w-0">
              {/* Top row: title + meta */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {thread.isPinned && (
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

              {/* Bottom row: meta */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-foreground/50 font-medium">{thread.author}</span>
                <TierBadge tier={thread.tier} />
                <CategoryTag category={thread.category} />
                <span className="text-foreground/15 hidden sm:inline">·</span>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-foreground/30 font-mono">
                  <MessageSquare className="w-3 h-3" />
                  {thread.replies}
                </div>
                <span className="text-foreground/15 hidden sm:inline">·</span>
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-foreground/30 font-mono">
                  <Clock className="w-3 h-3" />
                  {thread.lastActivity}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>
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
            {/* Timeline line */}
            {i < announcements.length - 1 && (
              <div className="absolute left-[7px] top-6 bottom-0 w-px bg-foreground/[0.06]" />
            )}
            {/* Timeline dot */}
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

function OfficeHoursCard() {
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

          <Button size="sm" className="w-full h-9 font-mono text-xs group" asChild>
            <a
              href="mailto:hello@charlesjackson.dev?subject=Office%20Hours%20Question"
              target="_blank"
              rel="noopener noreferrer"
            >
              Submit a Question
              <MessageSquare className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        </div>
      </SpotlightCard>
    </BlurFadeIn>
  )
}

function LeaderboardCard() {
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
              {/* Rank */}
              <span className={`w-5 text-center font-mono font-bold text-sm ${
                i === 0 ? 'text-foreground/60' : 'text-foreground/25'
              }`}>
                {i + 1}
              </span>

              {/* Avatar */}
              <Avatar initials={member.initial} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-medium text-foreground/80 truncate">{member.name}</span>
                  <TierBadge tier={member.tier} />
                </div>

                {/* XP bar */}
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

              {/* Streak */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Flame className="w-3 h-3 text-foreground/25" />
                <span className="text-[10px] font-mono text-foreground/30">{member.streak}d</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spotlight quote */}
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
// Tab System
// ---------------------------------------------------------------------------

type Tab = 'discussions' | 'announcements'

const tabs: { id: Tab; label: string; icon: typeof MessageSquare; count?: number }[] = [
  { id: 'discussions', label: 'Discussions', icon: MessageSquare, count: threads.length },
  { id: 'announcements', label: 'Announcements', icon: Bell, count: announcements.length },
]

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function Community() {
  const [activeTab, setActiveTab] = useState<Tab>('discussions')

  return (
    <>
      <SEO
        title="Community — The Agentic SaaS Course"
        description="Connect with fellow builders. Weekly office hours, discussion threads, and member spotlights for paid members of The Agentic SaaS Course."
        path="/community"
        image="/og-image.png"
        imageAlt="Community — The Agentic SaaS Course"
        keywords="agentic saas community, course community, developer community, office hours, peer feedback, claude code students"
        noindex
      />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <StatsHeader />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
            {/* ============================================ */}
            {/* Main Column */}
            {/* ============================================ */}
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
                  {activeTab === 'discussions' && <DiscussionsTab />}
                  {activeTab === 'announcements' && <AnnouncementsTab />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ============================================ */}
            {/* Sidebar */}
            {/* ============================================ */}
            <div className="space-y-5">
              <OfficeHoursCard />
              <LeaderboardCard />
              <GuidelinesCard />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
