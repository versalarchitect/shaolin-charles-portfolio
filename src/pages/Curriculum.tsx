import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
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
  Star,
  Play,
  Trophy,
  Layers,
  Zap,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'
import { CURRICULUM, TOTAL_XP, TOTAL_LESSONS } from '@/data/curriculum'
import { useAuth } from '@/hooks/use-auth'

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

  if (isLoggedIn) {
    return <AppCurriculum />
  }

  return <MarketingCurriculum />
}

function AppCurriculum() {
  const totalHours = CURRICULUM.reduce((sum, t) => sum + t.hours, 0)

  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Curriculum</h1>
            <p className="text-sm text-muted-foreground">
              Each tier builds on the last. The capstone from each tier proves you're ready for the next.
            </p>
          </div>

          <div className="space-y-8">
            {tiers.map((tier) => {
              const Icon = tier.icon
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
                      <div>
                        <h2 className="text-lg font-bold">{tier.title}</h2>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tier.hours}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {tier.lessons}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-foreground/[0.04]">
                    {tier.lessonDetails.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/learn/${lesson.id}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-foreground/[0.03] transition-colors group"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground/10 group-hover:bg-foreground/15 transition-colors">
                          {lesson.isCapstone ? (
                            <Star className="h-3 w-3 text-foreground/70" />
                          ) : (
                            <Play className="h-2.5 w-2.5 text-foreground/60 ml-0.5" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-foreground/40">{lesson.number}</span>
                            <span className={`text-sm ${lesson.isCapstone ? 'font-semibold' : ''} text-foreground/80 group-hover:text-foreground transition-colors truncate`}>
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-foreground/40 shrink-0">
                          <span className="font-mono">{lesson.duration}m</span>
                          <span className="font-mono text-foreground/30">+{lesson.xp} XP</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {tier.capstone && (
                    <div className="px-5 py-3 border-t border-foreground/[0.06] bg-foreground/[0.02]">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-foreground/60" />
                        <span className="text-xs font-mono text-foreground/60">Capstone:</span>
                        <span className="text-xs text-foreground/80">{tier.capstone}</span>
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
                  const tierXp = tier.lessonDetails.reduce((sum, l) => sum + l.xp, 0)
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
                          {tier.lessonDetails.length} lessons · {tierXp} XP
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
                Capstones
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
  return (
    <>
      <SEO
        title="Curriculum — The Agentic SaaS Course"
        description="52 hours across 51 lessons and 4 tiers. From tokens and context windows to multi-agent orchestration. Learn to direct single agents, coordinate parallel fleets, and architect agent-built systems."
        path="/curriculum"
        image="/og-image.png"
        imageAlt="Curriculum — The Agentic SaaS Course: 52 hours, 51 lessons, 4 tiers"
        keywords="agentic saas curriculum, ai development lessons, course syllabus, next.js lessons, supabase tutorial, claude code training, full stack course outline, 52 hour coding course"
        jsonLd={{
          '@type': 'Course',
          name: 'The Agentic SaaS Course — Full Curriculum',
          description: '52 hours of interactive instruction across 51 lessons and 4 tiers. From tokens to multi-agent orchestration.',
          url: 'https://charlesjackson.dev/curriculum',
          provider: { '@type': 'Person', name: 'Charles Jackson' },
          numberOfCredits: '52 hours',
          educationalLevel: 'Intermediate to Advanced',
          teaches: ['Multi-Agent Orchestration', 'AI Agent Coordination', 'Context Windows', 'Token Management', 'MCP Servers', 'Spec-Driven Development', 'Agent Verification', 'Production Agent Systems'],
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
                From tokens to{' '}
                <span className="text-muted-foreground">agent fleets.</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                52 hours across 51 interactive lessons. Each tier takes you deeper into how agents think, coordinate, and ship. You don't move up until you ship.
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
              { value: 4, suffix: '', label: 'Capstones' },
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
              Each tier builds on the last. You can't skip ahead — the capstone from each tier proves you're ready for the next.
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
                          <Link
                            key={lesson.id}
                            to={`/learn/${lesson.id}`}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-foreground/[0.03] transition-colors group"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 group-hover:bg-foreground/15 transition-colors">
                              {lesson.isCapstone ? (
                                <Star className="h-3.5 w-3.5 text-foreground/70" />
                              ) : (
                                <Play className="h-3 w-3 text-foreground/60 ml-0.5" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-foreground/40">{lesson.number}</span>
                                <span className={`text-sm ${lesson.isCapstone ? 'font-semibold' : ''} text-foreground/80 group-hover:text-foreground transition-colors truncate`}>
                                  {lesson.title}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-foreground/40 shrink-0">
                              <span className="font-mono">{lesson.duration}m</span>
                              <span className="font-mono text-foreground/30">+{lesson.xp} XP</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Capstone */}
                    {tier.capstone && (
                      <div className="p-4 rounded-lg bg-foreground/[0.03] border border-foreground/5 mb-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <GraduationCap className="w-4 h-4 text-foreground/60" />
                          <span className="text-sm font-mono text-foreground/60">Capstone</span>
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
              Ready to start building?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              52 hours. 4 deployed products. Principles that outlast the next model release.
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
