import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  Workflow,
  Layers,
  FileText,
  Eye,
  Bug,
  Shield,
  TestTube,
  PenTool,
  Sparkles,
  ArrowUpRight,
  Bot,
  GitBranch,
} from 'lucide-react'

interface BentoItem {
  icon: React.ElementType
  title: string
  description: string
  tags: string[]
  className?: string
  featured?: boolean
}

export function BentoGrid() {
  const { t } = useTranslation()

  const bentoItems: BentoItem[] = [
    {
      icon: Workflow,
      title: t('bentoGrid.multiAgentOrchestration'),
      description: t('bentoGrid.multiAgentDesc'),
      tags: ['Parallel Agents', 'Task Splitting', 'Verification', 'Merging'],
      className: 'md:col-span-2 md:row-span-2',
      featured: true,
    },
    {
      icon: Layers,
      title: t('bentoGrid.toolLadder'),
      description: t('bentoGrid.toolLadderDesc'),
      tags: ['Right Tool', 'Right Job'],
    },
    {
      icon: Eye,
      title: t('bentoGrid.readBeforeGenerate'),
      description: t('bentoGrid.readBeforeGenerateDesc'),
      tags: ['Codebase Audit', 'Context'],
    },
    {
      icon: FileText,
      title: t('bentoGrid.specDriven'),
      description: t('bentoGrid.specDrivenDesc'),
      tags: ['Specs', 'Constraints'],
    },
    {
      icon: Bot,
      title: t('bentoGrid.agentFirst'),
      description: t('bentoGrid.agentFirstDesc'),
      tags: ['MCP Servers', 'Skills'],
    },
    {
      icon: Bug,
      title: t('bentoGrid.errorFirst'),
      description: t('bentoGrid.errorFirstDesc'),
      tags: ['Stack Traces', 'Root Cause'],
    },
    {
      icon: Shield,
      title: t('bentoGrid.ownConstraints'),
      description: t('bentoGrid.ownConstraintsDesc'),
      tags: ['Token Budgets', 'Context'],
    },
    {
      icon: TestTube,
      title: t('bentoGrid.testMatters'),
      description: t('bentoGrid.testMattersDesc'),
      tags: ['Critical Paths', 'E2E'],
    },
    {
      icon: PenTool,
      title: t('bentoGrid.tasteIsMoat'),
      description: t('bentoGrid.tasteIsMoatDesc'),
      tags: ['Judgment', 'Quality'],
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
      {bentoItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className={item.className}
        >
          {item.featured ? (
            <FeaturedBentoCard item={item} />
          ) : (
            <BentoCard item={item} index={index} />
          )}
        </motion.div>
      ))}
    </div>
  )
}

function FeaturedBentoCard({ item }: { item: BentoItem }) {
  const Icon = item.icon

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="h-full group"
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04] transition-all duration-300">
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
            {item.title}
          </h3>

          <p className="text-sm md:text-base text-muted-foreground mb-6 flex-1 leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60 group-hover:border-foreground/15 transition-colors"
              >
                {tag}
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
  index,
}: {
  item: BentoItem
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

          <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 bg-foreground/[0.04] rounded text-foreground/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function SkillBadges() {
  const { t } = useTranslation()

  const concepts = [
    { name: t('bentoGrid.agentOrchestration'), context: 'Core' },
    { name: t('bentoGrid.toolLadderBadge'), context: 'T1–T4' },
    { name: t('bentoGrid.specWriting'), context: 'T1–T4' },
    { name: t('bentoGrid.mcpServers'), context: 'T1–T4' },
    { name: t('bentoGrid.errorFirstDebug'), context: 'T1–T4' },
    { name: t('bentoGrid.systemTeardowns'), context: 'T4' },
    { name: t('bentoGrid.capstoneShipping'), context: 'T1–T4' },
    { name: t('bentoGrid.judgment'), context: 'Core' },
  ]

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {concepts.map((concept, index) => (
        <motion.div
          key={concept.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.04 }}
          whileHover={{ scale: 1.08, y: -3 }}
          className="relative group cursor-default"
        >
          <div className="px-4 py-2.5 bg-foreground/[0.03] rounded-full border border-foreground/[0.08] hover:border-foreground/15 hover:bg-foreground/[0.05] transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-foreground/80">{concept.name}</span>
              <span className="text-[10px] font-mono text-foreground/60 tabular-nums">
                {concept.context}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
