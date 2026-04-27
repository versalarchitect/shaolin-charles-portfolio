import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Code2,
  Database,
  Terminal,
  Cpu,
  Github,
  Mail,
  Rocket,
  Globe,
  Star,
  Zap,
  GraduationCap,
  Target,
  Sparkles,
  Gauge,
  ShieldCheck,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const careerTimeline = [
  {
    year: '2024–now',
    title: 'Founder & Principal Developer',
    company: 'Predictive (Augure)',
    description: 'Building an AI-powered prediction platform with Monte Carlo simulations, 17 interconnected life domains, and 230+ field user profiles. Full-stack architecture from database design to deployment.',
    icon: Rocket,
    type: 'current' as const,
    technologies: ['React 19', 'TypeScript', 'Supabase', 'Python', 'Nx Monorepo'],
  },
  {
    year: '2024',
    title: 'CTO & Principal Software Developer',
    company: 'MyUrbanFarm.ai',
    description: 'Developed a comprehensive platform for urban farmers and corporate sponsors to manage rooftop farming initiatives with real-time analytics, role-based access, and interactive mapping.',
    icon: Globe,
    type: 'project' as const,
    technologies: ['Next.js', 'React', 'PostgreSQL', 'Maps API'],
  },
  {
    year: '2018–2023',
    title: 'Senior Full-Stack Developer',
    company: 'Various Clients & Companies',
    description: 'Architected and delivered enterprise-scale applications across fintech, healthcare, and SaaS industries. Led teams, defined technical standards, and mentored junior developers.',
    icon: Star,
    type: 'work' as const,
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
  },
  {
    year: '2015–2018',
    title: 'Tech Lead & Architect',
    company: 'Multiple Startups',
    description: 'Led development teams from 3-8 engineers. Established CI/CD pipelines, code review processes, and scalable architecture patterns. Shipped products used by millions.',
    icon: Zap,
    type: 'work' as const,
    technologies: ['React', 'Angular', 'Ruby on Rails', 'AWS'],
  },
  {
    year: '2010–2015',
    title: 'Full-Stack Developer',
    company: 'Agencies & Product Companies',
    description: 'Transitioned to full-stack development, building end-to-end solutions for various clients. Developed expertise in both frontend and backend systems.',
    icon: Code2,
    type: 'work' as const,
    technologies: ['JavaScript', 'PHP', 'MySQL', 'jQuery', 'Node.js'],
  },
  {
    year: '2005–2010',
    title: 'Web Developer',
    company: 'Freelance & Early Career',
    description: 'Started professional journey at 16. Built websites, learned server administration, and developed foundational skills that would shape a 20-year career.',
    icon: GraduationCap,
    type: 'start' as const,
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  },
]

const skillCategories = [
  {
    title: 'Frontend',
    icon: Code2,
    skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'React Query'],
  },
  {
    title: 'Backend',
    icon: Database,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'DevOps & Tools',
    icon: Terminal,
    skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Nx Monorepo'],
  },
  {
    title: 'Architecture',
    icon: Cpu,
    skills: ['System Design', 'Microservices', 'Event-Driven', 'DDD', 'Performance', 'Security'],
  },
]

const philosophyItems = [
  {
    icon: Target,
    title: 'Fix Root Causes',
    desc: 'Address underlying issues rather than working around symptoms. Build proper infrastructure instead of creating technical debt.',
  },
  {
    icon: Sparkles,
    title: 'Elegant Simplicity',
    desc: 'The best code is simple, maintainable, and solves real problems. Complexity should only exist where it adds value.',
  },
  {
    icon: Gauge,
    title: 'Performance First',
    desc: 'Optimize for speed at every layer. Sub-200ms response times, efficient bundling, and thoughtful resource management.',
  },
  {
    icon: ShieldCheck,
    title: 'Type Safety',
    desc: 'Leverage TypeScript\'s strict mode for catching errors at compile time and improving developer experience.',
  },
]

export default function Instructor() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Meet the Instructor — Charles Jackson"
        description="20+ years building production systems. Founder of Predictive (Augure), creator of NxSupabase, and instructor of the Agentic SaaS Course. Based in Montreal, Canada."
        path="/instructor"
        image="/og-image.png"
        imageAlt="Meet the Instructor — Charles Jackson: 20+ years building production systems"
        type="profile"
        keywords="charles jackson developer, software instructor montreal, full stack developer, ai development teacher, predictive augure founder, nxsupabase creator, 20 years experience"
        jsonLd={{
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Charles Jackson',
            jobTitle: 'Software Instructor',
            description: '20+ years building production systems, now teaching the principles that matter.',
            url: 'https://shaolincharles.dev/instructor',
            image: 'https://shaolincharles.dev/og-image.png',
            sameAs: ['https://github.com/versalarchitect'],
            knowsAbout: ['React', 'Next.js', 'TypeScript', 'Python', 'Supabase', 'Claude Code', 'Vercel', 'Software Architecture'],
            address: { '@type': 'PostalAddress', addressLocality: 'Montreal', addressRegion: 'Quebec', addressCountry: 'CA' },
          },
        }}
      />

      {/* Hero */}
      <Section id="instructor-hero" className="relative min-h-[70vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <BlurFadeIn delay={0} immediate>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  20+ Years Experience
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                Building software since{' '}
                <span className="text-muted-foreground">2005</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
                <p>
                  I started coding at 16 and never stopped. Two decades later, I've shipped products used by millions, led engineering teams, and built platforms from the ground up.
                </p>
                <p>
                  Now I teach the principles I wish someone had taught me — not the syntax that goes stale, but the judgment that compounds.
                </p>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/curriculum">
                    See the Curriculum
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

      {/* Stats */}
      <Section id="instructor-stats" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {[
              { value: 20, suffix: '+', label: 'Years Experience' },
              { value: 50, suffix: '+', label: 'Projects Shipped' },
              { value: 8, suffix: '+', label: 'Teams Led' },
              { value: 1, suffix: 'M+', label: 'Users Impacted' },
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

      {/* Career Timeline */}
      <Section id="instructor-career" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              20 Years of Building
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              From writing my first lines of code at 16 to leading engineering teams and founding startups
            </p>
          </ScrollFadeIn>

          <div className="max-w-3xl">
            <div className="relative">
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
                      <div
                        className={`absolute left-4 -translate-x-1/2 w-2 h-2 rounded-full mt-2 ${
                          item.type === 'current' ? 'bg-foreground' : 'bg-foreground/30'
                        }`}
                      />

                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">{item.year}</span>
                          {item.type === 'current' && (
                            <span className="text-xs font-mono text-green-500 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Current
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.company}</p>
                        <p className="text-muted-foreground leading-relaxed mb-4">{item.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span key={tech} className="text-xs font-mono text-muted-foreground">
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

      {/* Skills */}
      <Section id="instructor-skills" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Skills & Technologies
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Two decades of accumulated expertise across the full stack
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
                    <span key={skill} className="text-sm text-foreground">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Philosophy */}
      <Section id="instructor-philosophy" className="py-24 lg:py-32 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How I Work
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Principles that guide every line of code I write — and every lesson I teach
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
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="instructor-cta" className="py-24 lg:py-32 relative">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Let's build something worth shipping.
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether you're enrolling in the course or just want to connect — I'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" className="font-mono group" asChild>
                <Link to="/tiers">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/projects">View Projects</Link>
              </Button>
            </div>

            <div className="flex justify-center gap-3">
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
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
