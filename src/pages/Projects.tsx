import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useTranslation } from 'react-i18next'
import {
  ExternalLink,
  Github,
  Shield,
  Database,
  GitBranch,
  Gauge,
  Server,
  Code2,
  Brain,
  LineChart,
  Leaf,
  Map as MapIcon,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Globe,
  Building,
  Rocket,
  Cpu,
  Gamepad2,
  Network,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import {
  BlurFadeIn,
  ScrollFadeIn,
  Magnetic,
  HoverCard3D,
  RevealOnScroll,
  GlitchText,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

// Animated counter component
function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration, bounce: 0 })
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
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// Project data - first project is the featured one with full details
const featuredProject = {
  id: 'predictive',
  title: 'Predictive (Augure)',
  subtitle: 'AI-Powered Prediction Platform',
  type: 'FEATURED PROJECT',
  status: 'live',
  year: '2024 - Present',
  role: 'Solo Developer',
  description:
    'Enterprise-grade prediction intelligence platform that models complex interdependencies across 17 life domains. Features a 230-field user profiling system, hierarchical ontology with 1,000+ domain nodes, Monte Carlo simulations, and real-time analytics dashboard.',
  longDescription:
    'Built entirely solo from architecture through deployment. The platform helps users make better decisions by analyzing patterns across multiple life domains using Bayesian inference and likelihood ratios.',
  links: {
    live: 'https://augure.app',
    github: 'https://github.com/versalarchitect/predictive',
  },
  metrics: [
    { value: 98, label: 'Lighthouse Score', color: 'green', prefix: '', suffix: '' },
    { value: 200, label: 'P95 API Response', color: '', prefix: '<', suffix: 'ms' },
    { value: 47, label: 'Initial Bundle', color: '', prefix: '', suffix: 'KB' },
    { value: 0, label: 'Runtime Errors', color: 'green', prefix: '', suffix: '' },
  ],
  techStack: [
    'React 19',
    'TypeScript 5.6',
    'Nx 21',
    'Vite 7',
    'Tailwind v4',
    'PostgreSQL 15',
    'Supabase',
    'React Query v5',
    'Python',
    'Framer Motion',
    'Playwright',
    'Vercel Edge',
  ],
  challenges: [
    {
      icon: Brain,
      title: 'Complex Data Modeling',
      desc: 'Designed ontology-based architecture to represent relationships between 17 domains with weighted edges and inheritance patterns. Recursive CTEs for efficient tree traversal.',
    },
    {
      icon: Gauge,
      title: 'Performance at Scale',
      desc: 'Achieved sub-200ms P95 latency through strategic denormalization, materialized views, and React Query caching. Code-split to 47KB initial bundle.',
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      desc: 'Row Level Security policies for multi-tenant data isolation. Zero PII in client bundles. Encrypted at rest with automatic key rotation.',
    },
  ],
  architecture: [
    {
      icon: GitBranch,
      title: 'Nx Monorepo Strategy',
      desc: 'Shared libraries for UI components, utilities, and TypeScript types. Incremental builds with computation caching reduce CI time by 60%.',
    },
    {
      icon: Database,
      title: 'PostgreSQL + Supabase',
      desc: 'Real-time subscriptions for live updates. Automatic API generation with PostgREST. GIN indexes on JSONB columns for flexible schema evolution.',
    },
    {
      icon: Server,
      title: 'Edge-First Deployment',
      desc: 'Vercel Edge Functions for API routes. Static assets on global CDN with immutable caching. Service worker for offline-first experience.',
    },
    {
      icon: Code2,
      title: 'Type-Safe Full Stack',
      desc: 'End-to-end type safety from database to UI. Generated types from PostgreSQL schema. Zod validation at API boundaries. Strict TypeScript.',
    },
  ],
  stats: [
    { value: 35, suffix: '+', label: 'Pages & Routes' },
    { value: 150, suffix: '+', label: 'React Components' },
    { value: 230, suffix: '', label: 'Profile Fields' },
    { value: 1000, suffix: '+', label: 'Domain Nodes' },
    { value: 17, suffix: '', label: 'Life Domains' },
    { value: 25, suffix: '+', label: 'Database Tables' },
    { value: 100, suffix: '%', label: 'Type Coverage' },
  ],
}

