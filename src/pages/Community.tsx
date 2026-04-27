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
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
  StaggerContainer,
  staggerItemVariants,
  SpotlightCard,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface DiscussionThread {
  id: string
  title: string
  author: string
  tier: string
  replies: number
  lastActivity: string
  isPinned: boolean
}

const threads: DiscussionThread[] = [
  {
    id: 'welcome',
    title: 'Welcome & Introductions',
    author: 'Charles Jackson',
    tier: 'Instructor',
    replies: 34,
    lastActivity: '2 hours ago',
    isPinned: true,
  },
  {
    id: 'study-group',
    title: 'Tier 1 Study Group — Weekly Check-ins',
    author: 'Sarah K.',
    tier: 'Tier 1',
    replies: 21,
    lastActivity: '4 hours ago',
    isPinned: true,
  },
  {
    id: 'mcp-config',
    title: 'Struggling with MCP server configuration',
    author: 'Devin R.',
    tier: 'Tier 1',
    replies: 12,
    lastActivity: '6 hours ago',
    isPinned: false,
  },
  {
    id: 'capstone-feedback',
    title: 'My Tier 2 capstone — feedback wanted',
    author: 'Amara T.',
    tier: 'Tier 2',
    replies: 8,
    lastActivity: '1 day ago',
    isPinned: false,
  },
  {
    id: 'parallel-agents',
    title: 'Best practices for parallel agent workflows',
    author: 'James L.',
    tier: 'Tier 3',
    replies: 15,
    lastActivity: '1 day ago',
    isPinned: false,
  },
  {
    id: 'postmortem',
    title: 'Postmortem: My first production incident',
    author: 'Nina W.',
    tier: 'Tier 3',
    replies: 19,
    lastActivity: '2 days ago',
    isPinned: false,
  },
  {
    id: 'teardown-tips',
    title: 'Tier 4 teardown methodology tips',
    author: 'Marcus B.',
    tier: 'Tier 4',
    replies: 7,
    lastActivity: '3 days ago',
    isPinned: false,
  },
  {
    id: 'inngest-patterns',
    title: 'Inngest v3 event-driven patterns — what changed?',
    author: 'Priya S.',
    tier: 'Tier 3',
    replies: 11,
    lastActivity: '4 days ago',
    isPinned: false,
  },
]

interface Announcement {
  id: string
  title: string
  content: string
  timeAgo: string
}

const announcements: Announcement[] = [
  {
    id: 'tier3-update',
    title: 'Tier 3 content update: New lesson on Inngest v3',
    content:
      'Lesson 3.8 has been updated with the latest Inngest v3 patterns including the new step.ai integration. Re-watch if you already completed this section.',
    timeAgo: '2 days ago',
  },
  {
    id: 'recording',
    title: 'Office hours recording from April 24 now available',
    content:
      'This session covered common Tier 2 capstone blockers, Stripe webhook debugging, and a live teardown of a student project. Link in the course portal.',
    timeAgo: '5 days ago',
  },
  {
    id: 'welcome-guidelines',
    title: 'Welcome to the community! Read the guidelines',
    content:
      'New here? Start by introducing yourself in the Welcome thread. Check the pinned guidelines below before posting. We keep signal high and noise low.',
    timeAgo: '2 weeks ago',
  },
]

interface MemberSpotlight {
  id: string
  name: string
  tier: string
  streak: number
  xp: number
  quote: string
}

