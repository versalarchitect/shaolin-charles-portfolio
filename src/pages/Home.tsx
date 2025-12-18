import { useEffect, useState, useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  useReducedMotion,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowDown,
  Github,
  Mail,
  ExternalLink,
  Sparkles,
  Terminal,
  Code2,
  Lightbulb,
  Rocket,
  Wrench,
  MessageSquare,
  Check,
} from 'lucide-react'
import { InteractiveTerminal } from '@/components/interactive-terminal'
import { OverlappingTerminals } from '@/components/overlapping-terminals'
import { BentoGrid, SkillBadges } from '@/components/bento-grid'
import { Timeline } from '@/components/timeline'
import { Testimonials } from '@/components/testimonials'
import {
  TiltCard,
  SpotlightCard,
  ScrollFadeIn,
  BlurFadeIn,
  Magnetic,
  AnimatedNumber,
  StaggerContainer,
  staggerItemVariants,
  GlowBorder,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

// Animated text that types out
function TypewriterText({ texts, className = '' }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const text = texts[currentIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1))
          } else {
            setIsDeleting(false)
            setCurrentIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 30 : 80
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, texts])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  )
}

// Magnetic button
function _MagneticButton({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 20, stiffness: 200 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated counter
function _AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
  const displayValue = useTransform(springValue, (val) => Math.floor(val))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = displayValue.on('change', (val) => {
      setDisplay(val)
    })
    return () => unsubscribe()
  }, [displayValue])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

