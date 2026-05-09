import { Link, useLocation } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BookOpen,
  Code2,
  Lightbulb,
  Rocket,
  Wrench,
  Clock,
  GraduationCap,
  Settings,
  Trophy,
  Layers,
  Zap,
  Check,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'
import { CURRICULUM, TOTAL_XP, TOTAL_LESSONS } from '@/data/curriculum'
import { useAuth } from '@/hooks/use-auth'
import { useProgress, getTierProgress, getOverallProgress, getStreakMultiplier } from '@/stores/progress'
import { LessonRow } from '@/components/gamification/lesson-row'

const tierIcons: Record<string, typeof Code2> = {
  prework: Settings,
  tier1: Code2,
  tier2: Lightbulb,
  tier3: Rocket,
  tier4: Wrench,
}

const tiers = CURRICULUM.map((tier) => ({
  id: tier.id,
  icon: tierIcons[tier.id] || Code2,
  title: tier.id === 'prework' ? 'Prework' : `Tier ${tier.number} — ${tier.subtitle}`,
  hours: `${tier.hours} hours`,
  lessons: `${tier.lessonCount} lessons`,
  description: tier.description,
  topics: tier.lessons.map((l) => l.title),
  tags: [...new Set(tier.lessons.flatMap((l) => l.tools))].slice(0, 4),
  capstone: tier.lessons.find((l) => l.isCapstone)?.title || null,
  lessonDetails: tier.lessons,
}))


export default function Curriculum() {
  const { isLoggedIn } = useAuth()
  const { pathname } = useLocation()

  // /course/curriculum (auth-guarded) shows the app view; /curriculum shows marketing (with optional progress)
  if (isLoggedIn && pathname.startsWith('/course')) {
    return <AppCurriculum />
  }

  return <MarketingCurriculum />
}

