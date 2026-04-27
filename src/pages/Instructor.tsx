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
  LineChart,
  Network,
  Brain,
  MessageSquareText,
  TrendingUp,
  Sigma,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const careerTimeline = [
  {
    year: '2026–now',
    title: 'Founder',
    company: 'Cursuum',
    description: 'Building the industry-adaptive scheduling engine that learns you, predicts availability, and never lets relationships go cold. 12 vertical configurations with energy-aware scheduling and AI-powered detection.',
    icon: Rocket,
    type: 'current' as const,
    technologies: ['AI', 'Scheduling', 'SaaS'],
  },
  {
    year: '2016–now',
    title: 'CTO & CAIO',
    company: 'MicroHabitat',
    description: '9+ years leading technology and AI strategy for MicroHabitat — the world\'s largest urban farming network. 250+ rooftop farms across 22+ cities, B Corp certified. Overseeing technology management, UX, and the full product lifecycle.',
    icon: Globe,
    type: 'current' as const,
    technologies: ['Technology Management', 'UX', 'AI Strategy'],
    highlight: '250+ farms · 22+ cities',
  },
  {
    year: '2021',
    title: 'Software Developer',
    company: 'Cook it',
    description: 'Built the Starterweek feature where consumers customize their first meal kit. Cook it — Canada\'s first meal kit company — raised $17M+, scaled to 500+ employees, and was acquired by Fresh Prep in 2024.',
    icon: Code2,
    type: 'work' as const,
    technologies: ['React', 'Redux', 'Styled Components', 'Node.js'],
    highlight: '$17M raised · Acquired 2024',
  },
  {
    year: '2017',
    title: 'Software Developer',
    company: 'nesto',
    description: 'Developed a custom theme for the company prior to its fundraising. nesto has since raised $165M+ CAD, grown to 1,100+ employees, serves 450,000+ Canadians, and administers $63B+ in mortgage assets. Now Canada\'s largest tech-enabled mortgage lender.',
    icon: TrendingUp,
    type: 'work' as const,
    technologies: ['JavaScript', 'WordPress'],
    highlight: '$165M+ raised · 1,100 employees',
  },
  {
    year: '2017',
    title: 'Software Developer',
    company: 'Crew Collective & Café',
    description: 'Worked with Harris Kalash on one of the company\'s pages. Crew — the freelancer marketplace that also spawned Unsplash — was acquired by Dribbble in 2017. Clients included Dropbox, Medium, and Tinder.',
    icon: Star,
    type: 'work' as const,
    technologies: ['React.js'],
    highlight: 'Acquired by Dribbble · Spawned Unsplash',
  },
  {
    year: '2016',
    title: 'Software Developer',
    company: 'Dialogue',
    description: 'Developed the company\'s presentational website in its early beginnings. Dialogue went on to raise $200M+ CAD, IPO\'d on the TSX, and was acquired by Sun Life Financial for $277M CAD. Now Canada\'s leading virtual healthcare platform.',
    icon: Zap,
    type: 'work' as const,
    technologies: ['Frontend Development'],
    highlight: '$277M exit to Sun Life',
  },
  {
    year: '2015',
    title: 'Software Developer',
    company: 'Bus.com',
    description: 'Participated in FounderFuel\'s 2015 cohort. Bus.com won the competition, went through Y Combinator, and has raised $27M+ CAD. Now a leading North American charter bus marketplace.',
    icon: GraduationCap,
    type: 'work' as const,
    technologies: ['jQuery', 'JavaScript', 'HTML5', 'CSS3'],
    highlight: '$27M raised · FounderFuel + YC',
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

const mathInterests = [
  {
    icon: LineChart,
    title: 'Monte Carlo Simulations',
    description: 'Probabilistic modeling through repeated random sampling',
    formula: 'E[f(X)] ≈ (1/N) Σ f(xᵢ)',
  },
  {
    icon: Network,
    title: 'Transformer Models',
    description: 'Attention-based architectures for sequence modeling',
    formula: 'Attention(Q,K,V) = softmax(QKᵀ/√d)V',
  },
  {
    icon: Brain,
    title: 'Deep Neural Networks',
    description: 'Multi-layer architectures for learning complex patterns',
    formula: 'y = σ(Wx + b)',
  },
  {
    icon: MessageSquareText,
    title: 'Natural Language Processing',
    description: 'Extracting structure and meaning from text',
    formula: 'P(w|context) = softmax(h · W)',
  },
  {
    icon: TrendingUp,
    title: 'Sentiment Analysis',
    description: 'Quantifying opinion and emotion from text',
    formula: 'sentiment ∈ [-1, 1]',
  },
  {
    icon: Sigma,
    title: 'Bayesian Inference',
    description: 'Updating beliefs with evidence',
    formula: 'P(H|E) = P(E|H)P(H) / P(E)',
  },
]

export default function Instructor() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Meet the Instructor — Charles Jackson"
        description="10+ years building production software. CTO & CAIO at MicroHabitat, Founder of Cursuum. Built products for startups that raised $400M+ combined, including a $277M exit. Based in Montreal, Canada."
        path="/instructor"
        image="/og-image.png"
        imageAlt="Meet the Instructor — Charles Jackson: 20+ years building production systems"
        type="profile"
        keywords="charles jackson developer, software instructor montreal, full stack developer, ai development teacher, cursuum founder, microhabitat cto, nesto dialogue bus.com startups"
        jsonLd={{
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Charles Jackson',
            jobTitle: 'Software Instructor',
            description: '10+ years building production software. Built products for startups that raised $400M+ combined, including a $277M exit.',
            url: 'https://charlesjackson.dev/instructor',
            image: 'https://charlesjackson.dev/og-image.png',
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
                  10+ Years Experience
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                Building software since{' '}
                <span className="text-muted-foreground">2015</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
                <p>
                  I build products for companies that go on to do big things. The startups I've worked with have collectively raised over $400M and generated a $277M exit. nesto became Canada's largest tech-enabled mortgage lender. Dialogue IPO'd and was acquired by Sun Life. Bus.com won FounderFuel and Y Combinator. Crew was acquired by Dribbble.
                </p>
                <p>
                  For 9+ years I've served as CTO & CAIO at MicroHabitat — the world's largest urban farming network. Now I'm building Cursuum, an AI scheduling engine, and teaching the principles I wish someone had taught me.
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
              { value: 10, suffix: '+', label: 'Years Experience' },
              { value: 400, suffix: 'M+', label: 'Raised by Clients' },
              { value: 277, suffix: 'M', label: 'Largest Exit' },
              { value: 7, suffix: '', label: 'Startups Built With' },
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
              Built With Startups That Raised $400M+
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              From early-stage startups to established companies — building the products that attract funding, users, and acquisitions
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

                        <div className="flex flex-wrap items-center gap-2">
                          {'highlight' in item && item.highlight && (
                            <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-foreground/10 border border-foreground/15 text-foreground/80">
                              {item.highlight}
                            </span>
                          )}
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
              A decade of accumulated expertise across the full stack
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

      {/* Mathematical Interests */}
      <Section id="instructor-interests" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-4">
              <Brain className="w-3 h-3" />
              Research Interests
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What Drives the Teaching
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              The mathematical foundations and machine learning techniques behind the course's prediction systems and AI-first approach.
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {mathInterests.map(({ icon: Icon, title, description, formula }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-foreground/5 border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                      <Icon className="w-5 h-5 text-foreground/70" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-foreground/[0.03] border border-foreground/5">
                    <span className="font-mono text-foreground/60 text-sm">{formula}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <ScrollFadeIn>
            <div className="max-w-3xl">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mathematics is the language of patterns. In a world drowning in data, mathematical models help us find signal in noise, structure in chaos, and insights in complexity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The goal isn't prediction for its own sake. It's about making better decisions under uncertainty — and teaching students to think the same way about the code they write with AI.
              </p>
            </div>
          </ScrollFadeIn>
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
