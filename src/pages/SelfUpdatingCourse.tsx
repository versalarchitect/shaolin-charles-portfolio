import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  RefreshCw,
  BookOpen,
  Check,
  TrendingUp,
  Layers,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Section, SectionSpots } from '@/components/ui/gradient-background'
import {
  ScrollFadeIn,
  BlurFadeIn,
  AnimatedNumber,
  SpotlightCard,
  StaggerContainer,
  staggerItemVariants,
} from '@/components/ui/aaa-effects'
import { useCourseStats, timeAgo } from '@/hooks/use-course-stats'

const PROMISE_KEYS = [
  {
    icon: RefreshCw,
    titleKey: 'selfUpdatingCourse.promises.alwaysCurrent.title',
    descKey: 'selfUpdatingCourse.promises.alwaysCurrent.description',
  },
  {
    icon: ShieldCheck,
    titleKey: 'selfUpdatingCourse.promises.factVerified.title',
    descKey: 'selfUpdatingCourse.promises.factVerified.description',
  },
  {
    icon: Clock,
    titleKey: 'selfUpdatingCourse.promises.realTimeAwareness.title',
    descKey: 'selfUpdatingCourse.promises.realTimeAwareness.description',
  },
  {
    icon: TrendingUp,
    titleKey: 'selfUpdatingCourse.promises.transparentFreshness.title',
    descKey: 'selfUpdatingCourse.promises.transparentFreshness.description',
  },
]

