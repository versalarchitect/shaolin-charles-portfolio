import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { initiateCheckout } from '@/lib/checkout'
import {
  ArrowRight,
  Check,
  Clock,
  BookOpen,
  GraduationCap,
  Zap,
  Mail,
  Code2,
  Lightbulb,
  Rocket,
  Wrench,
  ChevronRight,
  Shield,
  RefreshCw,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
  Magnetic,
  GlowBorder,
  TiltCard,
  SpotlightCard,
  StaggerContainer,
  staggerItemVariants,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const tiers = [
  {
    number: '01',
    icon: Code2,
    name: 'Understand the Machine',
    hours: 8,
    lessons: 10,
    description: 'You can\'t direct what you don\'t understand. Learn how agents process intent — tokens, context windows, the tool ladder. Understand why agents lose track, hallucinate tool calls, and misread your constraints before you ever try to orchestrate them.',
    capstone: 'Context-window stress test with documented failure modes',
    skills: ['Token Economics', 'Context Windows', 'Tool Ladder', 'Intent Parsing', 'Failure Modes'],
  },
  {
    number: '02',
    icon: Lightbulb,
    name: 'Direct a Single Agent',
    hours: 12,
    lessons: 12,
    description: 'Master the art of constraining, verifying, and iterating on a single agent\'s output. Write specs that eliminate ambiguity. Build feedback loops that catch drift. Ship a full SaaS by directing one agent through every layer — auth, API, UI, deploy.',
    capstone: 'Full SaaS shipped by directing one agent end-to-end',
    skills: ['Spec Constraints', 'Output Verification', 'Iteration Loops', 'Drift Detection', 'Single-Agent Orchestration'],
  },
  {
    number: '03',
    icon: Rocket,
    name: 'Orchestrate Multiple Agents',
    hours: 15,
    lessons: 14,
    description: 'Run 3-5 agents in parallel on the same codebase. Use git worktrees for isolation, CLAUDE.md for shared context, and task decomposition to keep agents from colliding. Resolve merge conflicts, cross-verify agent outputs, and ship faster than any solo workflow.',
    capstone: 'Production app built by 3+ parallel agents on shared codebase',
    skills: ['Git Worktrees', 'Shared Context (CLAUDE.md)', 'Task Decomposition', 'Conflict Resolution', 'Cross-Agent Verification'],
  },
  {
    number: '04',
    icon: Wrench,
    name: 'Architect Agent Systems',
    hours: 15,
    lessons: 12,
    description: 'Design codebases that agent fleets can navigate. Write coordination protocols that scale beyond your direct supervision. Know when to split tasks, merge branches, or override an agent\'s judgment. Prove system-level thinking across a multi-agent architecture.',
    capstone: 'Coordination protocol powering an unsupervised agent fleet',
    skills: ['Codebase Design for Agents', 'Coordination Protocols', 'Split/Merge Strategy', 'Override Judgment', 'System-Level Verification'],
  },
]

const included = [
  { text: 'All 4 tiers — from tokens to agent system design', icon: BookOpen },
  { text: '52 hours of interactive instruction across 51 lessons', icon: Clock },
  { text: '4 real capstone projects you ship to production', icon: Rocket },
  { text: '8 timeless principles internalized through practice', icon: Sparkles },
  { text: 'AI-graded feedback on every capstone submission', icon: Zap },
  { text: 'Lifetime access to all materials and future updates', icon: RefreshCw },
  { text: 'Direct email support for lessons and capstones', icon: Mail },
  { text: 'Alumni community access', icon: Users },
]

const faq = [
  {
    q: 'Do I need prior coding experience?',
    a: 'Yes — basic JavaScript/TypeScript. This isn\'t a learn-to-code course. It\'s a learn-to-orchestrate-agents course. You need to read code to verify what agents produce.',
  },
  {
    q: 'What if I already use Claude Code / Cursor / Copilot?',
    a: 'Good — you\'ll go deeper. Most people use a single agent for simple tasks. This course teaches multi-agent coordination, parallel workflows, and system-level orchestration patterns that most developers never learn.',
  },
  {
    q: 'Is the content self-paced?',
    a: 'Completely. All 51 lessons are interactive and self-paced. Work through them on your own schedule. Lifetime access means no rush.',
  },
  {
    q: 'Will these skills transfer beyond Claude Code?',
    a: 'The orchestration patterns are agent-agnostic. We teach with Claude Code because it\'s the best tool right now, but the principles of task splitting, verification, and coordination apply to any agent system.',
  },
  {
    q: 'What\'s the refund policy?',
    a: 'Complete Tier 1 and submit the capstone. If the course isn\'t for you, email within 30 days for a full refund. No questions asked.',
  },
]

export default function Tiers() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()
  const [enrolling, setEnrolling] = useState(false)

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await initiateCheckout()
    } catch {
      setEnrolling(false)
    }
  }

  return (
    <>
      <SEO
        title="Enroll — The Agentic SaaS Course | $4500"
        description="52 hours from tokens to multi-agent orchestration. One price, full access — learn to direct single agents, coordinate parallel fleets, and architect agent systems. $4500 USD, lifetime access."
        path="/tiers"
        image="/og-image.png"
        imageAlt="Enroll in The Agentic SaaS Course — $4500 USD, lifetime access"
        keywords="agentic saas course price, multi-agent orchestration course, $4500 ai course, agent coordination course, lifetime access, charles jackson course"
        jsonLd={{
          '@type': 'Offer',
          name: 'The Agentic SaaS Course — Full Access',
          description: '52 hours of interactive instruction from tokens to multi-agent orchestration. 51 lessons, 4 capstones, lifetime access.',
          url: 'https://charlesjackson.dev/tiers',
          price: '4500',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Person', name: 'Charles Jackson' },
        }}
      />

      {/* Hero — Clean, centered, confident */}
      <Section id="tiers-hero" className="relative min-h-screen flex items-center overflow-hidden">
        <SectionSpots variant="hero" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-10">
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs font-mono text-foreground/60">Enrollment Open</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                One course. Everything you need.
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12">
                52 hours from understanding your first token to orchestrating agent fleets that build production software.
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="mb-12 relative">
                <div className="absolute -inset-12 bg-radial-[at_50%_50%] from-foreground/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="text-8xl md:text-9xl font-bold tracking-[-0.06em] leading-none bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                    <span className="text-6xl md:text-7xl align-top mr-1">$</span>
                    <AnimatedNumber value={4500} duration={1.5} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-4 tracking-widest uppercase">
                    One-time payment · Lifetime access
                  </div>
                </div>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.35} immediate>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Magnetic strength={0.15}>
                  <Button size="lg" className="h-14 px-10 font-mono group" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Redirecting...' : 'Enroll Now'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <Button size="lg" variant="outline" className="h-14 px-10 font-mono" asChild>
                    <Link to="/curriculum">See Full Curriculum</Link>
                  </Button>
                </Magnetic>
              </div>
            </BlurFadeIn>

            {/* Stats grid — integrated into hero */}
            <BlurFadeIn delay={0.4} immediate>
              <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden border border-foreground/10 max-w-2xl mx-auto">
                {[
                  { value: 52, suffix: 'h', label: 'Instruction' },
                  { value: 51, suffix: '', label: 'Lessons' },
                  { value: 8, suffix: '', label: 'Principles' },
                  { value: 4, suffix: '', label: 'Capstones' },
                ].map(({ value, suffix, label }) => (
                  <div key={label} className="bg-foreground/[0.03] p-5 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold font-mono mb-1">
                      <AnimatedNumber value={value} suffix={suffix} duration={2} />
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* The 4 Tiers — Bento Grid */}
      <Section id="tiers-breakdown" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              From tokens to agent fleets
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Each tier takes you deeper into how agents think, coordinate, and ship. All four are included.
            </p>
          </ScrollFadeIn>

          {/* Bento grid: T1 wide, T2+T3 side-by-side, T4 wide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {tiers.map((tier, index) => {
              const Icon = tier.icon
              const isWide = index === 0 || index === 3
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className={isWide ? 'md:col-span-2' : ''}
                >
                  <TiltCard tiltAmount={3} glareEnabled glareOpacity={0.03} perspective={2000}>
                    <SpotlightCard spotlightColor="rgba(var(--effect-rgb),0.04)" spotlightSize={600}>
                      <div className="relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 transition-all duration-300">
                        {/* Watermark number */}
                        <div className={`absolute -right-4 -top-6 font-bold leading-none text-foreground/[0.02] select-none pointer-events-none ${isWide ? 'text-[220px]' : 'text-[160px]'}`}>
                          {tier.number}
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20">
                          <div className="absolute top-5 right-5 w-px h-10 bg-gradient-to-b from-foreground/15 to-transparent" />
                          <div className="absolute top-5 right-5 w-10 h-px bg-gradient-to-r from-foreground/15 to-transparent" />
                        </div>

                        <div className={`relative ${isWide ? 'p-6 md:p-8' : 'p-6 md:p-8'}`}>
                          {isWide ? (
                            /* Wide layout */
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.05] border border-foreground/10">
                                    <Icon className="w-6 h-6 text-foreground/70" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-mono text-muted-foreground block">Tier {tier.number}</span>
                                    <h3 className="text-2xl md:text-3xl font-bold">{tier.name}</h3>
                                  </div>
                                </div>
                                <div className="flex gap-6 text-right">
                                  <div>
                                    <div className="text-3xl font-bold font-mono">{tier.hours}<span className="text-sm font-normal text-muted-foreground">h</span></div>
                                    <div className="text-[10px] text-muted-foreground">{tier.lessons} lessons</div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                                {tier.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {tier.skills.map((skill) => (
                                  <span key={skill} className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              <div className="p-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 inline-flex items-start gap-3">
                                <GraduationCap className="w-4 h-4 text-foreground/50 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-xs font-mono text-foreground/40 block">Capstone</span>
                                  <span className="text-sm text-foreground/80">{tier.capstone}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Compact card layout */
                            <>
                              <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.05] border border-foreground/10">
                                    <Icon className="w-5 h-5 text-foreground/70" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-mono text-muted-foreground block">Tier {tier.number}</span>
                                    <h3 className="text-xl font-bold">{tier.name}</h3>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold font-mono">{tier.hours}<span className="text-sm font-normal text-muted-foreground">h</span></div>
                                  <div className="text-[10px] text-muted-foreground">{tier.lessons} lessons</div>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                {tier.description}
                              </p>

                              <div className="flex flex-wrap gap-1.5 mb-5">
                                {tier.skills.map((skill) => (
                                  <span key={skill} className="text-[10px] font-mono px-2.5 py-1 bg-foreground/[0.04] rounded-full border border-foreground/[0.08] text-foreground/50">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              <div className="p-3 rounded-lg bg-foreground/[0.03] border border-foreground/5 flex items-center gap-2.5">
                                <GraduationCap className="w-3.5 h-3.5 text-foreground/40 flex-shrink-0" />
                                <span className="text-xs text-foreground/70">{tier.capstone}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* What's Included — Grid with Price Feature */}
      <Section id="tiers-included" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Everything included
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              No tiers to choose between. No features locked behind paywalls. One price, full access.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Price feature card — spans 1 col, 2 rows */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="md:row-span-2"
            >
              <div className="h-full rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-[140px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none">$</div>
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold font-mono mb-3 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">$4500</div>
                  <div className="text-sm text-muted-foreground mb-6 font-mono">One-time · Lifetime</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-foreground/20 to-transparent mx-auto mb-6" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>No subscriptions</p>
                    <p>No hidden fees</p>
                    <p>30-day guarantee</p>
                  </div>
                  <Magnetic strength={0.15}>
                    <Button size="lg" className="mt-8 font-mono group w-full" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? 'Redirecting...' : 'Enroll Now'}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </motion.div>

            {/* Included items — 2x2 grid filling the remaining space */}
            {included.map(({ text, icon: Icon }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                className="group"
              >
                <div className="h-full flex items-start gap-3 p-5 rounded-xl border border-foreground/[0.06] hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] group-hover:bg-foreground/[0.08] transition-colors">
                    <Icon className="h-4 w-4 text-foreground/60" />
                  </div>
                  <span className="text-foreground/80 text-sm leading-relaxed pt-1.5">{text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Social Proof Strip */}
      <Section id="tiers-proof" className="py-16 relative">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: 'By Tier 3 I was running three agents in parallel on different parts of my SaaS. That progression is the real magic.', author: 'Alex Chen', tier: 'Tier 3' },
              { quote: 'Tier 1 alone was worth it — I finally understood why my agents kept losing context. By Tier 3, everything clicked.', author: 'Sarah Martinez', tier: 'Tier 4' },
              { quote: 'Directing one agent is easy. Orchestrating five on the same codebase without them stepping on each other — that\'s what this teaches.', author: 'Jordan Osei', tier: 'Tier 4' },
            ].map(({ quote, author, tier }, index) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-foreground/[0.06] bg-foreground/[0.01]"
              >
                <MessageSquare className="w-4 h-4 text-foreground/20 mb-3" />
                <p className="text-sm text-foreground/70 leading-relaxed mb-4 italic">"{quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/60">{author}</span>
                  <span className="text-[10px] font-mono text-foreground/30">{tier}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Guarantee + FAQ — Side by side grid */}
      <Section id="tiers-faq" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 md:gap-12">
            {/* Guarantee — sticky sidebar */}
            <ScrollFadeIn>
              <div className="lg:sticky lg:top-32">
                <div className="p-8 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-foreground/[0.05] border border-foreground/10">
                      <Shield className="w-6 h-6 text-foreground/50" />
                    </div>
                    <h2 className="text-xl font-bold">30-day guarantee</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Complete Tier 1 and submit the capstone. If the course isn't for you, email within 30 days for a full refund.
                  </p>
                  <p className="text-sm text-muted-foreground/60 mb-6">
                    No questions asked. You keep the Tier 1 materials either way.
                  </p>
                  <div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent mb-6" />
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>Risk-free enrollment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>Full refund if not satisfied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>Keep Tier 1 materials</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            {/* FAQ — right column */}
            <div>
              <ScrollFadeIn className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Common questions
                </h2>
              </ScrollFadeIn>

              <div className="space-y-3">
                {faq.map(({ q, a }, index) => (
                  <motion.details
                    key={q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group rounded-xl border border-foreground/10 hover:border-foreground/15 transition-colors overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                      <span className="text-foreground font-medium pr-4 text-sm">{q}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform duration-200" />
                    </summary>
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-muted-foreground leading-relaxed text-sm">{a}</p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section id="tiers-cta" className="py-32 lg:py-40 relative overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollFadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-foreground/10 bg-foreground/5">
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs font-mono text-muted-foreground">Now enrolling</span>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ready to orchestrate,{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  not just prompt?
                </span>
              </h2>
            </ScrollFadeIn>

            <BlurFadeIn delay={0.1}>
              <p className="text-muted-foreground text-lg mb-4 max-w-xl mx-auto leading-relaxed">
                52 hours. From tokens to agent fleets. 4 products built by agents you direct.
              </p>
              <p className="text-4xl md:text-5xl font-bold font-mono mb-8">$4500</p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Magnetic strength={0.15}>
                  <Button size="lg" className="h-14 px-10 font-mono group text-base" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? 'Redirecting...' : 'Enroll Now'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <Button size="lg" variant="outline" className="h-14 px-10 font-mono" asChild>
                    <a href="mailto:hello@charlesjackson.dev">
                      <Mail className="mr-2 h-4 w-4" />
                      Questions? Let's talk
                    </a>
                  </Button>
                </Magnetic>
              </div>
              <p className="text-xs text-muted-foreground/50">
                30-day guarantee · Lifetime access · No recurring fees
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>
    </>
  )
}