const myUrbanFarmProject = {
  id: 'myurbanfarm',
  title: 'MyUrbanFarm.ai',
  subtitle: 'Urban Farming Management Platform',
  type: 'PROJECT',
  status: 'live',
  year: '2024',
  role: 'CTO & Principal Software Developer',
  description:
    'A comprehensive digital platform connecting urban farmers, corporate sponsors, and administrators to manage and monitor sustainable rooftop farming initiatives. Real-time tracking, analytics, and multi-stakeholder collaboration.',
  longDescription:
    'Enables stakeholders across the urban agriculture ecosystem to track crops, harvests, and growing conditions. Features role-based access for farmers, sponsors, and administrators with interactive mapping and performance analytics.',
  links: {
    live: 'https://www.myurbanfarm.ai',
  },
  techStack: [
    'Next.js',
    'React',
    'TypeScript',
    'PostgreSQL',
    'Maps API',
    'Tailwind CSS',
    'Auth System',
  ],
  challenges: [
    {
      icon: MapIcon,
      title: 'Interactive Mapping',
      desc: 'Multi-site visualization with regional performance monitoring. Real-time location tracking and farm status overlays.',
    },
    {
      icon: Users,
      title: 'Role-Based Access',
      desc: 'Differentiated permissions for urban farmers, client companies, chief urban farmers, and administrators. Secure multi-tenant architecture.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      desc: 'Performance insights, yield data, and resource utilization metrics. Stakeholder reports with KPI tracking and environmental impact documentation.',
    },
  ],
  features: [
    {
      icon: Leaf,
      label: 'Farm Management',
      desc: 'Comprehensive tracking for crops, harvests, and conditions',
    },
    {
      icon: Building,
      label: 'Client Portal',
      desc: 'Real-time access for sponsors to view farm progress',
    },
    {
      icon: Globe,
      label: 'Multi-Site Support',
      desc: 'Manage multiple farm locations from one dashboard',
    },
    {
      icon: LineChart,
      label: 'Impact Reports',
      desc: 'Environmental and sustainability documentation',
    },
  ],
}

const nxSupabaseProject = {
  id: 'nxsupabase',
  title: 'NxSupabase',
  subtitle: 'Official Nx Plugin for Supabase',
  type: 'PROJECT',
  status: 'live',
  year: '2024',
  role: 'Creator & Maintainer',
  description:
    'The official Nx plugin that streamlines Supabase integration within monorepo environments. Automates database migrations, TypeScript type generation, and local development setup with zero configuration.',
  longDescription:
    'Built to solve the complexity of managing Supabase in Nx monorepos. Features smart port management for multiple concurrent instances, Nx caching for generated types, and full lifecycle support from local development to production deployment.',
  links: {
    github: 'https://github.com/nxsupabase/nxsupabase',
  },
  techStack: [
    'TypeScript',
    'Nx',
    'Supabase',
    'Node.js',
    'Docker',
    'PostgreSQL',
    'PL/pgSQL',
  ],
  challenges: [
    {
      icon: GitBranch,
      title: 'Multi-Project Support',
      desc: 'Automatic port allocation and project inference via createNodesV2 for seamless multi-project monorepo setups.',
    },
    {
      icon: Database,
      title: 'Smart Type Generation',
      desc: 'Nx-cached TypeScript types regenerated only when schema changes. Zero manual configuration with config.toml auto-detection.',
    },
    {
      icon: Server,
      title: 'Docker Orchestration',
      desc: 'Full Supabase stack orchestration with executors for local instances, migrations, and Edge Function deployment.',
    },
  ],
  features: [
    {
      icon: Code2,
      label: 'Generators',
      desc: 'Scaffold projects, migrations, Edge Functions, and seed files',
    },
    {
      icon: Server,
      label: 'Executors',
      desc: 'Manage local instances, run migrations, deploy to production',
    },
    {
      icon: Database,
      label: 'Type Safety',
      desc: 'Auto-generated TypeScript types from your database schema',
    },
    {
      icon: GitBranch,
      label: 'Nx Integration',
      desc: 'Full caching, task orchestration, and dependency graph',
    },
  ],
}

// Other smaller projects/features
const otherProjects = [
  {
    title: 'Real-Time Analytics Engine',
    description:
      'High-performance analytics dashboard with WebSocket updates, optimized virtualization for large datasets, and smooth 60fps animations.',
    tech: ['React Query', 'Supabase Realtime', 'Canvas API', 'Web Workers'],
    metrics: [
      { label: 'Chart Render', value: '<50ms' },
      { label: 'Animation', value: '60fps' },
      { label: 'Data Points', value: '10K+' },
    ],
    parent: 'Predictive',
  },
  {
    title: 'Component Design System',
    description:
      'Comprehensive design system with 150+ components following atomic design principles. Full accessibility, theme support, and consistent spacing.',
    tech: ['Radix UI', 'Tailwind CSS v4', 'CVA', 'Framer Motion'],
    metrics: [
      { label: 'Components', value: '150+' },
      { label: 'Accessible', value: '100%' },
      { label: 'Themes', value: 'Dark/Light' },
    ],
    parent: 'Predictive',
  },
  {
    title: 'Monte Carlo Simulation Engine',
    description:
      'Python-based prediction engine using Bayesian inference and likelihood ratios. Historical accuracy validation against real-world outcomes.',
    tech: ['Python', 'FastAPI', 'NumPy', 'Ollama'],
    metrics: [
      { label: 'Accuracy', value: '85%+' },
      { label: 'Response', value: '<2s' },
      { label: 'Simulations', value: '10K/run' },
    ],
    parent: 'Predictive',
  },
]