function ProgressBanner() {
  const progressState = useProgress()
  const { completed, total, percent } = getOverallProgress()

  if (completed === 0) return null

  return (
    <div className="border-b border-foreground/[0.06] bg-foreground/[0.02]">
      <div className="container mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-sm">
            <Trophy className="w-4 h-4 text-foreground/60" />
            <span className="text-foreground/70 font-mono">
              Your Progress: <span className="text-foreground/90 font-semibold">{completed}/{total} lessons</span>
              {' · '}
              <span className="text-foreground/90 font-semibold">{percent}% complete</span>
              {' · '}
              <span className="text-foreground/90 font-semibold">{progressState.totalXp.toLocaleString()} XP</span> earned
            </span>
          </div>
          {percent === 100 && (
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-foreground/10 text-foreground/70 flex items-center gap-1.5">
              <Check className="w-3 h-3" />
              Course Complete
            </span>
          )}
        </div>
        <div className="relative h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

function TierProgressIndicator({ tierId }: { tierId: string }) {
  const tierProgress = getTierProgress(tierId)

  if (tierProgress.completed === 0) return null

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-mono text-foreground/40">
          {tierProgress.completed}/{tierProgress.total} completed
        </span>
        {tierProgress.percent === 100 && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-foreground/50">
            <Check className="w-2.5 h-2.5" />
          </span>
        )}
      </div>
      <div className="relative h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
          initial={{ width: 0 }}
          animate={{ width: `${tierProgress.percent}%` }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
      </div>
    </div>
  )
}

function AppCurriculum() {
  const totalHours = CURRICULUM.reduce((sum, t) => sum + t.hours, 0)
  useProgress()
  const { multiplier } = getStreakMultiplier()

  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Curriculum</h1>
                <p className="text-sm text-muted-foreground">
                  Each tier builds on the last. The milestone project from each tier proves you're ready for the next.
                </p>
              </div>
              {multiplier > 1 && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/10 border border-foreground/15">
                  <Zap className="w-3.5 h-3.5 text-foreground/60" />
                  <span className="text-xs font-mono font-semibold text-foreground/70">{multiplier}x XP</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {tiers.map((tier) => {
              const Icon = tier.icon
              const tierProgress = getTierProgress(tier.id)

              return (
                <div
                  key={tier.id}
                  id={`tier-${tier.id}`}
                  className="rounded-xl border border-foreground/10 bg-foreground/[0.02]"
                >
                  <div className="p-5 border-b border-foreground/[0.06]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Icon className="w-4 h-4 text-foreground/70" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold">{tier.title}</h2>
                          {tierProgress.percent === 100 && (
                            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/60">
                              <Check className="w-3 h-3" /> Complete
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tier.hours}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {tierProgress.completed}/{tierProgress.total}
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {tierProgress.earnedXp}/{tierProgress.totalXp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Tier progress bar */}
                    {tierProgress.percent > 0 && tierProgress.percent < 100 && (
                      <div className="relative h-1 rounded-full bg-foreground/[0.06] overflow-hidden mt-3">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
                          initial={{ width: 0 }}
                          animate={{ width: `${tierProgress.percent}%` }}
                          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="divide-y divide-foreground/[0.04]">
                    {tier.lessonDetails.map((lesson) => (
                      <LessonRow key={lesson.id} lesson={lesson} showStatus />
                    ))}
                  </div>

                  {tier.capstone && (
                    <div className="px-5 py-3 border-t border-foreground/[0.06] bg-foreground/[0.02]">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-foreground/60" />
                        <span className="text-xs font-mono text-foreground/60">Milestone Project:</span>
                        <span className="text-xs text-foreground/80">{tier.capstone}</span>
                        <span className="text-[10px] font-mono ml-auto text-foreground/30">
                          +{tier.lessonDetails.find(l => l.isCapstone)?.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="hidden xl:block w-72 shrink-0">
          <div className="sticky top-8 space-y-6">
            {/* Course Overview */}
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <h3 className="text-xs font-mono uppercase tracking-wide text-foreground/40 mb-4">Course Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-foreground/40" />
                    <span className="text-xs text-foreground/40">Hours</span>
                  </div>
                  <span className="text-2xl font-bold font-mono">{totalHours}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3 h-3 text-foreground/40" />
                    <span className="text-xs text-foreground/40">Lessons</span>
                  </div>
                  <span className="text-2xl font-bold font-mono">{TOTAL_LESSONS}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Layers className="w-3 h-3 text-foreground/40" />
                    <span className="text-xs text-foreground/40">Tiers</span>
                  </div>
                  <span className="text-2xl font-bold font-mono">4</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-3 h-3 text-foreground/40" />
                    <span className="text-xs text-foreground/40">Total XP</span>
                  </div>
                  <span className="text-2xl font-bold font-mono">{TOTAL_XP.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tier Navigation */}
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <h3 className="text-xs font-mono uppercase tracking-wide text-foreground/40 mb-4">Jump to Tier</h3>
              <nav className="space-y-1">
                {tiers.map((tier) => {
                  const Icon = tier.icon
                  const tp = getTierProgress(tier.id)
                  return (
                    <a
                      key={tier.id}
                      href={`#tier-${tier.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-foreground/[0.05] transition-colors group"
                    >
                      <div className="p-1.5 rounded-md bg-foreground/5 border border-foreground/10 group-hover:border-foreground/15 transition-colors">
                        <Icon className="w-3 h-3 text-foreground/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors block truncate">
                          {tier.id === 'prework' ? 'Prework' : `Tier ${CURRICULUM.find(t => t.id === tier.id)?.number}`}
                        </span>
                        <span className="text-[10px] font-mono text-foreground/30">
                          {tier.lessonDetails.length} lessons · {tp.totalXp} XP
                        </span>
                      </div>
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Capstones */}
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <h3 className="text-xs font-mono uppercase tracking-wide text-foreground/40 mb-4">
                <Trophy className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                Milestone Projects
              </h3>
              <div className="space-y-3">
                {tiers.filter(t => t.capstone).map((tier) => (
                  <div key={tier.id} className="flex items-start gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-foreground/30 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-foreground/30 block">
                        {tier.id === 'prework' ? 'Prework' : `Tier ${CURRICULUM.find(t => t.id === tier.id)?.number}`}
                      </span>
                      <span className="text-xs text-foreground/60 leading-relaxed">
                        {tier.capstone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function MarketingCurriculum() {
  const { isLoggedIn } = useAuth()
  // Initialize progress store if user is logged in (needed for getLessonStatus/getTierProgress)
  useProgress()

  return (
    <>
      {isLoggedIn && <ProgressBanner />}
      <SEO
        title="Curriculum — The Agentic SaaS Course"
        description="52 hours across 51 lessons and 4 tiers. From the basics to directing teams of AI agents. Learn to direct a single agent, coordinate multiple agents in parallel, and design complete agent workflows."
        path="/curriculum"
        image="/og-image.png"
        imageAlt="Curriculum — The Agentic SaaS Course: 52 hours, 51 lessons, 4 tiers"
        keywords="agentic saas curriculum, ai agent course for entrepreneurs, course syllabus, learn to direct ai agents, ai for business owners, 52 hour ai course"
        jsonLd={{
          '@type': 'Course',
          name: 'The Agentic SaaS Course — Full Curriculum',
          description: '52 hours of interactive instruction across 51 lessons and 4 tiers. From the basics to directing teams of AI agents.',
          url: 'https://charlesjackson.dev/curriculum',
          provider: { '@type': 'Person', name: 'Charles Jackson' },
          numberOfCredits: '52 hours',
          educationalLevel: 'Beginner to Advanced',
          teaches: ['Multi-Agent Orchestration', 'AI Agent Direction', 'Agent Coordination', 'Brief Writing', 'Agent Verification', 'Building with AI Agents', 'Agent Workflow Design', 'Real-World Projects'],
        }}
      />

      {/* Hero */}
      <Section id="curriculum-hero" className="relative min-h-[60vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <BookOpen className="w-4 h-4 text-foreground/60" />
                <span className="text-xs font-mono text-foreground/60">Full Curriculum</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                From zero to{' '}
                <span className="text-muted-foreground">directing AI teams.</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                52 hours across 51 interactive lessons. Each tier takes you deeper into directing AI agents — from understanding how they work to orchestrating entire teams. You advance by shipping real projects.
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section id="curriculum-stats" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { value: 52, suffix: 'h', label: 'Total Hours' },
              { value: 51, suffix: '', label: 'Lessons' },
              { value: 8, suffix: '', label: 'Principles' },
              { value: 4, suffix: '', label: 'Milestone Projects' },
            ].map(({ value, suffix, label }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold font-mono mb-2 text-foreground">
                  <AnimatedNumber value={value} suffix={suffix} duration={2} />
                </div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Tiers Breakdown */}
      <Section id="curriculum-tiers" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Course Breakdown
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Each tier builds on the last. You advance by completing a milestone project that proves you're ready for the next level.
            </p>
          </ScrollFadeIn>

          <div className="max-w-4xl space-y-12">
            {tiers.map((tier, index) => {
              const Icon = tier.icon
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="p-6 md:p-8 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.03] transition-colors">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Icon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-1">{tier.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {tier.hours}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            {tier.lessons}
                          </span>
                        </div>
                        {isLoggedIn && <TierProgressIndicator tierId={tier.id} />}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    {/* Lessons */}
                    <div className="mb-6">
                      <h4 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wide">
                        Lessons
                      </h4>
                      <div className="space-y-1.5">
                        {tier.lessonDetails.map((lesson) => (
                          <LessonRow key={lesson.id} lesson={lesson} showStatus={isLoggedIn} />
                        ))}
                      </div>
                    </div>

                    {/* Capstone */}
                    {tier.capstone && (
                      <div className="p-4 rounded-lg bg-foreground/[0.03] border border-foreground/5 mb-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <GraduationCap className="w-4 h-4 text-foreground/60" />
                          <span className="text-sm font-mono text-foreground/60">Milestone Project</span>
                        </div>
                        <p className="text-sm text-foreground/80">{tier.capstone}</p>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {tier.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-mono rounded-full bg-foreground/[0.06] border border-foreground/10 text-foreground/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="curriculum-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to start directing AI?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              52 hours. 4 real-world projects. Principles that outlast the next AI release.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="font-mono group" asChild>
                <Link to="/course/dashboard">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-mono group" asChild>
                <Link to="/tiers">
                  View Pricing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
