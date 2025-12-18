import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GraduationCap, Rocket, Code2, Star, Zap, Leaf } from 'lucide-react'

interface TimelineItem {
  year: string
  titleKey: string
  companyKey?: string
  descriptionKey: string
  icon: React.ElementType
  type: 'work' | 'education' | 'project' | 'milestone'
}

export function Timeline() {
  const { t } = useTranslation()

  const timelineData: TimelineItem[] = [
    {
      year: '2024',
      titleKey: 'home.timeline.items.2024_founder.title',
      companyKey: 'home.timeline.items.2024_founder.company',
      descriptionKey: 'home.timeline.items.2024_founder.description',
      icon: Rocket,
      type: 'project',
    },
    {
      year: '2024',
      titleKey: 'home.timeline.items.2024_urbanfarm.title',
      companyKey: 'home.timeline.items.2024_urbanfarm.company',
      descriptionKey: 'home.timeline.items.2024_urbanfarm.description',
      icon: Leaf,
      type: 'project',
    },
    {
      year: '2018-2023',
      titleKey: 'home.timeline.items.2018_senior.title',
      descriptionKey: 'home.timeline.items.2018_senior.description',
      icon: Star,
      type: 'work',
    },
    {
      year: '2015-2018',
      titleKey: 'home.timeline.items.2015_lead.title',
      descriptionKey: 'home.timeline.items.2015_lead.description',
      icon: Zap,
      type: 'work',
    },
    {
      year: '2010-2015',
      titleKey: 'home.timeline.items.2010_fullstack.title',
      descriptionKey: 'home.timeline.items.2010_fullstack.description',
      icon: Code2,
      type: 'work',
    },
    {
      year: '2005',
      titleKey: 'home.timeline.items.2005_start.title',
      descriptionKey: 'home.timeline.items.2005_start.description',
      icon: GraduationCap,
      type: 'milestone',
    },
  ]

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

      <div className="space-y-12">
        {timelineData.map((item, index) => (
          <TimelineEntry key={item.year + item.titleKey} item={item} index={index} t={t} />
        ))}
      </div>
    </div>
  )
}

function TimelineEntry({ item, index, t }: { item: TimelineItem; index: number; t: (key: string) => string }) {
  const Icon = item.icon
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-8 md:pl-0`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 bg-card border border-border rounded-lg hover:border-foreground/20 transition-all duration-300 group cursor-default"
        >
          <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {item.year}
            </span>
            {item.type === 'project' && (
              <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                {t('common.current')}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground group-hover:text-foreground transition-colors">
            {t(item.titleKey)}
          </h3>

          {item.companyKey && (
            <p className="text-sm font-mono text-muted-foreground mb-2">
              {t(item.companyKey)}
            </p>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(item.descriptionKey)}
          </p>
        </motion.div>
      </div>

      {/* Center icon */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 12 }}
        className="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 bg-background border-2 border-border rounded-full flex items-center justify-center z-10 hover:border-foreground/50 transition-colors"
      >
        <Icon className="w-4 h-4 text-foreground/70" />
      </motion.div>

      {/* Spacer for the other side */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  )
}

// Compact horizontal timeline variant
export function HorizontalTimeline() {
  const { t } = useTranslation()

  const milestones = [
    { year: '2005', labelKey: 'home.timeline.milestones.2005' },
    { year: '2010', labelKey: 'home.timeline.milestones.2010' },
    { year: '2015', labelKey: 'home.timeline.milestones.2015' },
    { year: '2024', labelKey: 'home.timeline.milestones.2024' },
  ]

  return (
    <div className="relative py-8">
      {/* Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />

      <div className="flex justify-between relative">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="w-4 h-4 bg-background border-2 border-foreground/30 rounded-full hover:border-foreground transition-colors cursor-default"
            />
            <div className="mt-3 text-center">
              <div className="text-sm font-bold">{milestone.year}</div>
              <div className="text-xs text-muted-foreground">{t(milestone.labelKey)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