const MODULES = [
  {
    number: '01',
    title: 'Foundations of Agentic Engineering',
    lessons: 3,
    tags: ['Claude Models', 'Messages API', 'Pricing'],
  },
  {
    number: '02',
    title: 'Building with LLM APIs',
    lessons: 3,
    tags: ['Tool Use', 'Prompt Caching', 'Extended Thinking'],
  },
  {
    number: '03',
    title: 'Production Patterns & Tooling',
    lessons: 3,
    tags: ['Computer Use', 'Batch Processing', 'Agentic Patterns'],
  },
]

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-foreground/5 animate-pulse rounded ${className}`} />
}

function StatCard({
  label,
  value,
  loading,
}: {
  label: string
  value: number
  loading: boolean
}) {
  return (
    <div className="text-center">
      {loading ? (
        <Skeleton className="h-10 w-16 mx-auto mb-1" />
      ) : (
        <span className="text-3xl md:text-4xl font-bold font-mono text-foreground">
          <AnimatedNumber value={value} />
        </span>
      )}
      <p className="text-xs font-mono text-foreground/40 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  )
}

export default function SelfUpdatingCourse() {
  const { t } = useTranslation()
  const { stats, loading } = useCourseStats()

  return (
    <>
      <SEO
        title={t('selfUpdatingCourse.meta.title')}
        description={t('selfUpdatingCourse.meta.description')}
        path="self-updating-course"
        keywords="self-updating ai course, always current ai course, ai for entrepreneurs, never outdated, verified ai content"
      />

      {/* Hero */}
      <Section id="hero" className="relative min-h-screen flex items-center px-6 lg:px-8">
        <SectionSpots variant="hero" />
        <div className="relative max-w-4xl mx-auto text-center">
          <BlurFadeIn delay={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.02] text-xs font-mono uppercase tracking-widest text-foreground/60 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              {t('selfUpdatingCourse.hero.badge')}
            </span>
          </BlurFadeIn>

          <BlurFadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              {t('selfUpdatingCourse.hero.title')}
              <br />
              {t('selfUpdatingCourse.hero.titleBreak')}
            </h1>
          </BlurFadeIn>

          <BlurFadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t('selfUpdatingCourse.hero.subtitle')}
            </p>
          </BlurFadeIn>

          <BlurFadeIn delay={0.3}>
            <div className="grid grid-cols-3 gap-6 md:gap-8 mb-12 max-w-lg mx-auto">
              <StatCard label={t('selfUpdatingCourse.hero.verifiedFacts')} value={stats?.activeFacts ?? 0} loading={loading} />
              <StatCard label={t('selfUpdatingCourse.hero.lessons')} value={stats?.lessons ?? 0} loading={loading} />
              <StatCard label={t('selfUpdatingCourse.hero.modules')} value={stats?.modules ?? 0} loading={loading} />
            </div>
          </BlurFadeIn>

          <BlurFadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button asChild size="lg" className="h-12 px-8 font-mono group">
                <Link to="/curriculum">
                  {t('selfUpdatingCourse.hero.exploreCurriculum')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 font-mono">
                <Link to="/tiers">
                  {t('selfUpdatingCourse.hero.viewPricing')}
                </Link>
              </Button>
            </div>
          </BlurFadeIn>

          <BlurFadeIn delay={0.5}>
            <p className="text-xs font-mono text-foreground/30">
              {loading ? (
                <Skeleton className="h-4 w-36 mx-auto" />
              ) : stats?.lastPipelineRun ? (
                <>{t('selfUpdatingCourse.hero.contentLastVerified')} {timeAgo(stats.lastPipelineRun)}</>
              ) : null}
            </p>
          </BlurFadeIn>
        </div>
      </Section>

      {/* What Makes This Course Different */}
      <Section id="promises" className="relative py-24 lg:py-32 px-6 lg:px-8">
        <SectionSpots variant="subtle" />
        <div className="relative max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              {t('selfUpdatingCourse.promises.title')}
            </h2>
            <p className="text-foreground/50 text-center max-w-xl mx-auto mb-16">
              {t('selfUpdatingCourse.promises.subtitle')}
            </p>
          </ScrollFadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.1}>
            {PROMISE_KEYS.map((item, i) => (
              <motion.div
                key={item.titleKey}
                variants={staggerItemVariants}
                className="relative rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 hover:border-foreground/15 transition-colors"
              >
                <div className="absolute -right-2 -top-2 text-[80px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none font-mono">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-foreground/5 mb-4">
                  <item.icon className="h-5 w-5 text-foreground/60" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* Course Freshness */}
      <Section id="freshness" className="relative py-24 lg:py-32 px-6 lg:px-8">
        <SectionSpots variant="accent" />
        <div className="relative max-w-3xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              {t('selfUpdatingCourse.freshness.title')}
            </h2>
            <p className="text-foreground/50 text-center max-w-xl mx-auto mb-12">
              {t('selfUpdatingCourse.freshness.subtitle')}
            </p>
          </ScrollFadeIn>

          <ScrollFadeIn delay={0.1}>
            <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {loading ? <Skeleton className="h-8 w-12" /> : <AnimatedNumber value={stats?.activeFacts ?? 0} />}
                  </p>
                  <p className="text-xs font-mono text-foreground/40 mt-1">{t('selfUpdatingCourse.freshness.verifiedFacts')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {loading ? <Skeleton className="h-8 w-12" /> : <AnimatedNumber value={stats?.contentBlocks ?? 0} />}
                  </p>
                  <p className="text-xs font-mono text-foreground/40 mt-1">{t('selfUpdatingCourse.freshness.contentSections')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {loading ? <Skeleton className="h-8 w-12" /> : <AnimatedNumber value={stats?.sourceEvents ?? 0} />}
                  </p>
                  <p className="text-xs font-mono text-foreground/40 mt-1">{t('selfUpdatingCourse.freshness.sourcesIndexed')}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono text-foreground">
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : stats?.lastPipelineRun ? (
                      <span className="text-green-500">{timeAgo(stats.lastPipelineRun)}</span>
                    ) : (
                      '...'
                    )}
                  </p>
                  <p className="text-xs font-mono text-foreground/40 mt-1">{t('selfUpdatingCourse.freshness.lastVerified')}</p>
                </div>
              </div>

              {!loading && stats?.factsByCategory && (
                <div className="space-y-2 pt-4 border-t border-foreground/5">
                  <p className="text-xs font-mono text-foreground/30 uppercase tracking-wider mb-3">{t('selfUpdatingCourse.freshness.knowledgeCoverage')}</p>
                  {Object.entries(stats.factsByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, count]) => {
                      const max = Math.max(...Object.values(stats.factsByCategory))
                      const pct = max > 0 ? (count / max) * 100 : 0
                      return (
                        <div key={category} className="flex items-center gap-3">
                          <span className="text-xs text-foreground/50 w-32 capitalize truncate">
                            {category.replace(/_/g, ' ')}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-foreground/20"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            />
                          </div>
                          <span className="text-xs font-mono text-foreground/40 w-8 text-right">{count}</span>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </ScrollFadeIn>
        </div>
      </Section>

      {/* Course Curriculum */}
      <Section id="curriculum" className="relative py-24 lg:py-32 px-6 lg:px-8">
        <SectionSpots variant="default" />
        <div className="relative max-w-5xl mx-auto">
          <ScrollFadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
              {t('selfUpdatingCourse.courseSection.title')}
            </h2>
            <p className="text-foreground/50 text-center max-w-xl mx-auto mb-16">
              {t('selfUpdatingCourse.courseSection.subtitle')}
            </p>
          </ScrollFadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4" staggerDelay={0.15}>
            {MODULES.map((mod) => (
              <motion.div key={mod.number} variants={staggerItemVariants}>
                <SpotlightCard className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 h-full hover:border-foreground/15 transition-colors">
                  <div className="relative">
                    <div className="absolute -right-2 -top-2 text-[64px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none font-mono">
                      {mod.number}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="h-4 w-4 text-foreground/40" />
                      <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">
                        {t('selfUpdatingCourse.courseSection.module')} {mod.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-sm text-foreground/50 mb-5">{mod.lessons} {t('selfUpdatingCourse.courseSection.lessons')}</p>
                    <div className="flex flex-wrap gap-2">
                      {mod.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </Section>

      {/* CTA */}
      <Section id="cta" className="relative py-24 lg:py-32 px-6 lg:px-8">
        <SectionSpots variant="hero" />
        <div className="relative max-w-2xl mx-auto text-center">
          <ScrollFadeIn>
            <Layers className="h-8 w-8 text-foreground/20 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('selfUpdatingCourse.cta.title')}
            </h2>
            <p className="text-foreground/50 mb-8 max-w-lg mx-auto">
              {t('selfUpdatingCourse.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 font-mono group">
                <Link to="/tiers">
                  {t('selfUpdatingCourse.cta.enrollNow')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 font-mono">
                <Link to="/curriculum">
                  {t('selfUpdatingCourse.cta.viewFullCurriculum')}
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/40">
              {(['selfUpdatingCourse.cta.factVerifiedContent', 'selfUpdatingCourse.cta.alwaysCurrent', 'selfUpdatingCourse.cta.transparentFreshness'] as const).map((key) => (
                <span key={key} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  {t(key)}
                </span>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
