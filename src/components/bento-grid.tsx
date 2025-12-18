import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Code2,
  Database,
  Layers,
  Zap,
  GitBranch,
  Cloud,
  Palette,
  Smartphone,
  Lock,
  ArrowUpRight,
} from 'lucide-react'

interface BentoItem {
  icon: React.ElementType
  titleKey: string
  descriptionKey: string
  tech: string[]
  className?: string
  featured?: boolean
}

export function BentoGrid() {
  const { t } = useTranslation()

  const bentoItems: BentoItem[] = [
    {
      icon: Code2,
      titleKey: 'home.skills.items.frontend.title',
      descriptionKey: 'home.skills.items.frontend.description',
      tech: ['React 19', 'TypeScript', 'Tailwind v4', 'Framer Motion'],
      className: 'md:col-span-2 md:row-span-2',
      featured: true,
    },
    {
      icon: Database,
      titleKey: 'home.skills.items.backend.title',
      descriptionKey: 'home.skills.items.backend.description',
      tech: ['Supabase', 'PostgreSQL', 'Node.js'],
    },
    {
      icon: Cloud,
      titleKey: 'home.skills.items.cloud.title',
      descriptionKey: 'home.skills.items.cloud.description',
      tech: ['Vercel', 'Edge Functions'],
    },
    {
      icon: Layers,
      titleKey: 'home.skills.items.architecture.title',
      descriptionKey: 'home.skills.items.architecture.description',
      tech: ['Nx', 'Module Federation'],
    },
    {
      icon: Zap,
      titleKey: 'home.skills.items.performance.title',
      descriptionKey: 'home.skills.items.performance.description',
      tech: ['Vite', 'SWC', 'Code Splitting'],
    },
    {
      icon: GitBranch,
      titleKey: 'home.skills.items.devops.title',
      descriptionKey: 'home.skills.items.devops.description',
      tech: ['GitHub Actions', 'Playwright'],
    },
    {
      icon: Palette,
      titleKey: 'home.skills.items.designSystems.title',
      descriptionKey: 'home.skills.items.designSystems.description',
      tech: ['Radix UI', 'shadcn/ui'],
    },
    {
      icon: Smartphone,
      titleKey: 'home.skills.items.mobile.title',
      descriptionKey: 'home.skills.items.mobile.description',
      tech: ['React Native', 'Expo'],
    },
    {
      icon: Lock,
      titleKey: 'home.skills.items.security.title',
      descriptionKey: 'home.skills.items.security.description',
      tech: ['Auth.js', 'RLS'],
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
      {bentoItems.map((item, index) => (
        <motion.div
          key={item.titleKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={item.className}
        >
          {item.featured ? (
            <FeaturedBentoCard item={item} t={t} />
          ) : (
            <BentoCard item={item} t={t} index={index} />
          )}
        </motion.div>
      ))}
    </div>
  )
}

function FeaturedBentoCard({ item, t }: { item: BentoItem; t: (key: string) => string }) {
  const Icon = item.icon

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="h-full group"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all duration-300">
        {/* Large background number */}
        <div className="absolute -right-4 -top-4 text-[180px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none">
          01
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24">
          <div className="absolute top-6 right-6 w-px h-12 bg-gradient-to-b from-foreground/20 to-transparent" />
          <div className="absolute top-6 right-6 w-12 h-px bg-gradient-to-r from-foreground/20 to-transparent" />
        </div>

        <div className="relative h-full p-6 md:p-8 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="flex h-14 w-14 items-center justify-center rounded-xl bg-foreground/[0.05] border border-foreground/10 group-hover:bg-foreground/[0.08] group-hover:border-foreground/15 transition-all duration-300"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground/90 transition-colors" />
            </motion.div>
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-4 h-4 text-foreground/50" />
            </motion.div>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-2">
            {t(item.titleKey)}
          </h3>

          <p className="text-sm md:text-base text-muted-foreground mb-6 flex-1 leading-relaxed">
            {t(item.descriptionKey)}
          </p>

          <div className="flex flex-wrap gap-2">
            {item.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60 group-hover:border-foreground/15 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BentoCard({
  item,
  t,
  index,
}: {
  item: BentoItem
  t: (key: string) => string
  index: number
}) {
  const Icon = item.icon

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full group"
    >
      <div className="relative h-full overflow-hidden rounded-xl border border-foreground/[0.08] bg-transparent hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
        {/* Subtle index number */}
        <div className="absolute -right-2 -top-2 text-[60px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="relative h-full p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] group-hover:bg-foreground/[0.06] transition-colors"
            >
              <Icon className="w-4 h-4 text-foreground/60 group-hover:text-foreground/80 transition-colors" />
            </motion.div>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1">{t(item.titleKey)}</h3>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {item.tech.slice(0, 2).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 bg-foreground/[0.04] rounded text-foreground/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Skill proficiency visualization
export function SkillBadges() {
  const skills = [
    { name: 'React', years: 8 },
    { name: 'TypeScript', years: 6 },
    { name: 'Node.js', years: 10 },
    { name: 'PostgreSQL', years: 12 },
    { name: 'Supabase', years: 3 },
    { name: 'Tailwind', years: 5 },
    { name: 'Nx', years: 3 },
    { name: 'Python', years: 8 },
  ]

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.04 }}
          whileHover={{ scale: 1.08, y: -3 }}
          className="relative group cursor-default"
        >
          <div className="px-4 py-2.5 bg-foreground/[0.03] rounded-full border border-foreground/[0.08] hover:border-foreground/15 hover:bg-foreground/[0.05] transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-foreground/80">{skill.name}</span>
              <span className="text-[10px] font-mono text-foreground/40 tabular-nums">
                {skill.years}y
              </span>
            </div>
          </div>

          {/* Hover tooltip */}
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
            initial={{ y: 4 }}
            whileHover={{ y: 0 }}
          >
            {skill.years} years
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
