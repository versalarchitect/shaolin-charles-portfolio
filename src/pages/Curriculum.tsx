import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  Check,
  Clock,
  GraduationCap,
  Settings,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const tiers = [
  {
    id: 'prework',
    icon: Settings,
    title: 'Prework',
    hours: '2 hours',
    lessons: '3 lessons',
    description: 'Set up your local environment, deployment pipeline, and AI tooling. Get ready to build.',
    topics: [
      'Local development environment setup',
      'Vercel deployment pipeline',
      'Claude Code installation and configuration',
      'Git workflow and project scaffolding',
    ],
    tags: ['VS Code', 'Git', 'Node.js', 'Claude Code'],
    capstone: null,
  },
  {
    id: 'foundations',
    icon: Code2,
    title: 'Tier 1 — Foundations',
    hours: '8 hours',
    lessons: '10 lessons',
    description: 'Learn the fundamentals that transfer across any AI tool: tokens, context windows, skills, MCP servers, and the tool ladder from paste to agent.',
    topics: [
      'Tokens, context windows, and how AI tools actually work',
      'The tool ladder: paste → skill → script → agent → MCP',
      'Reading before generating — understanding codebases first',
      'Spec writing and error-first debugging',
      'MCP servers and skill configuration',
      'First three principles internalized through real work',
    ],
    tags: ['Tokens', 'Skills', 'MCP', 'Claude Code'],
    capstone: 'Deployed single-page tool built with AI assistance',
  },
  {
    id: 'builder',
    icon: Lightbulb,
    title: 'Tier 2 — Builder',
    hours: '12 hours',
    lessons: '12 lessons',
    description: 'Build a full CRUD SaaS with auth, database, and payments. Learn to spec before you generate, test what matters, and ship to real users.',
    topics: [
      'Full-stack SaaS architecture with Next.js App Router',
      'Supabase: PostgreSQL, auth, and real-time subscriptions',
      'Database design with Drizzle ORM and migrations',
      'Stripe integration: payments, webhooks, and subscriptions',
      'Spec-driven development with AI assistance',
      'Production deployment and environment management',
    ],
    tags: ['Next.js', 'Supabase', 'Stripe', 'Drizzle'],
    capstone: 'Working SaaS product with auth, payments, deployed to Vercel',
  },
  {
    id: 'operator',
    icon: Rocket,
    title: 'Tier 3 — Operator',
    hours: '15 hours',
    lessons: '14 lessons',
    description: 'Ship a product with real users. Handle production incidents. Write postmortems. Learn background jobs with Inngest and end-to-end testing.',
    topics: [
      'Production operations and incident response',
      'Background jobs and event-driven architecture with Inngest',
      'End-to-end testing with Vitest and Playwright',
      'Monitoring, logging, and observability',
      'Postmortem writing and operational maturity',
      'Performance optimization and caching strategies',
    ],
    tags: ['Inngest', 'Vitest', 'Playwright', 'Operations'],
    capstone: 'Live product with real users, monitoring, and documentation',
  },
  {
    id: 'architect',
    icon: Wrench,
    title: 'Tier 4 — Architect',
    hours: '15 hours',
    lessons: '12 lessons',
    description: 'Tear down a complex system. Evaluate every decision. Write a system teardown document that proves you can think at the architectural level.',
    topics: [
      'System architecture analysis and documentation',
      'Trade-off evaluation and decision frameworks',
      'The complete teardown methodology',
      'Evaluating AI-generated architecture decisions',
      'When to refactor vs. when to rewrite',
      'Principle 8: taste is the moat',
    ],
    tags: ['Architecture', 'Analysis', 'Documentation', 'Judgment'],
    capstone: 'System teardown document proving architectural judgment',
  },
]

export default function Curriculum() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Curriculum — The Agentic SaaS Course"
        description="52 hours across 51 lessons and 4 tiers. From tokens and context windows to system teardowns. Learn Next.js, Supabase, Claude Code, Stripe, and Vercel — guided by 8 timeless principles."
        path="/curriculum"
        keywords="agentic saas curriculum, ai development lessons, course syllabus, next.js lessons, supabase tutorial, claude code training, full stack course outline, 52 hour coding course"
        jsonLd={{
          '@type': 'Course',
          name: 'The Agentic SaaS Course — Full Curriculum',
          description: '52 hours of principles-first instruction across 51 lessons and 4 tiers, from first deploy to system teardown.',
          url: 'https://shaolincharles.dev/curriculum',
          provider: { '@type': 'Person', name: 'Charles Jackson' },
          numberOfCredits: '52 hours',
          educationalLevel: 'Intermediate to Advanced',
          teaches: ['AI-Assisted Development', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Claude Code', 'Vercel', 'Drizzle ORM', 'Stripe', 'Production Operations'],
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
                From first deploy to{' '}
                <span className="text-muted-foreground">system teardown.</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                52 hours of instruction across 51 lessons. Each tier is harder. Each capstone is closer to professional software. You don't move up until you ship.
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

          <div className="max-w-4xl mx-auto space-y-12">
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

                    {/* Topics */}
                    <div className="mb-6">
                      <h4 className="text-sm font-mono text-muted-foreground mb-3 uppercase tracking-wide">
                        What you'll learn
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {tier.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-2.5 text-sm">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 mt-0.5">
                              <Check className="h-3 w-3 text-foreground/70" />
                            </span>
                            <span className="text-foreground/80">{topic}</span>
                          </li>
                        ))}
                      </ul>
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
                <Link to="/tiers">
                  View Pricing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/principles">Read the Principles</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
