import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { initiateCheckout } from '@/lib/checkout'
import {
  ArrowRight,
  Check,
  Clock,
  BookOpen,
  GraduationCap,
  Zap,
  Mail,
  Code2,
  Lightbulb,
  Rocket,
  Wrench,
  ChevronRight,
  Shield,
  RefreshCw,
  Users,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import {
  BlurFadeIn,
  ScrollFadeIn,
  AnimatedNumber,
  Magnetic,
  GlowBorder,
  TiltCard,
  SpotlightCard,
  StaggerContainer,
  staggerItemVariants,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

const content = {
  en: {
    seo: {
      title: 'Enroll — The Agentic SaaS Course | $4500',
      description: '52 hours from zero to directing teams of AI agents. One price, full access — learn to direct a single agent, coordinate multiple agents in parallel, and design complete agent workflows. $4500 USD, lifetime access.',
      imageAlt: 'Enroll in The Agentic SaaS Course — $4500 USD, lifetime access',
    },
    hero: {
      badge: 'Enrollment Open',
      heading: 'One course. Everything you need.',
      subheading: '52 hours from zero to directing teams of AI agents that build real software for your business.',
      payment: 'One-time payment · Lifetime access',
      enrolling: 'Redirecting...',
      enroll: 'Enroll Now',
      curriculum: 'See Full Curriculum',
    },
    stats: {
      instruction: 'Instruction',
      lessons: 'Lessons',
      principles: 'Principles',
      capstones: 'Milestone Projects',
    },
    tiersSection: {
      heading: 'From the basics to directing AI teams',
      subheading: 'Each tier takes you deeper into directing AI agents — how they work, how to coordinate them, and how to ship with them. All four are included.',
      tierLabel: 'Tier',
      lessonsLabel: 'lessons',
      capstoneLabel: 'Milestone Project',
    },
    tiers: [
      {
        name: 'Understand How AI Works',
        description: 'You can\'t direct what you don\'t understand. Learn how AI agents interpret your instructions, why they sometimes go off track, and how to give them the right amount of context. This foundation makes everything else click.',
        capstone: 'AI capability assessment with documented strengths and limits',
        skills: ['AI Fundamentals', 'Clear Instructions', 'Tool Selection', 'Understanding Limits', 'Agent Behavior'],
      },
      {
        name: 'Direct a Single Agent',
        description: 'Master the art of giving clear instructions, checking the output, and iterating until it\'s right. Write briefs that eliminate ambiguity. Build a complete web application by directing one AI agent through every layer — login, database, payments, launch.',
        capstone: 'Complete product shipped by directing one agent end-to-end',
        skills: ['Brief Writing', 'Output Verification', 'Iteration', 'Drift Detection', 'Single-Agent Direction'],
      },
      {
        name: 'Orchestrate Multiple Agents',
        description: 'Direct 3-5 AI agents working on the same project at once. Give each agent its own workspace so they don\'t interfere with each other. Break complex features into focused tasks. Coordinate their outputs and ship faster than any solo workflow.',
        capstone: 'Working product built by 3+ AI agents on the same project',
        skills: ['Agent Workspaces', 'Shared Context', 'Task Breakdown', 'Conflict Resolution', 'Cross-Agent Verification'],
      },
      {
        name: 'Design Your Agent Workflow',
        description: 'Design projects that teams of AI agents can build efficiently. Create coordination playbooks that scale beyond your direct oversight. Know when to split work, combine results, or override an agent\'s judgment. Prove strategic thinking that AI cannot replicate.',
        capstone: 'Coordination playbook powering an autonomous agent team',
        skills: ['Project Design for Agents', 'Coordination Playbooks', 'Work Splitting Strategy', 'Override Judgment', 'System-Level Verification'],
      },
    ],
    included: {
      heading: 'Everything included',
      subheading: 'No tiers to choose between. No features locked behind paywalls. One price, full access.',
      priceLabel: 'One-time · Lifetime',
      noSubscriptions: 'No subscriptions',
      noHiddenFees: 'No hidden fees',
      guarantee: '30-day guarantee',
      items: [
        'All 4 tiers — from the basics to designing agent workflows',
        '52 hours of interactive instruction across 51 lessons',
        '4 real-world projects you ship live',
        '8 timeless principles internalized through practice',
        'Private AI tutor — runs in your browser, trained on every lesson. Practice exercises, Q&A, zero data shared',
        'AI-graded feedback on every milestone project submission',
        'Lifetime access to all materials and future updates',
        'Direct email support for lessons and projects',
        'Alumni community access',
      ],
    },
    testimonials: [
      { quote: 'By Tier 3 I was running three AI agents in parallel, each building a different part of my product. That progression is the real magic.', author: 'Alex Chen', tier: 'Tier 3' },
      { quote: 'Tier 1 alone was worth it — I finally understood why my AI tools kept giving me bad output. By Tier 3, everything clicked.', author: 'Sarah Martinez', tier: 'Tier 4' },
      { quote: 'Directing one agent is easy. Orchestrating five on the same project without them stepping on each other — that\'s what this teaches.', author: 'Jordan Osei', tier: 'Tier 4' },
    ],
    guaranteeSection: {
      heading: '30-day guarantee',
      description: 'Complete Tier 1 and submit the milestone project. If the course isn\'t for you, email within 30 days for a full refund.',
      keepMaterials: 'No questions asked. You keep the Tier 1 materials either way.',
      riskFree: 'Risk-free enrollment',
      fullRefund: 'Full refund if not satisfied',
      keepTier1: 'Keep Tier 1 materials',
    },
    faq: {
      heading: 'Common questions',
      items: [
        {
          q: 'Do I need to know how to code?',
          a: 'No. This course teaches you to DIRECT AI agents, not to code yourself. You\'ll learn to give clear instructions, verify results, and guide agents to build what you need. Some technical comfort helps, but you don\'t need programming experience.',
        },
        {
          q: 'What if I already use ChatGPT / Claude / Copilot?',
          a: 'Great — you\'ll go much deeper. Most people use AI for simple one-off tasks. This course teaches you to coordinate multiple AI agents working together, run parallel workflows, and orchestrate entire projects — skills that most people never develop.',
        },
        {
          q: 'Is the content self-paced?',
          a: 'Completely. All 51 lessons are interactive and self-paced. Work through them on your own schedule. Lifetime access means no rush.',
        },
        {
          q: 'Will these skills transfer beyond Claude Code?',
          a: 'Absolutely. The orchestration patterns you learn work with any AI tool. We teach with Claude Code because it\'s the most capable right now, but the principles of task management, verification, and coordination apply to any AI agent system.',
        },
        {
          q: 'What\'s the refund policy?',
          a: 'Complete Tier 1 and submit the milestone project. If the course isn\'t for you, email within 30 days for a full refund. No questions asked.',
        },
      ],
    },
    cta: {
      badge: 'Now enrolling',
      heading: 'Ready to orchestrate,',
      headingHighlight: 'not just prompt?',
      subheading: '52 hours. From zero to directing teams of AI agents. 4 real-world projects built by AI agents you direct.',
      questionsLink: 'Questions? Let\'s talk',
      footer: '30-day guarantee · Lifetime access · No recurring fees',
    },
  },
  fr: {
    seo: {
      title: 'Inscription — Le cours Agentic SaaS | 4 500 $',
      description: '52 heures, de zéro à diriger des équipes d’agents IA. Un seul prix, accès complet — apprenez à diriger un agent, coordonner plusieurs agents en parallèle et concevoir des workflows d’agents. 4 500 $ USD, accès à vie.',
      imageAlt: 'Inscrivez-vous au cours Agentic SaaS — 4 500 $ USD, accès à vie',
    },
    hero: {
      badge: 'Inscriptions ouvertes',
      heading: 'Un seul cours. Tout ce qu’il faut.',
      subheading: '52 heures, de zéro à diriger des équipes d’agents IA qui créent de vrais logiciels pour votre entreprise.',
      payment: 'Paiement unique · Accès à vie',
      enrolling: 'Redirection...',
      enroll: 'S’inscrire',
      curriculum: 'Voir le programme complet',
    },
    stats: {
      instruction: 'Instruction',
      lessons: 'Leçons',
      principles: 'Principes',
      capstones: 'Projets concrets',
    },
    tiersSection: {
      heading: 'Des bases à diriger des équipes d’agents IA',
      subheading: 'Chaque palier vous plonge plus profondément dans la direction d’agents IA — comment ils fonctionnent, comment les coordonner et comment livrer avec eux. Les quatre sont inclus.',
      tierLabel: 'Palier',
      lessonsLabel: 'leçons',
      capstoneLabel: 'Projet concret',
    },
    tiers: [
      {
        name: 'Comprendre le fonctionnement de l’IA',
        description: 'On ne peut pas diriger ce qu’on ne comprend pas. Apprenez comment les agents IA interprètent vos instructions, pourquoi ils déraillent parfois, et comment leur donner le bon contexte. Cette base rend tout le reste accessible.',
        capstone: 'Évaluation des capacités IA avec forces et limites documentées',
        skills: ['Économie des tokens', 'Fenêtres de contexte', 'Échelle d’outils', 'Analyse d’intention', 'Modes de défaillance'],
      },
      {
        name: 'Diriger un agent unique',
        description: 'Maîtrisez l’art de contraindre, vérifier et itérer sur la sortie d’un agent unique. Rédigez des spécifications qui éliminent l’ambiguïté. Construisez des boucles de rétroaction qui détectent la dérive. Livrez un SaaS complet en dirigeant un agent à travers chaque couche — auth, API, UI, déploiement.',
        capstone: 'SaaS complet livré en dirigeant un agent de bout en bout',
        skills: ['Contraintes de specs', 'Vérification de sortie', 'Boucles d’itération', 'Détection de dérive', 'Orchestration mono-agent'],
      },
      {
        name: 'Orchestrer plusieurs agents',
        description: 'Exécutez 3 à 5 agents en parallèle sur le même codebase. Utilisez les worktrees git pour l’isolation, CLAUDE.md pour le contexte partagé, et la décomposition de tâches pour éviter les collisions entre agents. Résolvez les conflits de fusion, vérifiez les sorties croisées et livrez plus vite que tout workflow solo.',
        capstone: 'Application de production construite par 3+ agents parallèles sur un codebase partagé',
        skills: ['Git Worktrees', 'Contexte partagé (CLAUDE.md)', 'Décomposition de tâches', 'Résolution de conflits', 'Vérification inter-agents'],
      },
      {
        name: 'Concevoir votre workflow d’agents',
        description: 'Concevez des projets que des équipes d’agents IA peuvent construire efficacement. Créez des playbooks de coordination qui fonctionnent au-delà de votre supervision directe. Sachez quand diviser le travail, combiner les résultats ou corriger la décision d’un agent. Prouvez la pensée stratégique que l’IA ne peut pas répliquer.',
        capstone: 'Playbook de coordination alimentant une équipe d’agents autonome',
        skills: ['Conception de codebase pour agents', 'Protocoles de coordination', 'Stratégie de division/fusion', 'Jugement de dérogation', 'Vérification au niveau système'],
      },
    ],
    included: {
      heading: 'Tout est inclus',
      subheading: 'Pas de paliers à choisir. Pas de fonctionnalités bloquées derrière un paywall. Un prix, accès complet.',
      priceLabel: 'Unique · À vie',
      noSubscriptions: 'Pas d’abonnement',
      noHiddenFees: 'Pas de frais cachés',
      guarantee: 'Garantie 30 jours',
      items: [
        'Les 4 paliers — des tokens à la conception de systèmes d’agents',
        '52 heures d’instruction interactive à travers 51 leçons',
        '4 vrais projets concrets que vous livrez en ligne',
        '8 principes intemporels intériorisés par la pratique',
        'Tuteur IA privé — fonctionne dans votre navigateur, formé sur chaque leçon. Exercices pratiques, Q&R, aucune donnée partagée',
        'Retours notés par IA sur chaque soumission de projet concret',
        'Accès à vie à tous les matériaux et mises à jour futures',
        'Support par email direct pour les leçons et projets',
        'Accès à la communauté des anciens',
      ],
    },
    testimonials: [
      { quote: 'Au Palier 3, je faisais tourner trois agents en parallèle sur différentes parties de mon SaaS. Cette progression, c’est la vraie magie.', author: 'Alex Chen', tier: 'Palier 3' },
      { quote: 'Le Palier 1 seul valait le coup — j’ai enfin compris pourquoi mes agents perdaient le contexte. Au Palier 3, tout s’est assemblé.', author: 'Sarah Martinez', tier: 'Palier 4' },
      { quote: 'Diriger un agent, c’est facile. En orchestrer cinq sur le même codebase sans qu’ils se marchent dessus — c’est ça que ce cours enseigne.', author: 'Jordan Osei', tier: 'Palier 4' },
    ],
    guaranteeSection: {
      heading: 'Garantie 30 jours',
      description: 'Complétez le Palier 1 et soumettez le projet concret. Si le cours ne vous convient pas, envoyez un email dans les 30 jours pour un remboursement intégral.',
      keepMaterials: 'Sans conditions. Vous gardez les matériaux du Palier 1 dans tous les cas.',
      riskFree: 'Inscription sans risque',
      fullRefund: 'Remboursement intégral si insatisfait',
      keepTier1: 'Gardez les matériaux du Palier 1',
    },
    faq: {
      heading: 'Questions fréquentes',
      items: [
        {
          q: 'Ai-je besoin de savoir coder ?',
          a: 'Non. Ce cours vous apprend à DIRIGER des agents IA, pas à coder vous-même. Vous apprendrez à donner des instructions claires, vérifier les résultats et guider les agents. Un certain confort technique aide, mais aucune expérience en programmation n’est requise.',
        },
        {
          q: 'Et si j’utilise déjà ChatGPT / Claude / Copilot ?',
          a: 'Tant mieux — vous irez plus loin. La plupart des gens utilisent un agent unique pour des tâches simples. Ce cours enseigne la coordination multi-agents, les workflows parallèles et l’orchestration de projets entiers — des compétences que la plupart des gens ne développent jamais.',
        },
        {
          q: 'Le contenu est-il à son propre rythme ?',
          a: 'Entièrement. Les 51 leçons sont interactives et à votre rythme. Travaillez selon votre emploi du temps. L’accès à vie signifie aucune urgence.',
        },
        {
          q: 'Ces compétences sont-elles transférables au-delà de Claude Code ?',
          a: 'Les schémas d’orchestration sont indépendants de l’agent. Nous enseignons avec Claude Code parce que c’est le meilleur outil actuellement, mais les principes de découpage de tâches, de vérification et de coordination s’appliquent à tout système d’agents.',
        },
        {
          q: 'Quelle est la politique de remboursement ?',
          a: 'Complétez le Palier 1 et soumettez le projet concret. Si le cours ne vous convient pas, envoyez un email dans les 30 jours pour un remboursement intégral. Sans conditions.',
        },
      ],
    },
    cta: {
      badge: 'Inscriptions en cours',
      heading: 'Prêt à orchestrer,',
      headingHighlight: 'pas seulement prompter ?',
      subheading: '52 heures. Des bases à diriger des équipes d’agents IA. 4 produits construits par des agents que vous dirigez.',
      questionsLink: 'Des questions ? Parlons-en',
      footer: 'Garantie 30 jours · Accès à vie · Aucun frais récurrent',
    },
  },
} as const

const tierMeta = [
  { number: '01', icon: Code2, hours: 8, lessons: 10 },
  { number: '02', icon: Lightbulb, hours: 12, lessons: 12 },
  { number: '03', icon: Rocket, hours: 15, lessons: 14 },
  { number: '04', icon: Wrench, hours: 15, lessons: 12 },
]

const includedIcons = [BookOpen, Clock, Rocket, Sparkles, GraduationCap, Zap, RefreshCw, Mail, Users]

export default function Tiers() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const c = content[lang]
  const prefersReducedMotion = useReducedMotion()
  const [enrolling, setEnrolling] = useState(false)

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await initiateCheckout()
    } catch {
      setEnrolling(false)
    }
  }

  return (
    <>
      <SEO
        title={c.seo.title}
        description={c.seo.description}
        path="/tiers"
        image="/og-image.png"
        imageAlt={c.seo.imageAlt}
        keywords="agentic saas course price, multi-agent orchestration course, $4500 ai course, agent coordination course, lifetime access, charles jackson course"
        jsonLd={{
          '@type': 'Offer',
          name: 'The Agentic SaaS Course — Full Access',
          description: '52 hours of interactive instruction from the basics to directing teams of AI agents. 51 lessons, 4 milestone projects, lifetime access.',
          url: 'https://charlesjackson.dev/tiers',
          price: '4500',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Person', name: 'Charles Jackson' },
        }}
      />

      {/* Hero — Clean, centered, confident */}
      <Section id="tiers-hero" className="relative min-h-screen flex items-center overflow-hidden">
        <SectionSpots variant="hero" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <BlurFadeIn delay={0} immediate>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-10">
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-xs font-mono text-foreground/60">{c.hero.badge}</span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                {c.hero.heading}
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12">
                {c.hero.subheading}
              </p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="mb-12 relative">
                <div className="absolute -inset-12 bg-radial-[at_50%_50%] from-foreground/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="text-8xl md:text-9xl font-bold tracking-[-0.06em] leading-none bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent">
                    <span className="text-6xl md:text-7xl align-top mr-1">$</span>
                    <AnimatedNumber value={4500} duration={1.5} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-4 tracking-widest uppercase">
                    {c.hero.payment}
                  </div>
                </div>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.35} immediate>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Magnetic strength={0.15}>
                  <Button size="lg" className="h-14 px-10 font-mono group" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? c.hero.enrolling : c.hero.enroll}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <Button size="lg" variant="outline" className="h-14 px-10 font-mono" asChild>
                    <Link to="/curriculum">{c.hero.curriculum}</Link>
                  </Button>
                </Magnetic>
              </div>
            </BlurFadeIn>

            {/* Stats grid — integrated into hero */}
            <BlurFadeIn delay={0.4} immediate>
              <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden border border-foreground/10 max-w-2xl mx-auto">
                {[
                  { value: 52, suffix: 'h', label: c.stats.instruction },
                  { value: 51, suffix: '', label: c.stats.lessons },
                  { value: 8, suffix: '', label: c.stats.principles },
                  { value: 4, suffix: '', label: c.stats.capstones },
                ].map(({ value, suffix, label }) => (
                  <div key={label} className="bg-foreground/[0.03] p-5 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold font-mono mb-1">
                      <AnimatedNumber value={value} suffix={suffix} duration={2} />
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* The 4 Tiers — Bento Grid */}
      <Section id="tiers-breakdown" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {c.tiersSection.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {c.tiersSection.subheading}
            </p>
          </ScrollFadeIn>

          {/* Bento grid: T1 wide, T2+T3 side-by-side, T4 wide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {tierMeta.map((meta, index) => {
              const tier = c.tiers[index]
              const Icon = meta.icon
              const isWide = index === 0 || index === 3
              return (
                <motion.div
                  key={meta.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className={isWide ? 'md:col-span-2' : ''}
                >
                  <TiltCard tiltAmount={3} glareEnabled glareOpacity={0.03} perspective={2000}>
                    <SpotlightCard spotlightColor="rgba(var(--effect-rgb),0.04)" spotlightSize={600}>
                      <div className="relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20 transition-all duration-300">
                        {/* Watermark number */}
                        <div className={`absolute -right-4 -top-6 font-bold leading-none text-foreground/[0.02] select-none pointer-events-none ${isWide ? 'text-[220px]' : 'text-[160px]'}`}>
                          {meta.number}
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20">
                          <div className="absolute top-5 right-5 w-px h-10 bg-gradient-to-b from-foreground/15 to-transparent" />
                          <div className="absolute top-5 right-5 w-10 h-px bg-gradient-to-r from-foreground/15 to-transparent" />
                        </div>

                        <div className={`relative ${isWide ? 'p-6 md:p-8' : 'p-6 md:p-8'}`}>
                          {isWide ? (
                            /* Wide layout */
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/[0.05] border border-foreground/10">
                                    <Icon className="w-6 h-6 text-foreground/70" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-mono text-muted-foreground block">{c.tiersSection.tierLabel} {meta.number}</span>
                                    <h3 className="text-2xl md:text-3xl font-bold">{tier.name}</h3>
                                  </div>
                                </div>
                                <div className="flex gap-6 text-right">
                                  <div>
                                    <div className="text-3xl font-bold font-mono">{meta.hours}<span className="text-sm font-normal text-muted-foreground">h</span></div>
                                    <div className="text-[10px] text-muted-foreground">{meta.lessons} {c.tiersSection.lessonsLabel}</div>
                                  </div>
                                </div>
                              </div>

                              <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl">
                                {tier.description}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {tier.skills.map((skill) => (
                                  <span key={skill} className="text-xs font-mono px-3 py-1.5 bg-foreground/[0.05] rounded-full border border-foreground/10 text-foreground/60">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              <div className="p-4 rounded-xl bg-foreground/[0.03] border border-foreground/5 inline-flex items-start gap-3">
                                <GraduationCap className="w-4 h-4 text-foreground/50 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="text-xs font-mono text-foreground/40 block">{c.tiersSection.capstoneLabel}</span>
                                  <span className="text-sm text-foreground/80">{tier.capstone}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Compact card layout */
                            <>
                              <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/[0.05] border border-foreground/10">
                                    <Icon className="w-5 h-5 text-foreground/70" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-mono text-muted-foreground block">{c.tiersSection.tierLabel} {meta.number}</span>
                                    <h3 className="text-xl font-bold">{tier.name}</h3>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold font-mono">{meta.hours}<span className="text-sm font-normal text-muted-foreground">h</span></div>
                                  <div className="text-[10px] text-muted-foreground">{meta.lessons} {c.tiersSection.lessonsLabel}</div>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                {tier.description}
                              </p>

                              <div className="flex flex-wrap gap-1.5 mb-5">
                                {tier.skills.map((skill) => (
                                  <span key={skill} className="text-[10px] font-mono px-2.5 py-1 bg-foreground/[0.04] rounded-full border border-foreground/[0.08] text-foreground/50">
                                    {skill}
                                  </span>
                                ))}
                              </div>

                              <div className="p-3 rounded-lg bg-foreground/[0.03] border border-foreground/5 flex items-center gap-2.5">
                                <GraduationCap className="w-3.5 h-3.5 text-foreground/40 flex-shrink-0" />
                                <span className="text-xs text-foreground/70">{tier.capstone}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </SpotlightCard>
                  </TiltCard>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* What's Included — Grid with Price Feature */}
      <Section id="tiers-included" className="py-24 lg:py-32 relative">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {c.included.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {c.included.subheading}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Price feature card — spans 1 col, 2 rows */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="md:row-span-2"
            >
              <div className="h-full rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-[140px] font-bold leading-none text-foreground/[0.02] select-none pointer-events-none">$</div>
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold font-mono mb-3 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">$4500</div>
                  <div className="text-sm text-muted-foreground mb-6 font-mono">{c.included.priceLabel}</div>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-foreground/20 to-transparent mx-auto mb-6" />
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>{c.included.noSubscriptions}</p>
                    <p>{c.included.noHiddenFees}</p>
                    <p>{c.included.guarantee}</p>
                  </div>
                  <Magnetic strength={0.15}>
                    <Button size="lg" className="mt-8 font-mono group w-full" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? c.hero.enrolling : c.hero.enroll}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </motion.div>

            {/* Included items — 2x2 grid filling the remaining space */}
            {c.included.items.map((text, index) => {
              const Icon = includedIcons[index]
              return (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="group"
                >
                  <div className="h-full flex items-start gap-3 p-5 rounded-xl border border-foreground/[0.06] hover:border-foreground/15 hover:bg-foreground/[0.02] transition-all duration-300">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] group-hover:bg-foreground/[0.08] transition-colors">
                      <Icon className="h-4 w-4 text-foreground/60" />
                    </div>
                    <span className="text-foreground/80 text-sm leading-relaxed pt-1.5">{text}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Social Proof Strip */}
      <Section id="tiers-proof" className="py-16 relative">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {c.testimonials.map(({ quote, author, tier }, index) => (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-foreground/[0.06] bg-foreground/[0.01]"
              >
                <MessageSquare className="w-4 h-4 text-foreground/20 mb-3" />
                <p className="text-sm text-foreground/70 leading-relaxed mb-4 italic">"{quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/60">{author}</span>
                  <span className="text-[10px] font-mono text-foreground/30">{tier}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Guarantee + FAQ — Side by side grid */}
      <Section id="tiers-faq" className="py-24 lg:py-32 relative">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 md:gap-12">
            {/* Guarantee — sticky sidebar */}
            <ScrollFadeIn>
              <div className="lg:sticky lg:top-32">
                <div className="p-8 rounded-2xl border border-foreground/10 bg-foreground/[0.02]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-foreground/[0.05] border border-foreground/10">
                      <Shield className="w-6 h-6 text-foreground/50" />
                    </div>
                    <h2 className="text-xl font-bold">{c.guaranteeSection.heading}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {c.guaranteeSection.description}
                  </p>
                  <p className="text-sm text-muted-foreground/60 mb-6">
                    {c.guaranteeSection.keepMaterials}
                  </p>
                  <div className="h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent mb-6" />
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>{c.guaranteeSection.riskFree}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>{c.guaranteeSection.fullRefund}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-foreground/50" />
                      <span>{c.guaranteeSection.keepTier1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollFadeIn>

            {/* FAQ — right column */}
            <div>
              <ScrollFadeIn className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {c.faq.heading}
                </h2>
              </ScrollFadeIn>

              <div className="space-y-3">
                {c.faq.items.map(({ q, a }, index) => (
                  <motion.details
                    key={q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="group rounded-xl border border-foreground/10 hover:border-foreground/15 transition-colors overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                      <span className="text-foreground font-medium pr-4 text-sm">{q}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform duration-200" />
                    </summary>
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-muted-foreground leading-relaxed text-sm">{a}</p>
                    </div>
                  </motion.details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section id="tiers-cta" className="py-32 lg:py-40 relative overflow-hidden">
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
                <span className="text-xs font-mono text-muted-foreground">{c.cta.badge}</span>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {c.cta.heading}{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  {c.cta.headingHighlight}
                </span>
              </h2>
            </ScrollFadeIn>

            <BlurFadeIn delay={0.1}>
              <p className="text-muted-foreground text-lg mb-4 max-w-xl mx-auto leading-relaxed">
                {c.cta.subheading}
              </p>
              <p className="text-4xl md:text-5xl font-bold font-mono mb-8">$4500</p>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Magnetic strength={0.15}>
                  <Button size="lg" className="h-14 px-10 font-mono group text-base" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? c.hero.enrolling : c.hero.enroll}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <Button size="lg" variant="outline" className="h-14 px-10 font-mono" asChild>
                    <a href="mailto:hello@charlesjackson.dev">
                      <Mail className="mr-2 h-4 w-4" />
                      {c.cta.questionsLink}
                    </a>
                  </Button>
                </Magnetic>
              </div>
              <p className="text-xs text-muted-foreground/50">
                {c.cta.footer}
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>
    </>
  )
}
