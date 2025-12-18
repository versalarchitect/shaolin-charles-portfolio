import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Brain,
  LineChart,
  Sigma,
  MessageSquareText,
  Network,
  Sparkles,
  ArrowRight,
  Layers,
  TrendingUp,
  Target,
  Zap,
  GitBranch,
  BarChart3,
  Binary,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  StaggerContainer,
  staggerItemVariants,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

// Animated floating particles for the hero section
function FloatingParticle({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number
  duration: number
  x: string
  y: string
  size: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="absolute rounded-full bg-foreground/10"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
      }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// Mathematical formula display component
function Formula({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`font-mono text-foreground/60 text-sm ${className}`}>
      {children}
    </span>
  )
}

export default function Interests() {
  const { t } = useTranslation()
  const prefersReducedMotion = useReducedMotion()

  // Core interests with detailed descriptions
  const coreInterests = [
    {
      id: 'monte-carlo',
      icon: LineChart,
      title: t('interests.areas.monteCarlo.title'),
      description: t('interests.areas.monteCarlo.description'),
      details: t('interests.areas.monteCarlo.details'),
      formula: 'E[f(X)] ≈ (1/N) Σ f(xᵢ)',
      applications: t('interests.areas.monteCarlo.applications', { returnObjects: true }) as string[],
    },
    {
      id: 'transformers',
      icon: Network,
      title: t('interests.areas.transformers.title'),
      description: t('interests.areas.transformers.description'),
      details: t('interests.areas.transformers.details'),
      formula: 'Attention(Q,K,V) = softmax(QKᵀ/√d)V',
      applications: t('interests.areas.transformers.applications', { returnObjects: true }) as string[],
    },
    {
      id: 'deep-learning',
      icon: Brain,
      title: t('interests.areas.deepLearning.title'),
      description: t('interests.areas.deepLearning.description'),
      details: t('interests.areas.deepLearning.details'),
      formula: 'y = σ(Wx + b)',
      applications: t('interests.areas.deepLearning.applications', { returnObjects: true }) as string[],
    },
    {
      id: 'nlp',
      icon: MessageSquareText,
      title: t('interests.areas.nlp.title'),
      description: t('interests.areas.nlp.description'),
      details: t('interests.areas.nlp.details'),
      formula: 'P(w|context) = softmax(h · W)',
      applications: t('interests.areas.nlp.applications', { returnObjects: true }) as string[],
    },
    {
      id: 'sentiment',
      icon: TrendingUp,
      title: t('interests.areas.sentiment.title'),
      description: t('interests.areas.sentiment.description'),
      details: t('interests.areas.sentiment.details'),
      formula: 'sentiment ∈ [-1, 1]',
      applications: t('interests.areas.sentiment.applications', { returnObjects: true }) as string[],
    },
    {
      id: 'bayesian',
      icon: Sigma,
      title: t('interests.areas.bayesian.title'),
      description: t('interests.areas.bayesian.description'),
      details: t('interests.areas.bayesian.details'),
      formula: 'P(H|E) = P(E|H)P(H) / P(E)',
      applications: t('interests.areas.bayesian.applications', { returnObjects: true }) as string[],
    },
  ]

  // Research focus areas
  const researchFocus = [
    {
      icon: Target,
      title: t('interests.research.prediction.title'),
      description: t('interests.research.prediction.description'),
    },
    {
      icon: Layers,
      title: t('interests.research.ensemble.title'),
      description: t('interests.research.ensemble.description'),
    },
    {
      icon: GitBranch,
      title: t('interests.research.causal.title'),
      description: t('interests.research.causal.description'),
    },
    {
      icon: BarChart3,
      title: t('interests.research.uncertainty.title'),
      description: t('interests.research.uncertainty.description'),
    },
  ]

  return (
    <>
      <Helmet>
        <title>{t('interests.meta.title')}</title>
        <meta name="description" content={t('interests.meta.description')} />
        <meta property="og:title" content={t('interests.meta.title')} />
        <meta property="og:description" content={t('interests.meta.description')} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <Section id="interests-hero" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />

        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingParticle delay={0} duration={4} x="10%" y="20%" size={4} />
          <FloatingParticle delay={0.5} duration={5} x="85%" y="15%" size={6} />
          <FloatingParticle delay={1} duration={4.5} x="70%" y="60%" size={3} />
          <FloatingParticle delay={1.5} duration={5.5} x="20%" y="70%" size={5} />
          <FloatingParticle delay={2} duration={4} x="50%" y="30%" size={4} />
          <FloatingParticle delay={2.5} duration={6} x="30%" y="50%" size={3} />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-4xl">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <motion.div
                  animate={
                    prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Binary className="w-4 h-4 text-foreground/60" />
                </motion.div>
                <span className="text-xs font-mono text-foreground/60">
                  {t('interests.hero.badge')}
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                {t('interests.hero.title')}{' '}
                <span className="text-muted-foreground">{t('interests.hero.titleHighlight')}</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                {t('interests.hero.description')}
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <p className="text-muted-foreground leading-relaxed mb-10 max-w-3xl">
                {t('interests.hero.philosophy')}
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.4} immediate>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/projects">
                    {t('interests.hero.viewProjects')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="font-mono" asChild>
                  <Link to="/contact">{t('nav.getInTouch')}</Link>
                </Button>
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Core Interests Grid */}
      <Section id="interests-core" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Sparkles className="w-3 h-3" />
              {t('interests.core.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('interests.core.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('interests.core.subtitle')}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreInterests.map((interest, index) => {
              const Icon = interest.icon
              return (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="h-full p-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all duration-300">
                    {/* Icon and title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 p-2.5 rounded-lg bg-foreground/5 border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                        <Icon className="w-5 h-5 text-foreground/70" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1">{interest.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {interest.description}
                        </p>
                      </div>
                    </div>

                    {/* Formula */}
                    <div className="mb-4 p-3 rounded-lg bg-foreground/[0.03] border border-foreground/5">
                      <Formula>{interest.formula}</Formula>
                    </div>

                    {/* Details */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {interest.details}
                    </p>

                    {/* Applications */}
                    <div className="flex flex-wrap gap-2">
                      {interest.applications.map((app) => (
                        <span
                          key={app}
                          className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-foreground/5"
                        >
                          {app}
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

      {/* Why Mathematics Section */}
      <Section id="interests-why" className="py-24 lg:py-32 relative overflow-hidden">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollFadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
                <Sigma className="w-3 h-3" />
                {t('interests.why.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                {t('interests.why.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t('interests.why.p1')}</p>
                <p>{t('interests.why.p2')}</p>
                <p>{t('interests.why.p3')}</p>
              </div>
            </ScrollFadeIn>

            {/* Decorative visualization */}
            <BlurFadeIn delay={0.2}>
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Concentric circles representing layers of abstraction */}
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-foreground/10"
                    style={{
                      transform: `scale(${1 - (i - 1) * 0.2})`,
                    }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            rotate: i % 2 === 0 ? 360 : -360,
                          }
                    }
                    transition={{
                      duration: 30 + i * 10,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                ))}

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-6 rounded-full bg-foreground/5 border border-foreground/10">
                    <Brain className="w-8 h-8 text-foreground/50" />
                  </div>
                </div>

                {/* Floating labels */}
                {[
                  { label: 'P(A|B)', angle: 45, distance: 38 },
                  { label: '∇f', angle: 135, distance: 42 },
                  { label: 'Σ', angle: 225, distance: 36 },
                  { label: 'E[X]', angle: 315, distance: 40 },
                ].map(({ label, angle, distance }) => (
                  <motion.div
                    key={label}
                    className="absolute text-xs font-mono text-foreground/40"
                    style={{
                      left: `${50 + distance * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + distance * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            opacity: [0.3, 0.6, 0.3],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: angle / 360,
                    }}
                  >
                    {label}
                  </motion.div>
                ))}
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Research Focus */}
      <Section id="interests-research" className="py-24 lg:py-32 relative">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Zap className="w-3 h-3" />
              {t('interests.research.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('interests.research.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('interests.research.subtitle')}
            </p>
          </ScrollFadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto" staggerDelay={0.1}>
            {researchFocus.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={staggerItemVariants}
                className="text-center p-6"
              >
                <div className="inline-flex p-3 rounded-lg bg-foreground/5 border border-foreground/10 mb-4">
                  <Icon className="w-5 h-5 text-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Application Section - Predictive */}
      <Section id="interests-application" className="py-24 lg:py-32 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <ScrollFadeIn className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
                <Target className="w-3 h-3" />
                {t('interests.application.badge')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t('interests.application.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                {t('interests.application.subtitle')}
              </p>
            </ScrollFadeIn>

            <BlurFadeIn delay={0.2}>
              <div className="p-8 md:p-12 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      {t('interests.application.predictive.title')}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('interests.application.predictive.description')}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {(t('interests.application.predictive.features', { returnObjects: true }) as string[]).map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                          </span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="font-mono group" asChild>
                      <Link to="/projects">
                        {t('interests.application.predictive.cta')}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  {/* Visual representation */}
                  <div className="relative aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* Simulated graph/network visualization */}
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full bg-foreground/20 border border-foreground/30"
                            style={{
                              left: `${20 + Math.cos((i * Math.PI) / 3) * 35 + 15}%`,
                              top: `${20 + Math.sin((i * Math.PI) / 3) * 35 + 15}%`,
                            }}
                            animate={
                              prefersReducedMotion
                                ? {}
                                : {
                                    scale: [1, 1.3, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }
                            }
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                        {/* Center node */}
                        <motion.div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/10 border border-foreground/30 flex items-center justify-center"
                          animate={
                            prefersReducedMotion
                              ? {}
                              : {
                                  scale: [1, 1.1, 1],
                                }
                          }
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                        >
                          <LineChart className="w-4 h-4 text-foreground/50" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="interests-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {t('interests.cta.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('interests.cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="font-mono group" asChild>
                <Link to="/contact">
                  {t('common.startConversation')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/projects">{t('common.viewProjects')}</Link>
              </Button>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
