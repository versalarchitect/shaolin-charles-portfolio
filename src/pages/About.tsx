import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Code2,
  Sparkles,
  Target,
  Gauge,
  ShieldCheck,
  GraduationCap,
  Rocket,
  Star,
  Zap,
  Calendar,
  ArrowRight,
  Heart,
  Lightbulb,
  Users,
  Coffee,
  Terminal,
  Database,
  Globe,
  Cpu,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

export default function About() {
  const { t } = useTranslation()

  // Timeline data - expanded career history
  const careerTimeline = [
    {
      year: '2024',
      title: t('about.timeline.2024_founder.title'),
      company: t('about.timeline.2024_founder.company'),
      description: t('about.timeline.2024_founder.description'),
      icon: Rocket,
      type: 'current',
      technologies: ['React 19', 'TypeScript', 'Supabase', 'Python', 'Nx Monorepo'],
    },
    {
      year: '2024',
      title: t('about.timeline.2024_urbanfarm.title'),
      company: t('about.timeline.2024_urbanfarm.company'),
      description: t('about.timeline.2024_urbanfarm.description'),
      icon: Globe,
      type: 'project',
      technologies: ['Next.js', 'React', 'PostgreSQL', 'Maps API'],
    },
    {
      year: '2018-2023',
      title: t('about.timeline.2018_senior.title'),
      company: t('about.timeline.2018_senior.company'),
      description: t('about.timeline.2018_senior.description'),
      icon: Star,
      type: 'work',
      technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    },
    {
      year: '2015-2018',
      title: t('about.timeline.2015_lead.title'),
      company: t('about.timeline.2015_lead.company'),
      description: t('about.timeline.2015_lead.description'),
      icon: Zap,
      type: 'work',
      technologies: ['React', 'Angular', 'Ruby on Rails', 'AWS'],
    },
    {
      year: '2010-2015',
      title: t('about.timeline.2010_fullstack.title'),
      company: t('about.timeline.2010_fullstack.company'),
      description: t('about.timeline.2010_fullstack.description'),
      icon: Code2,
      type: 'work',
      technologies: ['JavaScript', 'PHP', 'MySQL', 'jQuery', 'Node.js'],
    },
    {
      year: '2005-2010',
      title: t('about.timeline.2005_start.title'),
      company: t('about.timeline.2005_start.company'),
      description: t('about.timeline.2005_start.description'),
      icon: GraduationCap,
      type: 'start',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    },
  ]

  // Skills organized by category
  const skillCategories = [
    {
      title: t('about.skills.frontend'),
      icon: Code2,
      skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'React Query'],
    },
    {
      title: t('about.skills.backend'),
      icon: Database,
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'],
    },
    {
      title: t('about.skills.devops'),
      icon: Terminal,
      skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Nx Monorepo'],
    },
    {
      title: t('about.skills.architecture'),
      icon: Cpu,
      skills: ['System Design', 'Microservices', 'Event-Driven', 'DDD', 'Performance', 'Security'],
    },
  ]

  // Values/philosophy
  const philosophyItems = [
    {
      icon: Target,
      title: t('about.philosophy.rootCauses.title'),
      desc: t('about.philosophy.rootCauses.description'),
    },
    {
      icon: Sparkles,
      title: t('about.philosophy.simplicity.title'),
      desc: t('about.philosophy.simplicity.description'),
    },
    {
      icon: Gauge,
      title: t('about.philosophy.performance.title'),
      desc: t('about.philosophy.performance.description'),
    },
    {
      icon: ShieldCheck,
      title: t('about.philosophy.typeSafety.title'),
      desc: t('about.philosophy.typeSafety.description'),
    },
  ]

  // Personal interests
  const interests = [
    { icon: Coffee, label: t('about.personal.interests.coffee') },
    { icon: Heart, label: t('about.personal.interests.openSource') },
    { icon: Lightbulb, label: t('about.personal.interests.problemSolving') },
    { icon: Users, label: t('about.personal.interests.mentoring') },
  ]

  return (
    <>
      <Helmet>
        <title>{t('about.meta.title')}</title>
        <meta
          name="description"
          content={t('about.meta.description')}
        />
        <meta property="og:title" content={t('about.meta.title')} />
        <meta property="og:description" content={t('about.meta.description')} />
        <meta property="og:type" content="profile" />
      </Helmet>

      {/* Hero Section */}
      <Section id="about-hero" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <BlurFadeIn delay={0} immediate>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('about.hero.experience')}
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                {t('about.hero.title')}{' '}
                <span className="text-muted-foreground">{t('about.hero.year')}</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
                <p>{t('about.hero.description')}</p>
                <p>
                  {t('about.hero.currentFocus')}{' '}
                  <span className="text-foreground font-medium">Predictive</span>
                  {t('about.hero.predictiveDesc')}
                </p>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/projects">
                    {t('common.viewMyWork')}
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

      {/* Stats Section */}
      <Section id="about-stats" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { value: 20, suffix: '+', label: t('common.yearsExperience') },
              { value: 50, suffix: '+', label: t('common.projectsShipped') },
              { value: 8, suffix: '+', label: t('common.teamsLed') },
              { value: 1, suffix: 'M+', label: t('common.usersImpacted') },
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

      {/* Career Timeline Section */}
      <Section id="about-career" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('about.career.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('about.career.subtitle')}
            </p>
          </ScrollFadeIn>

          <div className="max-w-3xl">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-foreground/10" />

              <div className="space-y-12">
                {careerTimeline.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.year + item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-4 -translate-x-1/2 w-2 h-2 rounded-full mt-2 ${
                          item.type === 'current'
                            ? 'bg-foreground'
                            : 'bg-foreground/30'
                        }`}
                      />

                      {/* Content */}
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            {item.year}
                          </span>
                          {item.type === 'current' && (
                            <span className="text-xs font-mono text-green-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              {t('common.current')}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                        {item.company && (
                          <p className="text-sm text-muted-foreground mb-3">{item.company}</p>
                        )}
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-mono text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Technical Skills Section */}
      <Section id="about-skills" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('about.skills.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('about.skills.subtitle')}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
            {skillCategories.map(({ title, icon: Icon, skills }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Philosophy Section */}
      <Section id="about-philosophy" className="py-24 lg:py-32 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('about.philosophy.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('about.philosophy.subtitle')}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl">
            {philosophyItems.map(({ icon: Icon, title, desc }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">{title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Personal Section */}
      <Section id="about-personal" className="py-24 lg:py-32 relative">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <ScrollFadeIn>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {t('about.personal.title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t('about.personal.description')}
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">{t('common.currentlyBuilding')}</h4>
                  <p className="font-medium">{t('home.featuredProject.title')}</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">{t('common.status')}</h4>
                  <p className="font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {t('common.openToCollaboration')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {interests.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                ))}
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="about-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t('about.cta.subtitle')}
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
