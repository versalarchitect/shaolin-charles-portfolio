import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Eye,
  FileText,
  Bug,
  Layers,
  Shield,
  TestTube,
  PenTool,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const principles = [
  {
    number: '01',
    title: 'Read Before You Generate',
    subtitle: 'Understanding precedes creation',
    description: 'Before asking AI to write code, read the existing codebase. Understand the patterns, conventions, and constraints already in place. Generation without comprehension produces code that compiles but doesn\'t belong.',
    icon: Eye,
  },
  {
    number: '02',
    title: 'Spec Before You Build',
    subtitle: 'Clarity before velocity',
    description: 'Write a specification before writing code. Define inputs, outputs, edge cases, and success criteria. A spec turns vague intent into precise instruction — for you and for the AI.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Error-First Debugging',
    subtitle: 'Read the error message. The whole thing.',
    description: 'When something breaks, start with the error message — not a prompt. Most developers skip the stack trace and go straight to "fix this." The error message is the spec for the fix.',
    icon: Bug,
  },
  {
    number: '04',
    title: 'The Tool Ladder',
    subtitle: 'paste → skill → script → agent → MCP',
    description: 'Not every problem needs an agent. Match the tool to the task. A simple paste might be all you need. Reaching for the most powerful tool by default creates fragile, over-engineered solutions.',
    icon: Layers,
  },
  {
    number: '05',
    title: 'Own Your Constraints',
    subtitle: 'Boundaries create better software',
    description: 'Constraints aren\'t obstacles — they\'re design parameters. Token limits, context windows, rate limits, and budget constraints force better architectural decisions than unlimited resources ever would.',
    icon: Shield,
  },
  {
    number: '06',
    title: 'Test What Matters',
    subtitle: 'Coverage is vanity. Confidence is sanity.',
    description: 'Don\'t test everything — test the things that would wake you up at 3am. Critical paths, payment flows, auth boundaries, data integrity. 20% of tests catch 80% of production bugs.',
    icon: TestTube,
  },
  {
    number: '07',
    title: 'Ship to Learn',
    subtitle: 'Deployed code teaches more than perfect code',
    description: 'You learn more from deploying an imperfect product than from perfecting one that never ships. Real users generate real feedback. Ship early, ship often, and fix what matters.',
    icon: Sparkles,
  },
  {
    number: '08',
    title: 'Taste Is the Moat',
    subtitle: 'AI can generate. Only you can judge.',
    description: 'AI can write code, but it can\'t tell you if the code is good. Taste — the ability to distinguish between "works" and "right" — is the skill that separates builders from prompters. It\'s the one thing AI can\'t replicate.',
    icon: PenTool,
  },
]

export default function Principles() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="8 Principles — The Agentic SaaS Course"
        description="The 8 timeless principles behind building software with AI. Judgment over prompt tricks, principles over patterns, builders not prompters. These outlast the next model release."
        path="/principles"
        image="/og-image.png"
        imageAlt="8 Principles — The Agentic SaaS Course: timeless principles for building with AI"
        keywords="ai development principles, software engineering principles, building with ai guidelines, judgment over prompts, principles-first development, agentic development philosophy"
        jsonLd={{
          '@type': 'ItemList',
          name: '8 Principles of the Agentic SaaS Course',
          description: 'Timeless principles for building software with AI that outlast the next model release.',
          url: 'https://shaolincharles.dev/principles',
          numberOfItems: 8,
        }}
      />

      {/* Hero */}
      <Section id="principles-hero" className="relative min-h-[60vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <BookOpen className="w-4 h-4 text-foreground/60" />
                <span className="text-xs font-mono text-foreground/60">8 Principles</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                The tools change.{' '}
                <span className="text-muted-foreground">The principles don't.</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                Every six months, a new AI model drops and the tutorials go stale. These 8 principles are designed to outlast the next model release — they're about judgment, not syntax.
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                You'll internalize these through real work across all 4 tiers. By Tier 4, they'll be instinct — not rules you have to remember.
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Principles List */}
      <Section id="principles-list" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-16">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <motion.div
                  key={principle.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative pl-0 md:pl-24"
                >
                  {/* Large number */}
                  <div className="hidden md:block absolute -left-4 top-0 text-[100px] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none">
                    {principle.number}
                  </div>

                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-foreground/5 border border-foreground/10">
                      <Icon className="w-5 h-5 text-foreground/70" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground md:hidden">
                        {principle.number}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold">{principle.title}</h3>
                      <p className="text-sm font-mono text-muted-foreground mt-1">
                        {principle.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed md:pl-14">
                    {principle.description}
                  </p>

                  {index < principles.length - 1 && (
                    <div className="mt-16 h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="principles-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to internalize them?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              You don't memorize principles from a list. You internalize them by shipping real products under real constraints across 4 tiers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="font-mono group" asChild>
                <Link to="/curriculum">
                  See the Curriculum
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/tiers">View Tiers</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