export default function Projects() {
  const _prefersReducedMotion = useReducedMotion()
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title={t('projects.meta.title')}
        description={t('projects.meta.description')}
        path="/projects"
        image="/og-projects.png"
        imageAlt="Charles Jackson Projects - AI platforms, urban agriculture tech, and browser metaverses"
        keywords="predictive platform, augure, myurbanfarm.ai, developer portfolio, react projects, typescript projects, ai platform, urban farming"
      />

      {/* Hero Section */}
      <Section
        id="projects-hero"
        className="relative min-h-[60vh] flex items-center overflow-hidden"
      >
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl">
            <BlurFadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <Rocket className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-xs font-mono text-foreground/60">
                  {t('projects.hero.badge')}
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t('projects.hero.title')}{' '}
                <GlitchText intensity={1.5}>{t('projects.hero.titleHighlight')}</GlitchText>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                {t('projects.hero.subtitle')}
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Featured Project - Predictive */}
      <Section id="projects-predictive" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <RevealOnScroll direction="up">
            <HoverCard3D className="rounded-2xl" glowColor="rgba(255, 255, 255, 0.1)" depth={40}>
              <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-background to-foreground/[0.02]">
                <div className="p-8 md:p-12 space-y-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-mono bg-foreground text-background px-3 py-1 rounded">
                          {t('common.featured')}
                        </span>
                        <span className="text-xs font-mono text-green-500 bg-green-500/10 px-3 py-1 rounded flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {t('common.live')}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          2024 - {t('common.present')}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        {featuredProject.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {t('projects.predictive.subtitle')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Magnetic strength={0.2}>
                        <Button variant="outline" className="font-mono gap-2" asChild>
                          <a
                            href={featuredProject.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                            {t('common.code')}
                          </a>
                        </Button>
                      </Magnetic>
                      <Magnetic strength={0.2}>
                        <Button className="font-mono gap-2" asChild>
                          <a
                            href={featuredProject.links.live}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t('common.liveDemo')}
                          </a>
                        </Button>
                      </Magnetic>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-foreground/5 rounded-xl">
                    {featuredProject.metrics.map((metric) => (
                      <motion.div
                        key={metric.label}
                        className="text-center group cursor-default"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div
                          className={`font-mono text-2xl md:text-3xl font-bold ${
                            metric.color === 'green' ? 'text-green-500' : ''
                          }`}
                        >
                          {metric.prefix}
                          <AnimatedCounter value={metric.value} suffix={metric.suffix || ''} />
                        </div>
                        <div className="text-xs font-mono text-muted-foreground">
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('projects.predictive.description')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('projects.predictive.longDescription')}
                    </p>
                  </div>

                  {/* Technical Challenges */}
                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                    {featuredProject.challenges.map(({ icon: Icon, title, desc }) => (
                      <motion.div
                        key={title}
                        whileHover={{ y: -4 }}
                        className="space-y-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors cursor-default"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-foreground/60" />
                          <h4 className="text-sm font-bold">{title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Architecture Decisions */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('projects.predictive.architectureTitle')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {featuredProject.architecture.map(({ icon: Icon, title, desc }, i) => (
                        <motion.div
                          key={title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="p-4 border border-border rounded-lg hover:border-foreground/20 hover:bg-foreground/5 transition-all cursor-default group"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
                            <h4 className="text-sm font-bold">{title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('common.techStack')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.techStack.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="text-xs font-mono bg-muted px-3 py-1.5 rounded cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('common.byTheNumbers')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {featuredProject.stats.map(({ value, suffix, label }, i) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="p-3 bg-foreground/5 rounded-lg group cursor-default hover:bg-foreground/10 transition-colors"
                        >
                          <div className="font-mono text-lg font-bold group-hover:text-foreground transition-colors">
                            <AnimatedCounter value={value} suffix={suffix} />
                          </div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </HoverCard3D>
          </RevealOnScroll>
        </div>
      </Section>

      {/* NxSupabase Project */}
      <Section id="projects-nxsupabase" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <RevealOnScroll direction="left">
            <HoverCard3D className="rounded-2xl" glowColor="rgba(255, 255, 255, 0.08)" depth={35}>
              <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-background to-foreground/[0.02]">
                <div className="p-8 md:p-12 space-y-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-mono text-green-500 bg-green-500/10 px-3 py-1 rounded flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {t('common.live')}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {nxSupabaseProject.year}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        {nxSupabaseProject.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {t('projects.nxsupabase.subtitle')}
                      </p>
                    </div>
                    <Magnetic strength={0.2}>
                      <Button variant="outline" className="font-mono gap-2" asChild>
                        <a
                          href={nxSupabaseProject.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                          {t('common.code')}
                        </a>
                      </Button>
                    </Magnetic>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('projects.nxsupabase.description')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('projects.nxsupabase.longDescription')}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {nxSupabaseProject.features?.map(({ icon: Icon, label, desc }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="p-4 bg-foreground/5 rounded-lg cursor-default group hover:bg-foreground/10 transition-all"
                      >
                        <Icon className="h-6 w-6 text-foreground/60 mb-3 group-hover:text-foreground/80 transition-colors" />
                        <h4 className="font-semibold mb-1">{label}</h4>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Technical Challenges */}
                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                    {nxSupabaseProject.challenges.map(({ icon: Icon, title, desc }) => (
                      <motion.div
                        key={title}
                        whileHover={{ y: -4 }}
                        className="space-y-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors cursor-default"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-foreground/60" />
                          <h4 className="text-sm font-bold">{title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('common.techStack')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {nxSupabaseProject.techStack.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="text-xs font-mono bg-muted px-3 py-1.5 rounded cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </HoverCard3D>
          </RevealOnScroll>
        </div>
      </Section>

      {/* MyUrbanFarm.ai Project */}
      <Section id="projects-urbanfarm" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <RevealOnScroll direction="right">
            <HoverCard3D className="rounded-2xl" glowColor="rgba(255, 255, 255, 0.08)" depth={35}>
              <Card className="overflow-hidden border-foreground/10">
                <div className="p-8 md:p-12 space-y-8">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-mono text-green-500 bg-green-500/10 px-3 py-1 rounded flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          {t('common.live')}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {myUrbanFarmProject.year}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">
                        {myUrbanFarmProject.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        {t('projects.urbanfarm.subtitle')}
                      </p>
                    </div>
                    <Magnetic strength={0.2}>
                      <Button className="font-mono gap-2" asChild>
                        <a
                          href={myUrbanFarmProject.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t('common.visitSite')}
                        </a>
                      </Button>
                    </Magnetic>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {t('projects.urbanfarm.description')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {t('projects.urbanfarm.longDescription')}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {myUrbanFarmProject.features?.map(({ icon: Icon, label, desc }) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="p-4 bg-foreground/5 rounded-lg cursor-default group hover:bg-foreground/10 transition-all"
                      >
                        <Icon className="h-6 w-6 text-foreground/60 mb-3 group-hover:text-foreground/80 transition-colors" />
                        <h4 className="font-semibold mb-1">{label}</h4>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Technical Challenges */}
                  <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border">
                    {myUrbanFarmProject.challenges.map(({ icon: Icon, title, desc }) => (
                      <motion.div
                        key={title}
                        whileHover={{ y: -4 }}
                        className="space-y-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors cursor-default"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-foreground/60" />
                          <h4 className="text-sm font-bold">{title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t('common.techStack')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {myUrbanFarmProject.techStack.map((tech) => (
                        <motion.span
                          key={tech}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="text-xs font-mono bg-muted px-3 py-1.5 rounded cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </HoverCard3D>
          </RevealOnScroll>
        </div>
      </Section>

      {/* Other Projects / Features */}
      <Section id="projects-features" className="py-16 lg:py-24 relative overflow-hidden">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Sparkles className="w-3 h-3" />
              {t('projects.features.badge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('projects.features.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('projects.features.subtitle')}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <RevealOnScroll
                key={project.title}
                direction={index === 1 ? 'up' : index === 0 ? 'left' : 'right'}
              >
                <HoverCard3D
                  className="h-full rounded-xl"
                  glowColor="rgba(255, 255, 255, 0.1)"
                  depth={25}
                >
                  <Card className="h-full p-6 bg-background border-foreground/10 hover:border-foreground/20 transition-all">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {t('projects.features.partOf')} {project.parent}
                        </span>
                        <h3 className="text-lg font-bold mt-1">{project.title}</h3>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>

                      {/* Mini metrics with CounterUp */}
                      <div className="grid grid-cols-3 gap-2 py-4 border-y border-border">
                        {project.metrics.map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="font-mono text-sm font-bold">{value}</div>
                            <div className="text-xs text-muted-foreground">{label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((t, i) => (
                          <motion.span
                            key={t}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            className="text-xs font-mono bg-foreground/5 px-2 py-1 rounded cursor-default"
                          >
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </HoverCard3D>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="projects-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {t('projects.cta.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">{t('projects.cta.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.15}>
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/contact">
                    {t('common.startConversation')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.15}>
                <Button size="lg" variant="outline" className="font-mono" asChild>
                  <Link to="/about">{t('common.learnAboutMe')}</Link>
                </Button>
              </Magnetic>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
