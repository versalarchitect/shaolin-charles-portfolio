import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  BookOpen,
  GraduationCap,
  Zap,
  Mail,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const tiers = [
  {
    id: 'foundations',
    name: 'Foundations',
    tier: 'Tier 1',
    price: 'Free',
    priceNote: 'Start here',
    hours: '8 hours',
    lessons: '10 lessons',
    description: 'Learn the fundamentals that transfer across any AI tool. Internalize your first principles. Ship a deployed tool.',
    features: [
      'Tokens, context windows, and how AI tools work',
      'The tool ladder: paste → skill → script → agent → MCP',
      'First 3 principles internalized through real work',
      'Capstone: deployed single-page tool',
      'Lifetime access to Tier 1 materials',
    ],
    highlighted: false,
  },
  {
    id: 'builder',
    name: 'Builder',
    tier: 'Tier 1–2',
    price: '$199',
    priceNote: 'One-time payment',
    hours: '20 hours',
    lessons: '22 lessons',
    description: 'Everything in Foundations, plus build a full CRUD SaaS with auth, database, and payments.',
    features: [
      'Everything in Foundations',
      'Full-stack SaaS with Next.js, Supabase, Stripe',
      'Spec-driven development with AI assistance',
      'Database design with Drizzle ORM',
      'Capstone: working SaaS product on Vercel',
      'Lifetime access to Tiers 1–2',
    ],
    highlighted: false,
  },
  {
    id: 'operator',
    name: 'Operator',
    tier: 'Tier 1–3',
    price: '$399',
    priceNote: 'Most popular',
    hours: '35 hours',
    lessons: '36 lessons',
    description: 'The full production experience. Ship to real users. Handle incidents. Write postmortems.',
    features: [
      'Everything in Builder',
      'Production operations and incident response',
      'Background jobs with Inngest',
      'End-to-end testing: Vitest + Playwright',
      'Postmortem writing and operational maturity',
      'Capstone: live product with users and docs',
      'Lifetime access to Tiers 1–3',
    ],
    highlighted: true,
  },
  {
    id: 'architect',
    name: 'Architect',
    tier: 'All 4 Tiers',
    price: '$599',
    priceNote: 'Complete course',
    hours: '52 hours',
    lessons: '51 lessons',
    description: 'The complete journey from first deploy to system teardown. Prove you can think, not just code.',
    features: [
      'Everything in Operator',
      'System architecture analysis and documentation',
      'Trade-off evaluation and decision frameworks',
      'The complete teardown methodology',
      'Principle 8: taste is the moat',
      'Capstone: system teardown proving judgment',
      'Lifetime access to all tiers + future updates',
      'Alumni community access',
    ],
    highlighted: false,
  },
]

export default function Tiers() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Pricing & Tiers — The Agentic SaaS Course"
        description="4 tiers from Foundations to Architect. Each tier is harder, each capstone closer to professional software. Choose the path that matches your ambition."
        path="/tiers"
        image="/og-image.png"
        imageAlt="Pricing & Tiers — The Agentic SaaS Course: Free, $199, $399, $599"
        keywords="agentic saas course pricing, ai course tiers, coding course enrollment, foundations tier, builder tier, operator tier, architect tier, course pricing plans"
        jsonLd={{
          '@type': 'OfferCatalog',
          name: 'The Agentic SaaS Course — Enrollment Tiers',
          description: '4 tiers from Foundations to Architect, each with a real capstone project.',
          url: 'https://shaolincharles.dev/tiers',
          itemListElement: [
            { '@type': 'Offer', name: 'Tier 1 — Foundations', description: '8 hours, 10 lessons. Learn the fundamentals and deploy your first AI-assisted tool.', price: '0', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Tier 1–2 — Builder', description: '20 hours, 22 lessons. Build a full CRUD SaaS with auth, database, and payments.', price: '199', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'Tier 1–3 — Operator', description: '35 hours, 36 lessons. Ship a product with real users and handle production.', price: '399', priceCurrency: 'USD' },
            { '@type': 'Offer', name: 'All 4 Tiers — Architect', description: '52 hours, 51 lessons. Tear down a complex system and prove architectural judgment.', price: '599', priceCurrency: 'USD' },
          ],
        }}
      />

      {/* Hero */}
      <Section id="tiers-hero" className="relative min-h-[50vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <Zap className="w-4 h-4 text-foreground/60" />
                <span className="text-xs font-mono text-foreground/60">Enrollment Open</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                Pick your{' '}
                <span className="text-muted-foreground">ambition level.</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Each tier includes everything below it. Start free with Foundations, or go straight to Architect for the complete 52-hour journey.
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section id="tiers-pricing" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  tier.highlighted
                    ? 'border-foreground/30 bg-foreground/[0.04]'
                    : 'border-foreground/10 bg-foreground/[0.02]'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-mono rounded-full bg-foreground text-background">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-6">
                  <span className="text-xs font-mono text-muted-foreground">{tier.tier}</span>
                  <h3 className="text-2xl font-bold mt-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold font-mono">{tier.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">{tier.priceNote}</div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {tier.hours}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {tier.lessons}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 mt-0.5">
                        <Check className="h-3 w-3 text-foreground/70" />
                      </span>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full font-mono group ${tier.highlighted ? '' : 'variant-outline'}`}
                  variant={tier.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/contact">
                    {tier.price === 'Free' ? 'Start Free' : 'Enroll Now'}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* What's Included */}
      <Section id="tiers-included" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Every tier includes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No matter which tier you choose, you get the fundamentals that matter.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, title: 'Video Lessons', description: 'Pre-recorded, self-paced video instruction you can rewatch anytime' },
              { icon: GraduationCap, title: 'Real Capstones', description: 'Every tier ends with a deployed product — not a quiz' },
              { icon: Zap, title: 'AI-Graded Feedback', description: 'Honest, automated feedback on your capstone submissions' },
              { icon: Clock, title: 'Lifetime Access', description: 'Your tier materials never expire. Future updates included.' },
              { icon: Mail, title: 'Direct Support', description: 'Email access for questions about lessons and capstones' },
              { icon: Check, title: '8 Principles', description: 'The timeless principles woven through every lesson' },
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-lg bg-foreground/5 border border-foreground/10 mb-4">
                  <Icon className="w-5 h-5 text-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="tiers-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Questions before enrolling?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Not sure which tier is right for you? Reach out and let's figure it out together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="font-mono group" asChild>
                <a href="mailto:hello@charlesjackson.dev">
                  <Mail className="mr-2 h-4 w-4" />
                  hello@charlesjackson.dev
                </a>
              </Button>
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/curriculum">See Full Curriculum</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
