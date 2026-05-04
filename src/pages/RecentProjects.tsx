import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import { SEO } from '@/components/SEO'
import {
  ScrollFadeIn,
  BlurFadeIn,
  StaggerContainer,
  staggerItemVariants,
  SpotlightCard,
} from '@/components/ui/aaa-effects'
import { Section, SectionSpots } from '@/components/ui/gradient-background'

const PROJECTS = [
  {
    title: 'Agentic SaaS Course',
    subtitle: 'charlesjackson.dev',
    description:
      '52-hour course on multi-agent orchestration from first principles. Self-updating curriculum powered by an agentic pipeline that monitors AI documentation, extracts knowledge facts, and regenerates content when the landscape changes.',
    url: 'https://charlesjackson.dev/curriculum',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Vite', 'Tailwind v4', 'Framer Motion'],
    highlights: [
      '51 interactive lessons across 4 tiers',
      'Self-updating content via agentic pipeline',
      '284 verified knowledge facts from 59 sources',
      'Full gamification: XP, streaks, achievements',
    ],
    status: 'LIVE' as const,
    year: '2025',
  },
  {
    title: 'Aedis',
    subtitle: 'getaedis.com',
    description:
      'Next-generation platform for building and managing intelligent digital experiences. Full-stack AI-powered application with real-time collaboration, content management, and automated workflows.',
    url: 'https://getaedis.com',
    tags: ['Next.js', 'TypeScript', 'Supabase', 'AI', 'Vercel', 'Tailwind'],
    highlights: [
      'AI-powered content generation',
      'Real-time collaboration features',
      'Multi-tenant architecture',
      'Edge-first deployment on Vercel',
    ],
    status: 'LIVE' as const,
    year: '2026',
  },
  {
    title: 'MyUrbanFarm.ai',
    subtitle: 'myurbanfarm.ai',
    description:
      'Urban farming management platform connecting farmers, sponsors, and administrators. Multi-site support with impact reporting, client portals, and farm management tools.',
    url: 'https://www.myurbanfarm.ai',
    tags: ['Next.js', 'React', 'PostgreSQL', 'Maps API', 'Tailwind', 'Auth'],
    highlights: [
      'Multi-site farm management',
      'Sponsor and client portals',
      'Interactive map integration',
      'Impact reports and analytics',
    ],
    status: 'LIVE' as const,
    year: '2024',
  },
  {
    title: 'A2C Pipeline',
    subtitle: 'ac-pipeline.vercel.app',
    description:
      'Private deal pipeline for managing contracts between principals and agents. Kanban board with realtime sync, activity logging, variable commission tracking, and deadline indicators.',
    url: 'https://ac-pipeline.vercel.app',
    tags: ['React 19', 'Supabase Realtime', 'RLS', 'Vite', 'Tailwind v4'],
    highlights: [
      'Realtime sync between two users',
      'Activity log with full audit trail',
      'Variable commission (10–25%)',
      'RLS-locked to authorized emails only',
    ],
    status: 'PRIVATE' as const,
    year: '2026',
  },
]

export default function RecentProjects() {
  return (
    <>
      <SEO
        title="Recent Projects"
        description="Production systems built by Charles Jackson — from AI platforms and self-updating courses to urban farming management and developer tools."
        path="/recent-projects"
        keywords="charles jackson projects, ai platform, react projects, typescript portfolio, supabase, next.js, full stack developer"
      />

      <Section id="recent-projects-hero" className="relative pt-32 pb-16 lg:pt-40 lg:pb-20">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <BlurFadeIn delay={0} immediate>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-mono text-foreground/40 hover:text-foreground/70 transition-colors mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
          </BlurFadeIn>

          <BlurFadeIn delay={0.1} immediate>
            <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest">Portfolio</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Recent Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Production systems I've built and shipped — from AI platforms and self-updating courses
              to urban farming management and private deal pipelines.
            </p>
          </BlurFadeIn>
        </div>
      </Section>

      <Section id="recent-projects-grid" className="relative pb-24 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <StaggerContainer className="space-y-6">
            {PROJECTS.map((project, i) => (
              <motion.div key={project.title} variants={staggerItemVariants}>
                <SpotlightCard className="rounded-2xl bg-foreground/[0.02] border border-foreground/[0.08] overflow-hidden">
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 ${
                            project.status === 'LIVE'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-foreground/[0.05] text-foreground/40'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              project.status === 'LIVE' ? 'bg-green-500' : 'bg-foreground/30'
                            }`} />
                            {project.status}
                          </span>
                          <span className="text-[10px] font-mono text-foreground/20">{project.year}</span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-foreground/90 mb-1">
                          {project.title}
                        </h2>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-foreground/40 hover:text-foreground/70 transition-colors inline-flex items-center gap-1.5 mb-4"
                        >
                          {project.subtitle}
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <p className="text-sm text-foreground/50 leading-relaxed max-w-2xl mb-6">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2.5 py-1 bg-foreground/[0.04] rounded-full border border-foreground/[0.06] text-foreground/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Highlights */}
                      <div className="lg:w-72 shrink-0">
                        <div className="rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] p-5">
                          <h3 className="text-[10px] font-mono text-foreground/30 uppercase tracking-widest mb-3">
                            Highlights
                          </h3>
                          <ul className="space-y-2">
                            {project.highlights.map(h => (
                              <li key={h} className="text-xs text-foreground/50 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-foreground/20 mt-1.5 shrink-0" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
                </SpotlightCard>
              </motion.div>
            ))}
          </StaggerContainer>

          {/* CTA to full projects page */}
          <ScrollFadeIn delay={0.2}>
            <div className="text-center mt-12">
              <p className="text-sm text-foreground/30 mb-4">
                Looking for deeper technical case studies?
              </p>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-mono font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                View Technical Portfolio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