const spotlightMembers: MemberSpotlight[] = [
  {
    id: 'sarah',
    name: 'Sarah K.',
    tier: 'Tier 2',
    streak: 14,
    xp: 2340,
    quote: 'The principles-first approach changed how I think about every tool I use.',
  },
  {
    id: 'james',
    name: 'James L.',
    tier: 'Tier 3',
    streak: 21,
    xp: 4120,
    quote: 'Shipping my first production incident postmortem felt like a real milestone.',
  },
  {
    id: 'nina',
    name: 'Nina W.',
    tier: 'Tier 3',
    streak: 9,
    xp: 3580,
    quote: 'The community feedback on my capstone caught things I never would have seen.',
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TierBadge({ tier }: { tier: string }) {
  const isInstructor = tier === 'Instructor'
  return (
    <span
      className={`px-2 py-0.5 text-xs font-mono rounded ${
        isInstructor
          ? 'bg-foreground/15 text-foreground/90'
          : 'bg-foreground/[0.06] text-foreground/50 border border-foreground/10'
      }`}
    >
      {tier}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Community() {
  const [guidelinesOpen, setGuidelinesOpen] = useState(false)

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

      {/* ================================================================== */}
      {/* Hero */}
      {/* ================================================================== */}
      <Section
        id="community-hero"
        className="relative min-h-[50vh] flex items-center overflow-hidden"
      >
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <BlurFadeIn delay={0}>
              <div className="flex items-center gap-3 mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full">
                  <Users className="w-4 h-4 text-foreground/60" />
                  <span className="text-xs font-mono text-foreground/60">
                    <AnimatedNumber value={47} duration={1.5} /> members
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs font-mono text-foreground/60">
                    Community Active
                  </span>
                </div>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Community
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Connect with fellow builders. Get answers. Ship together.
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* ================================================================== */}
      {/* Weekly Office Hours */}
      {/* ================================================================== */}
      <Section
        id="community-office-hours"
        className="py-16 relative overflow-hidden"
      >
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn>
            <SpotlightCard className="rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
              <div className="p-6 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  {/* Left — info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Video className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                          Weekly Office Hours with Charles
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Every Thursday, 7:00 PM ET</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                      Submit your questions before each session. Priority goes
                      to students working on capstones.
                    </p>

                    <Button
                      size="lg"
                      className="h-12 px-8 font-mono group"
                      asChild
                    >
                      <a
                        href="mailto:hello@charlesjackson.dev?subject=Office%20Hours%20Question"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Submit a Question
                        <MessageSquare className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </Button>
                  </div>

                  {/* Right — next session */}
                  <div className="lg:w-64 shrink-0">
                    <div className="p-5 rounded-xl bg-foreground/[0.03] border border-foreground/[0.08]">
                      <span className="text-xs font-mono uppercase tracking-wider text-foreground/40 block mb-3">
                        Next session
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold font-mono">
                          Thu
                        </span>
                        <span className="text-lg font-mono text-muted-foreground">
                          7 PM ET
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-foreground/40 font-mono">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        Recurring weekly
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </ScrollFadeIn>
        </div>
      </Section>

      {/* ================================================================== */}
      {/* Discussion Board */}
      {/* ================================================================== */}
      <Section
        id="community-discussions"
        className="py-24 lg:py-32 relative"
      >
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-foreground/60" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Discussions
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Recent threads from the community. Jump in, share context, help
              each other ship.
            </p>
          </ScrollFadeIn>

          <StaggerContainer className="space-y-3" staggerDelay={0.06}>
            {threads.map((thread) => (
              <motion.div key={thread.id} variants={staggerItemVariants}>
                <SpotlightCard className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors cursor-pointer group">
                  <div className="p-4 md:p-5 flex items-center gap-4">
                    {/* Pin or icon */}
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {thread.isPinned ? (
                        <Pin className="w-4 h-4 text-foreground/40 rotate-45" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-foreground/20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.isPinned && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/30">
                            Pinned
                          </span>
                        )}
                        <h3 className="font-semibold text-foreground/90 truncate">
                          {thread.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                        <span className="text-foreground/50">
                          {thread.author}
                        </span>
                        <TierBadge tier={thread.tier} />
                      </div>
                    </div>

                    {/* Meta — right side */}
                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-sm text-foreground/40">
                      <div className="flex items-center gap-1.5 font-mono">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {thread.replies}
                      </div>
                      <span className="text-xs font-mono">
                        {thread.lastActivity}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* ================================================================== */}
      {/* Announcements */}
      {/* ================================================================== */}
      <Section id="community-announcements" className="py-24 lg:py-32 relative">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-foreground/60" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Announcements
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Updates from the instructor. New content, recordings, and course
              news.
            </p>
          </ScrollFadeIn>

          <StaggerContainer
            className="space-y-4 max-w-3xl"
            staggerDelay={0.08}
          >
            {announcements.map((a) => (
              <motion.div key={a.id} variants={staggerItemVariants}>
                <div className="p-5 md:p-6 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02]">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-foreground/90">
                      {a.title}
                    </h3>
                    <span className="text-xs font-mono text-foreground/30 whitespace-nowrap">
                      {a.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {a.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-foreground/40">
                    <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center">
                      <span className="text-[10px] font-bold">CJ</span>
                    </div>
                    <span className="font-mono">Charles Jackson</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* ================================================================== */}
      {/* Member Spotlight */}
      {/* ================================================================== */}
      <Section id="community-spotlight" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-foreground/60" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Member Spotlight
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Recognizing builders who show up consistently and help the
              community grow.
            </p>
          </ScrollFadeIn>

          <StaggerContainer
            className="grid md:grid-cols-3 gap-4"
            staggerDelay={0.1}
          >
            {spotlightMembers.map((member) => (
              <motion.div key={member.id} variants={staggerItemVariants}>
                <SpotlightCard className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] h-full">
                  <div className="p-5 md:p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground/90">
                          {member.name}
                        </h3>
                        <TierBadge tier={member.tier} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground/40">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Flame className="w-3.5 h-3.5 text-foreground/40" />
                        <span className="font-mono text-foreground/60">
                          {member.streak}d streak
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="w-3.5 h-3.5 text-foreground/40" />
                        <span className="font-mono text-foreground/60">
                          {member.xp.toLocaleString()} XP
                        </span>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="mt-auto pt-4 border-t border-foreground/5">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* ================================================================== */}
      {/* Community Guidelines (collapsible) */}
      {/* ================================================================== */}
      <Section id="community-guidelines" className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn>
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setGuidelinesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-5 md:p-6 rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-foreground/60" />
                  <h2 className="text-lg md:text-xl font-bold">
                    Community Guidelines
                  </h2>
                </div>
                <motion.div
                  animate={{ rotate: guidelinesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-foreground/40" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {guidelinesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 md:p-6 border border-t-0 border-foreground/[0.08] rounded-b-xl bg-foreground/[0.01]">
                      <ul className="space-y-3">
                        {guidelines.map((rule, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 mt-0.5">
                              <span className="text-[10px] font-mono font-bold text-foreground/50">
                                {i + 1}
                              </span>
                            </span>
                            <span className="text-foreground/70">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