// Scroll indicator
function ScrollIndicator() {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs font-mono">{t('common.scrollToExplore')}</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  useScroll()
  const prefersReducedMotion = useReducedMotion()
  const { t } = useTranslation()

  // Services data with translations
  const services = [
    {
      id: 'full-stack',
      icon: Code2,
      title: t('home.services.fullStack.title'),
      subtitle: t('home.services.fullStack.subtitle'),
      description: t('home.services.fullStack.description'),
      highlights: t('home.services.fullStack.highlights', { returnObjects: true }) as string[],
      tags: t('home.services.fullStack.tags', { returnObjects: true }) as string[],
    },
    {
      id: 'consulting',
      icon: Lightbulb,
      title: t('home.services.consulting.title'),
      subtitle: t('home.services.consulting.subtitle'),
      description: t('home.services.consulting.description'),
      highlights: t('home.services.consulting.highlights', { returnObjects: true }) as string[],
      tags: t('home.services.consulting.tags', { returnObjects: true }) as string[],
    },
    {
      id: 'mvp',
      icon: Rocket,
      title: t('home.services.mvp.title'),
      subtitle: t('home.services.mvp.subtitle'),
      description: t('home.services.mvp.description'),
      highlights: t('home.services.mvp.highlights', { returnObjects: true }) as string[],
      tags: t('home.services.mvp.tags', { returnObjects: true }) as string[],
    },
    {
      id: 'code-review',
      icon: Wrench,
      title: t('home.services.codeReview.title'),
      subtitle: t('home.services.codeReview.subtitle'),
      description: t('home.services.codeReview.description'),
      highlights: t('home.services.codeReview.highlights', { returnObjects: true }) as string[],
      tags: t('home.services.codeReview.tags', { returnObjects: true }) as string[],
    },
  ]

  // Typewriter texts with translations
  const typewriterTexts = [
    t('home.hero.typewriter.intelligentSystems'),
    t('home.hero.typewriter.beautifulInterfaces'),
    t('home.hero.typewriter.scalablePlatforms'),
  ]

  return (
    <>
      <SEO
        title={t('home.meta.title')}
        description={t('home.meta.description')}
        path=""
        image="/og-image.png"
        imageAlt="Charles Jackson - Full Stack Developer | Building intelligent systems and scalable platforms"
        keywords="full stack developer, react developer, typescript, python, software engineer, montreal developer, charles jackson, predictive, augure"
      />

      {/* Hero Section */}
      <Section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <SectionSpots variant="hero" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Content */}
            <div className="max-w-2xl">
              {/* Status indicator with glow effect */}
              <BlurFadeIn delay={0} immediate>
                <GlowBorder
                  className="inline-block rounded-full"
                  glowColor="rgba(255,255,255,0.1)"
                  glowSize={8}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full">
                    <motion.div
                      animate={
                        prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                    <span className="text-xs font-mono text-foreground/60">
                      {t('common.shippingCode')}
                    </span>
                  </div>
                </GlowBorder>
              </BlurFadeIn>

              {/* Main heading with character reveal */}
              <div className="mt-8 mb-6">
                <BlurFadeIn delay={0.1} immediate>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
                    <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent whitespace-nowrap animate-gradient-text bg-[length:200%_200%]">
                      Charles Jackson
                    </span>
                  </h1>
                </BlurFadeIn>

                <BlurFadeIn delay={0.2} immediate>
                  <div className="h-10 md:h-12 flex items-center">
                    <p className="text-xl md:text-2xl text-muted-foreground">
                      {t('home.hero.tagline')}{' '}
                      <TypewriterText
                        texts={typewriterTexts}
                        className="text-foreground font-semibold"
                      />
                    </p>
                  </div>
                </BlurFadeIn>
              </div>

              {/* Description with text reveal */}
              <BlurFadeIn delay={0.3} immediate>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {t('home.hero.description')}{' '}
                  <span className="text-foreground font-medium relative">
                    {t('home.hero.predictive')}
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-foreground/50 to-transparent" />
                  </span>
                  {t('home.hero.aiPlatform')}
                </p>
              </BlurFadeIn>

              {/* CTA Buttons with magnetic effect */}
              <BlurFadeIn delay={0.4} immediate>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Magnetic strength={0.2}>
                    <Button
                      size="lg"
                      className="h-12 px-8 font-mono group relative overflow-hidden"
                      asChild
                    >
                      <Link to="/projects">
                        <span className="relative z-10 flex items-center">
                          {t('common.viewMyWork')}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.5 }}
                        />
                      </Link>
                    </Button>
                  </Magnetic>
                  <Magnetic strength={0.2}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 px-8 font-mono group"
                      asChild
                    >
                      <Link to="/contact">
                        {t('common.letsTalk')}
                        <motion.span
                          className="inline-block ml-2"
                          animate={prefersReducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Mail className="h-4 w-4" />
                        </motion.span>
                      </Link>
                    </Button>
                  </Magnetic>
                </div>
              </BlurFadeIn>

              {/* Social links */}
              <BlurFadeIn delay={0.5} immediate>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Github, href: 'https://github.com/versalarchitect', label: 'GitHub' },
                    { icon: Mail, href: 'mailto:hello@charlesjackson.dev', label: 'Email' },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target={href.startsWith('mailto') ? undefined : '_blank'}
                      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                      aria-label={label}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-11 h-11 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-foreground/10 transition-all duration-300"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </BlurFadeIn>
            </div>

            {/* Right side - Floating badges */}
            <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
              {/* Floating tech badges */}
              {[
                { text: 'React', x: '10%', y: '15%', delay: 0 },
                { text: 'TypeScript', x: '60%', y: '5%', delay: 0.1 },
                { text: 'Supabase', x: '75%', y: '25%', delay: 0.2 },
                { text: 'Tailwind', x: '5%', y: '45%', delay: 0.3 },
                { text: 'Node.js', x: '65%', y: '50%', delay: 0.4 },
                { text: 'PostgreSQL', x: '25%', y: '70%', delay: 0.5 },
                { text: 'Nx Monorepo', x: '70%', y: '75%', delay: 0.6 },
                { text: 'Vercel', x: '15%', y: '85%', delay: 0.7 },
              ].map((badge, i) => (
                <motion.div
                  key={badge.text}
                  className="absolute"
                  style={{ left: badge.x, top: badge.y }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: badge.delay, duration: 0.5, type: 'spring' }}
                >
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? {}
                        : {
                            y: [0, -12, 0],
                            rotate: [0, i % 2 === 0 ? 2 : -2, 0],
                          }
                    }
                    transition={{
                      duration: 5 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="px-4 py-2 backdrop-blur-sm border rounded-full font-mono whitespace-nowrap bg-foreground/5 border-foreground/10 text-foreground/60 text-xs hover:border-foreground/30 hover:text-foreground/80 transition-all cursor-default"
                  >
                    {badge.text}
                  </motion.div>
                </motion.div>
              ))}

              {/* Central featured badge */}
              <motion.div
                className="absolute"
                style={{ left: '30%', top: '35%' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="px-6 py-3 backdrop-blur-md border rounded-lg font-mono bg-foreground/10 border-foreground/20 text-foreground text-sm shadow-lg">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {t('common.openToCollaboration')}
                  </span>
                </div>
              </motion.div>

              {/* Decorative rotating rings */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-foreground/5"
                animate={prefersReducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-dashed border-foreground/[0.04]"
                animate={prefersReducedMotion ? {} : { rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-foreground/[0.03]"
                animate={prefersReducedMotion ? {} : { rotate: 180 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </Section>

      {/* Terminal Section */}
      <Section id="terminal" className="relative py-24 lg:py-32 overflow-hidden min-h-[600px]">
        <SectionSpots variant="subtle" />

        {/* Overlapping terminals background */}
        <OverlappingTerminals className="z-0" count={6} />

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Terminal className="w-3 h-3" />
              {t('home.terminal.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('home.terminal.title')}
            </h2>
          </motion.div>

          <InteractiveTerminal />
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services" className="relative py-24 lg:py-32">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Wrench className="w-3 h-3" />
              {t('home.services.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('home.services.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.services.subtitle')}</p>
          </ScrollFadeIn>

          <BlurFadeIn delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" defaultValue="full-stack">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={service.id} index={index}>
                      <AccordionTrigger
                        value={service.id}
                        subtitle={service.subtitle}
                        icon={<service.icon className="w-6 h-6 text-foreground/70" />}
                      >
                        {service.title}
                      </AccordionTrigger>
                      <AccordionContent value={service.id}>
                        <div className="space-y-6">
                          <p className="text-muted-foreground leading-relaxed text-base">
                            {service.description}
                          </p>

                          {/* Highlights */}
                          <ul className="space-y-3">
                            {service.highlights.map((highlight, i) => (
                              <motion.li
                                key={highlight}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3 text-sm"
                              >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 mt-0.5">
                                  <Check className="h-3 w-3 text-foreground/70" />
                                </span>
                                <span className="text-foreground/80">{highlight}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {service.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs font-mono rounded-full bg-foreground/[0.06] border border-foreground/10 text-foreground/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </BlurFadeIn>
        </div>
      </Section>

      {/* Skills Bento Grid */}
      <Section id="skills" className="relative py-24 lg:py-32">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('home.skills.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.skills.subtitle')}</p>
          </motion.div>

          <BentoGrid />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <SkillBadges />
          </motion.div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section id="stats" className="relative py-24 lg:py-32">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={0.15}>
            {[
              { value: 20, suffix: '+', label: t('common.yearsExperience') },
              { value: 50, suffix: '+', label: t('common.projectsShipped') },
              { value: 25, suffix: '+', label: t('common.technologies') },
              { value: 100, suffix: '%', label: t('common.typeCoverage') },
            ].map(({ value, suffix, label }) => (
              <motion.div key={label} variants={staggerItemVariants} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="text-4xl md:text-5xl font-bold font-mono mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  <AnimatedNumber value={value} suffix={suffix} duration={2} />
                </motion.div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
                  {label}
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Featured Project */}
      <Section id="featured-project" className="relative py-24 lg:py-32 overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Sparkles className="w-3 h-3" />
              {t('home.featuredProject.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              {t('home.featuredProject.title')}
            </h2>
          </ScrollFadeIn>

          <BlurFadeIn delay={0.2}>
            <TiltCard tiltAmount={5} glareEnabled={true} glareOpacity={0.05} perspective={2000}>
              <SpotlightCard spotlightColor="rgba(255,255,255,0.05)" spotlightSize={500}>
                <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-background to-foreground/[0.02]">
                  <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-mono rounded flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {t('common.live')}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            2024 - {t('common.present')}
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold">
                          {t('home.featuredProject.subtitle')}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed">
                          {t('home.featuredProject.description')}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {['React 19', 'TypeScript', 'Supabase', 'Nx Monorepo', 'Vercel'].map(
                            (tech) => (
                              <motion.span
                                key={tech}
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="px-3 py-1 bg-foreground/5 text-xs font-mono rounded-full border border-foreground/10 hover:border-foreground/20 transition-colors cursor-default"
                              >
                                {tech}
                              </motion.span>
                            )
                          )}
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <Magnetic strength={0.2}>
                            <Button className="gap-2 font-mono group" asChild>
                              <Link to="/projects">
                                {t('home.featuredProject.viewCaseStudy')}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </Magnetic>
                          <Magnetic strength={0.2}>
                            <Button variant="outline" className="gap-2 font-mono group" asChild>
                              <a
                                href="https://augure.app"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {t('common.liveDemo')}
                                <ExternalLink className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                              </a>
                            </Button>
                          </Magnetic>
                        </div>
                      </div>

                      {/* Stats grid with staggered animation */}
                      <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.08}>
                        {[
                          {
                            value: 98,
                            label: t('home.featuredProject.lighthouseScore'),
                            suffix: '',
                          },
                          {
                            value: 200,
                            label: t('home.featuredProject.p95Response'),
                            prefix: '<',
                            suffix: 'ms',
                          },
                          {
                            value: 47,
                            label: t('home.featuredProject.initialBundle'),
                            suffix: 'KB',
                          },
                          { value: 150, label: t('home.featuredProject.components'), suffix: '+' },
                          { value: 17, label: t('home.featuredProject.lifeDomains'), suffix: '' },
                          {
                            value: 1000,
                            label: t('home.featuredProject.domainNodes'),
                            suffix: '+',
                          },
                        ].map(({ value, label, prefix = '', suffix }) => (
                          <motion.div
                            key={label}
                            variants={staggerItemVariants}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="p-4 bg-foreground/[0.02] rounded-lg border border-foreground/10 hover:border-foreground/20 transition-all cursor-default group"
                          >
                            <div className="text-2xl font-bold font-mono group-hover:text-foreground transition-colors">
                              {prefix}
                              <AnimatedNumber value={value} suffix={suffix} duration={1.5} />
                            </div>
                            <div className="text-xs text-muted-foreground">{label}</div>
                          </motion.div>
                        ))}
                      </StaggerContainer>
                    </div>
                  </div>
                </Card>
              </SpotlightCard>
            </TiltCard>
          </BlurFadeIn>
        </div>
      </Section>

      {/* Timeline Section */}
      <Section id="timeline" className="relative py-24 lg:py-32">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('home.timeline.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('home.timeline.subtitle')}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Timeline />
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="relative py-24 lg:py-32">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <MessageSquare className="w-3 h-3" />
              {t('home.testimonials.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </motion.div>

          <Testimonials />
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="cta" className="relative py-32 lg:py-40 overflow-hidden">
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
                <span className="text-xs font-mono text-muted-foreground">
                  {t('common.shippingCode')}
                </span>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t('home.cta.title')}{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  {t('home.cta.titleHighlight')}
                </span>
              </h2>
            </ScrollFadeIn>

            <BlurFadeIn delay={0.1}>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                {t('home.cta.subtitle')}
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Magnetic strength={0.15}>
                  <Button size="lg" className="h-14 px-10 font-mono group" asChild>
                    <Link to="/contact">
                      {t('common.startConversation')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-10 font-mono group"
                    asChild
                  >
                    <a href="mailto:hello@charlesjackson.dev">
                      <Mail className="mr-2 h-4 w-4" />
                      hello@charlesjackson.dev
                    </a>
                  </Button>
                </Magnetic>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3}>
              <motion.a
                href="https://github.com/versalarchitect"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-foreground/5 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-foreground/10 transition-all"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </BlurFadeIn>

          </div>
        </div>
      </Section>
    </>
  )
}
