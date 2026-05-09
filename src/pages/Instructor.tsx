import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Calendar,
  Code2,
  Database,
  Terminal,
  Cpu,
  Github,
  Mail,
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
import { useAuth } from '@/hooks/use-auth'

const content = {
  en: {
    seo: {
      title: 'Meet the Instructor — Charles Jackson',
      description: '10+ years building products for startups that raised $400M+ combined, including a $277M exit. CTO at MicroHabitat, Founder of Cursuum. Now teaching entrepreneurs how to direct AI agents. Based in Montreal, Canada.',
      imageAlt: 'Meet the Instructor — Charles Jackson: 20+ years building production systems',
    },
    badge: '10+ Years Experience',
    heading: 'Building software since',
    bio: [
      "I build products for companies that go on to do big things. The startups I've worked with have collectively raised over $400M and generated a $277M exit. nesto became Canada's largest tech-enabled mortgage lender. Dialogue IPO'd and was acquired by Sun Life. Bus.com won FounderFuel and Y Combinator. Crew was acquired by Dribbble.",
      "For 9+ years I've served as CTO & CAIO at MicroHabitat — the world's largest urban farming network. Now I'm building Cursuum, an AI scheduling engine, and teaching entrepreneurs how to direct AI agents to build real software — the principles I wish someone had taught me.",
    ],
    cta: {
      curriculum: 'See the Curriculum',
      enroll: 'Enroll Now',
    },
    stats: {
      years: 'Years Experience',
      raised: 'Raised by Clients',
      exit: 'Largest Exit',
      startups: 'Startups Built With',
    },
    career: {
      heading: 'Built With Startups That Raised $400M+',
      subtitle: 'From early-stage startups to established companies — building the products that attract funding, users, and acquisitions',
      currentBadge: 'Current',
    },
    companies: [
      {
        year: '2026–now',
        title: 'Founder',
        company: 'Cursuum',
        description: 'Building the industry-adaptive scheduling engine that learns you, predicts availability, and never lets relationships go cold. 12 vertical configurations with energy-aware scheduling and AI-powered detection.',
        type: 'current' as const,
        technologies: ['AI', 'Scheduling', 'SaaS'],
      },
      {
        year: '2016–now',
        title: 'CTO & CAIO',
        company: 'MicroHabitat',
        description: "9+ years leading technology and AI strategy for MicroHabitat — the world's largest urban farming network. 250+ rooftop farms across 22+ cities, B Corp certified. Overseeing technology management, UX, and the full product lifecycle.",
        type: 'current' as const,
        technologies: ['Technology Management', 'UX', 'AI Strategy'],
        highlight: '250+ farms · 22+ cities',
      },
      {
        year: '2021',
        title: 'Software Developer',
        company: 'Cook it',
        description: "Built the Starterweek feature where consumers customize their first meal kit. Cook it — Canada's first meal kit company — raised $17M+, scaled to 500+ employees, and was acquired by Fresh Prep in 2024.",
        type: 'work' as const,
        technologies: ['React', 'Redux', 'Styled Components', 'Node.js'],
        highlight: '$17M raised · Acquired 2024',
      },
      {
        year: '2017',
        title: 'Software Developer',
        company: 'nesto',
        description: "Developed a custom theme for the company prior to its fundraising. nesto has since raised $165M+ CAD, grown to 1,100+ employees, serves 450,000+ Canadians, and administers $63B+ in mortgage assets. Now Canada's largest tech-enabled mortgage lender.",
        type: 'work' as const,
        technologies: ['JavaScript', 'WordPress'],
        highlight: '$165M+ raised · 1,100 employees',
      },
      {
        year: '2017',
        title: 'Software Developer',
        company: 'Crew Collective & Café',
        description: "Worked with Harris Kalash on one of the company's pages. Crew — the freelancer marketplace that also spawned Unsplash — was acquired by Dribbble in 2017. Clients included Dropbox, Medium, and Tinder.",
        type: 'work' as const,
        technologies: ['React.js'],
        highlight: 'Acquired by Dribbble · Spawned Unsplash',
      },
      {
        year: '2016',
        title: 'Software Developer',
        company: 'Dialogue',
        description: "Developed the company's presentational website in its early beginnings. Dialogue went on to raise $200M+ CAD, IPO'd on the TSX, and was acquired by Sun Life Financial for $277M CAD. Now Canada's leading virtual healthcare platform.",
        type: 'work' as const,
        technologies: ['Frontend Development'],
        highlight: '$277M exit to Sun Life',
      },
      {
        year: '2015',
        title: 'Software Developer',
        company: 'Bus.com',
        description: "Participated in FounderFuel's 2015 cohort. Bus.com won the competition, went through Y Combinator, and has raised $27M+ CAD. Now a leading North American charter bus marketplace.",
        type: 'work' as const,
        technologies: ['jQuery', 'JavaScript', 'HTML5', 'CSS3'],
        highlight: '$27M raised · FounderFuel + YC',
      },
    ],
    skills: {
      heading: 'Skills & Technologies',
      subtitle: 'A decade of accumulated expertise across the full stack',
      categories: [
        { title: 'Frontend', skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'React Query'] },
        { title: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'] },
        { title: 'DevOps & Tools', skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Nx Monorepo'] },
        { title: 'Architecture', skills: ['System Design', 'Microservices', 'Event-Driven', 'DDD', 'Performance', 'Security'] },
      ],
    },
    philosophy: {
      heading: 'How I Work',
      subtitle: 'Principles that guide every product I build — and every lesson I teach',
      items: [
        { title: 'Fix Root Causes', desc: 'Address underlying issues rather than working around symptoms. Build proper foundations instead of cutting corners.' },
        { title: 'Elegant Simplicity', desc: 'The best solutions are simple, maintainable, and solve real problems. Complexity should only exist where it adds value.' },
        { title: 'Performance First', desc: 'Optimize for speed at every layer. Fast load times, efficient systems, and thoughtful resource management.' },
        { title: 'Quality Assurance', desc: 'Build in safeguards that catch errors before they reach users. Prevention beats firefighting.' },
      ],
    },
    research: {
      badge: 'Research Interests',
      heading: 'What Drives the Teaching',
      subtitle: "The mathematical foundations and machine learning techniques behind the course's prediction systems and AI-first approach.",
      items: [
        { title: 'Monte Carlo Simulations', description: 'Probabilistic modeling through repeated random sampling' },
        { title: 'Transformer Models', description: 'Attention-based architectures for sequence modeling' },
        { title: 'Deep Neural Networks', description: 'Multi-layer architectures for learning complex patterns' },
        { title: 'Natural Language Processing', description: 'Extracting structure and meaning from text' },
        { title: 'Sentiment Analysis', description: 'Quantifying opinion and emotion from text' },
        { title: 'Bayesian Inference', description: 'Updating beliefs with evidence' },
      ],
      closingP1: 'Mathematics is the language of patterns. In a world drowning in data, mathematical models help us find signal in noise, structure in chaos, and insights in complexity.',
      closingP2: "The goal isn't prediction for its own sake. It's about making better decisions under uncertainty — and teaching students to think the same way about the products they build with AI.",
    },
    ctaSection: {
      heading: "Let's build something worth shipping.",
      subtitle: "Whether you're considering the course, have a project in mind, or just want to connect — I'd love to hear from you.",
      viewProjects: 'View Projects',
    },
  },
  fr: {
    seo: {
      title: "Rencontrez l'instructeur — Charles Jackson",
      description: "Plus de 10 ans à créer des produits pour des startups ayant levé plus de 400 M$ au total. CTO chez MicroHabitat, fondateur de Cursuum. Enseigne maintenant aux entrepreneurs comment diriger des agents IA. A conçu des produits pour des startups ayant levé plus de 400 M$ au total, dont une sortie à 277 M$. Basé à Montréal, Canada.",
      imageAlt: "Rencontrez l'instructeur — Charles Jackson : plus de 20 ans de systèmes en production",
    },
    badge: "10+ ans d'expérience",
    heading: 'Développe des logiciels depuis',
    bio: [
      "Je conçois des produits pour des entreprises qui accomplissent de grandes choses. Les startups avec lesquelles j'ai travaillé ont collectivement levé plus de 400 M$ et généré une sortie à 277 M$. nesto est devenu le plus grand prêteur hypothécaire technologique du Canada. Dialogue a fait son introduction en bourse et a été acquis par Sun Life. Bus.com a remporté FounderFuel et Y Combinator. Crew a été acquis par Dribbble.",
      "Depuis plus de 9 ans, je suis CTO & CAIO chez MicroHabitat — le plus grand réseau d'agriculture urbaine au monde. Aujourd'hui, je développe Cursuum, un moteur de planification propulsé par l'IA, et j'enseigne les principes que j'aurais aimé apprendre plus tôt.",
    ],
    cta: {
      curriculum: 'Voir le programme',
      enroll: "S'inscrire",
    },
    stats: {
      years: "Années d'expérience",
      raised: 'Levés par les clients',
      exit: 'Plus grande sortie',
      startups: 'Startups accompagnées',
    },
    career: {
      heading: 'Accompagné des startups ayant levé plus de 400 M$',
      subtitle: "Des startups en démarrage aux entreprises établies — concevoir les produits qui attirent le financement, les utilisateurs et les acquisitions",
      currentBadge: 'Actuel',
    },
    companies: [
      {
        year: '2026–now',
        title: 'Fondateur',
        company: 'Cursuum',
        description: "Développement du moteur de planification adaptatif qui apprend vos habitudes, prédit la disponibilité et maintient les relations actives. 12 configurations verticales avec planification énergétique et détection par IA.",
        type: 'current' as const,
        technologies: ['IA', 'Planification', 'SaaS'],
      },
      {
        year: '2016–now',
        title: 'CTO & CAIO',
        company: 'MicroHabitat',
        description: "Plus de 9 ans à diriger la technologie et la stratégie IA de MicroHabitat — le plus grand réseau d'agriculture urbaine au monde. Plus de 250 fermes sur les toits dans plus de 22 villes, certifié B Corp. Supervision de la gestion technologique, de l'UX et du cycle de vie produit complet.",
        type: 'current' as const,
        technologies: ['Gestion technologique', 'UX', 'Stratégie IA'],
        highlight: '250+ fermes · 22+ villes',
      },
      {
        year: '2021',
        title: 'Développeur logiciel',
        company: 'Cook it',
        description: "Création de la fonctionnalité Starterweek permettant aux consommateurs de personnaliser leur première boîte-repas. Cook it — la première entreprise de boîtes-repas au Canada — a levé plus de 17 M$, embauché plus de 500 employés et a été acquise par Fresh Prep en 2024.",
        type: 'work' as const,
        technologies: ['React', 'Redux', 'Styled Components', 'Node.js'],
        highlight: '17 M$ levés · Acquise 2024',
      },
      {
        year: '2017',
        title: 'Développeur logiciel',
        company: 'nesto',
        description: "Développement d'un thème personnalisé pour l'entreprise avant sa levée de fonds. nesto a depuis levé plus de 165 M$ CAD, emploie plus de 1 100 personnes, dessert plus de 450 000 Canadiens et administre plus de 63 G$ en actifs hypothécaires. Désormais le plus grand prêteur hypothécaire technologique du Canada.",
        type: 'work' as const,
        technologies: ['JavaScript', 'WordPress'],
        highlight: '165 M$+ levés · 1 100 employés',
      },
      {
        year: '2017',
        title: 'Développeur logiciel',
        company: 'Crew Collective & Café',
        description: "Collaboration avec Harris Kalash sur l'une des pages de l'entreprise. Crew — le marché de pigistes qui a également créé Unsplash — a été acquis par Dribbble en 2017. Parmi les clients : Dropbox, Medium et Tinder.",
        type: 'work' as const,
        technologies: ['React.js'],
        highlight: 'Acquis par Dribbble · A créé Unsplash',
      },
      {
        year: '2016',
        title: 'Développeur logiciel',
        company: 'Dialogue',
        description: "Développement du site web de présentation de l'entreprise à ses débuts. Dialogue a ensuite levé plus de 200 M$ CAD, est entrée en bourse au TSX et a été acquise par Sun Life Financial pour 277 M$ CAD. Désormais la première plateforme de soins de santé virtuels au Canada.",
        type: 'work' as const,
        technologies: ['Développement frontend'],
        highlight: 'Sortie à 277 M$ · Sun Life',
      },
      {
        year: '2015',
        title: 'Développeur logiciel',
        company: 'Bus.com',
        description: "Participation à la cohorte 2015 de FounderFuel. Bus.com a remporté la compétition, est passé par Y Combinator et a levé plus de 27 M$ CAD. Désormais un marché de premier plan pour les autobus nolisés en Amérique du Nord.",
        type: 'work' as const,
        technologies: ['jQuery', 'JavaScript', 'HTML5', 'CSS3'],
        highlight: '27 M$ levés · FounderFuel + YC',
      },
    ],
    skills: {
      heading: 'Compétences et technologies',
      subtitle: "Une décennie d'expertise accumulée sur l'ensemble de la pile technologique",
      categories: [
        { title: 'Frontend', skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'React Query'] },
        { title: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs', 'GraphQL'] },
        { title: 'DevOps et outils', skills: ['Git', 'Docker', 'Vercel', 'AWS', 'CI/CD', 'Nx Monorepo'] },
        { title: 'Architecture', skills: ['Conception système', 'Microservices', 'Événementiel', 'DDD', 'Performance', 'Sécurité'] },
      ],
    },
    philosophy: {
      heading: 'Comment je travaille',
      subtitle: "Les principes qui guident chaque ligne de code que j'écris — et chaque leçon que j'enseigne",
      items: [
        { title: 'Corriger les causes profondes', desc: "S'attaquer aux problèmes sous-jacents plutôt que de contourner les symptômes. Construire une infrastructure solide au lieu de créer de la dette technique." },
        { title: 'Simplicité élégante', desc: "Le meilleur code est simple, maintenable et résout de vrais problèmes. La complexité ne devrait exister que là où elle apporte de la valeur." },
        { title: 'Performance avant tout', desc: "Optimiser la vitesse à chaque couche. Temps de réponse inférieurs à 200 ms, bundling efficace et gestion réfléchie des ressources." },
        { title: 'Sécurité des types', desc: "Tirer parti du mode strict de TypeScript pour détecter les erreurs à la compilation et améliorer l'expérience développeur." },
      ],
    },
    research: {
      badge: "Intérêts de recherche",
      heading: "Ce qui motive l'enseignement",
      subtitle: "Les fondements mathématiques et les techniques d'apprentissage automatique derrière les systèmes de prédiction et l'approche IA du cours.",
      items: [
        { title: 'Simulations de Monte Carlo', description: "Modélisation probabiliste par échantillonnage aléatoire répété" },
        { title: 'Modèles Transformer', description: "Architectures basées sur l'attention pour la modélisation de séquences" },
        { title: 'Réseaux de neurones profonds', description: "Architectures multicouches pour l'apprentissage de motifs complexes" },
        { title: 'Traitement du langage naturel', description: 'Extraction de structure et de sens à partir de texte' },
        { title: "Analyse de sentiment", description: "Quantification de l'opinion et de l'émotion à partir de texte" },
        { title: 'Inférence bayésienne', description: 'Mise à jour des croyances avec des preuves' },
      ],
      closingP1: "Les mathématiques sont le langage des motifs. Dans un monde submergé de données, les modèles mathématiques nous aident à trouver le signal dans le bruit, la structure dans le chaos et les idées dans la complexité.",
      closingP2: "L'objectif n'est pas la prédiction pour elle-même. Il s'agit de prendre de meilleures décisions dans l'incertitude — et d'enseigner aux étudiants à penser de la même manière au sujet du code qu'ils écrivent avec l'IA.",
    },
    ctaSection: {
      heading: "Construisons quelque chose qui mérite d'être livré.",
      subtitle: "Que vous vous inscriviez au cours ou que vous souhaitiez simplement échanger — j'aimerais beaucoup avoir de vos nouvelles.",
      viewProjects: 'Voir les projets',
    },
  },
} as const

const philosophyIcons = [Target, Sparkles, Gauge, ShieldCheck]
const skillCategoryIcons = [Code2, Database, Terminal, Cpu]
const mathIcons = [LineChart, Network, Brain, MessageSquareText, TrendingUp, Sigma]
const mathFormulas = [
  'E[f(X)] ≈ (1/N) Σ f(xᵢ)',
  'Attention(Q,K,V) = softmax(QKᵀ/√d)V',
  'y = σ(Wx + b)',
  'P(w|context) = softmax(h · W)',
  'sentiment ∈ [-1, 1]',
  'P(H|E) = P(E|H)P(H) / P(E)',
]

export default function Instructor() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'
  const c = content[lang]
  const { isLoggedIn } = useAuth()

  return (
    <>
      <SEO
        title={c.seo.title}
        description={c.seo.description}
        path="/instructor"
        image="/og-image.png"
        imageAlt={c.seo.imageAlt}
        type="profile"
        keywords="charles jackson instructor, ai agent course instructor, entrepreneur teacher, cursuum founder, microhabitat cto, nesto dialogue bus.com startups, ai for business"
        jsonLd={{
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Charles Jackson',
            jobTitle: 'AI Agent Orchestration Instructor',
            description: c.seo.description,
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
                  {c.badge}
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1} immediate>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
                {c.heading}{' '}
                <span className="text-muted-foreground">2015</span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2} immediate>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed mb-10">
                {c.bio.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.3} immediate>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/curriculum">
                    {c.cta.curriculum}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                {!isLoggedIn && (
                  <Button size="lg" variant="outline" className="font-mono" asChild>
                    <Link to="/contact">{t('nav.getInTouch')}</Link>
                  </Button>
                )}
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
              { value: 10, suffix: '+', label: c.stats.years },
              { value: 400, suffix: 'M+', label: c.stats.raised },
              { value: 277, suffix: 'M', label: c.stats.exit },
              { value: 7, suffix: '', label: c.stats.startups },
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
              {c.career.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {c.career.subtitle}
            </p>
          </ScrollFadeIn>

          <div className="max-w-3xl">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-foreground/10" />

              <div className="space-y-12">
                {c.companies.map((item, index) => (
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
                              {c.career.currentBadge}
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
                )}
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
              {c.skills.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {c.skills.subtitle}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
            {c.skills.categories.map(({ title, skills }, index) => {
              const Icon = skillCategoryIcons[index]
              return (
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
              )
            })}
          </div>
        </div>
      </Section>

      {/* Philosophy */}
      <Section id="instructor-philosophy" className="py-24 lg:py-32 relative overflow-hidden">
        <SectionSpots variant="default" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {c.philosophy.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {c.philosophy.subtitle}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-3xl">
            {c.philosophy.items.map(({ title, desc }, index) => {
              const Icon = philosophyIcons[index]
              return (
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
              )
            })}
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
              {c.research.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {c.research.heading}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {c.research.subtitle}
            </p>
          </ScrollFadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {c.research.items.map(({ title, description }, index) => {
              const Icon = mathIcons[index]
              const formula = mathFormulas[index]
              return (
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
              )
            })}
          </div>

          <ScrollFadeIn>
            <div className="max-w-3xl">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {c.research.closingP1}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {c.research.closingP2}
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
              {c.ctaSection.heading}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {c.ctaSection.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {!isLoggedIn && (
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/tiers">
                    {c.cta.enroll}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              <Button size="lg" variant="outline" className="font-mono" asChild>
                <Link to="/projects">{c.ctaSection.viewProjects}</Link>
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
