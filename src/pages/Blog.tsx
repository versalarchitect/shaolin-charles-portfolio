import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/SEO'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Calendar,
  Clock,
  Tag,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, useReducedMotion } from 'framer-motion'
import {
  BlurFadeIn,
  ScrollFadeIn,
  Magnetic,
  HoverCard3D,
  RevealOnScroll,
  StaggerContainer,
  staggerItemVariants,
  TiltCard,
  SpotlightCard,
} from '@/components/ui/aaa-effects'
import { SectionSpots, Section } from '@/components/ui/gradient-background'

// Blog post type
interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  category: string
  tags: string[]
  readTime: number
  publishedAt: string
  featured?: boolean
  image?: string
}

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'building-predictive-architecture',
    title: 'Building Predictive: Architecture Decisions That Scale',
    excerpt:
      'A deep dive into the architectural decisions behind Predictive, including how we handle 17 interconnected life domains, 230+ user profile fields, and real-time Monte Carlo simulations.',
    category: 'Architecture',
    tags: ['React', 'TypeScript', 'Supabase', 'Performance'],
    readTime: 12,
    publishedAt: '2024-12-15',
    featured: true,
  },
  {
    id: '2',
    slug: 'nx-monorepo-at-scale',
    title: 'Nx Monorepo at Scale: Lessons from Building a Prediction Platform',
    excerpt:
      'How we structured our Nx monorepo to support multiple applications, shared libraries, and incremental builds that cut CI time by 60%.',
    category: 'DevOps',
    tags: ['Nx', 'Monorepo', 'CI/CD', 'TypeScript'],
    readTime: 8,
    publishedAt: '2024-12-10',
  },
  {
    id: '3',
    slug: 'monte-carlo-simulations-web',
    title: 'Monte Carlo Simulations in the Browser: A Practical Guide',
    excerpt:
      'Implementing high-performance Monte Carlo simulations with Web Workers, shared memory, and efficient data structures for real-time predictions.',
    category: 'Engineering',
    tags: ['Algorithms', 'Performance', 'Python', 'Web Workers'],
    readTime: 15,
    publishedAt: '2024-12-05',
  },
  {
    id: '4',
    slug: 'supabase-row-level-security',
    title: 'Mastering Supabase Row Level Security for Multi-Tenant Apps',
    excerpt:
      'A comprehensive guide to implementing bulletproof RLS policies that scale. Real examples from a 230-field user profile system.',
    category: 'Security',
    tags: ['Supabase', 'PostgreSQL', 'Security', 'Database'],
    readTime: 10,
    publishedAt: '2024-11-28',
  },
  {
    id: '5',
    slug: 'webgpu-rendering-3d-worlds',
    title: 'WebGPU-First Rendering: Building Browser-Based 3D Worlds',
    excerpt:
      'How we achieved 60fps with 10M+ particles using WebGPU compute shaders, GPU-based terrain generation, and optimized render pipelines.',
    category: 'Graphics',
    tags: ['WebGPU', 'Three.js', '3D', 'Performance'],
    readTime: 18,
    publishedAt: '2024-11-20',
  },
  {
    id: '6',
    slug: 'react-query-patterns',
    title: 'Advanced React Query Patterns for Real-Time Applications',
    excerpt:
      'Optimistic updates, infinite queries, and cache management strategies that power Predictive\'s real-time analytics dashboard.',
    category: 'Frontend',
    tags: ['React', 'React Query', 'Caching', 'Performance'],
    readTime: 9,
    publishedAt: '2024-11-15',
  },
]

// Categories with counts
const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Architecture', count: blogPosts.filter((p) => p.category === 'Architecture').length },
  { name: 'Engineering', count: blogPosts.filter((p) => p.category === 'Engineering').length },
  { name: 'Frontend', count: blogPosts.filter((p) => p.category === 'Frontend').length },
  { name: 'DevOps', count: blogPosts.filter((p) => p.category === 'DevOps').length },
  { name: 'Security', count: blogPosts.filter((p) => p.category === 'Security').length },
  { name: 'Graphics', count: blogPosts.filter((p) => p.category === 'Graphics').length },
]

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Featured Post Component
function FeaturedPost({ post }: { post: BlogPost }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <RevealOnScroll direction="up">
      <HoverCard3D className="rounded-2xl" glowColor="rgba(255, 255, 255, 0.1)" depth={40}>
        <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-background to-foreground/[0.02]">
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-mono bg-foreground text-background px-3 py-1 rounded">
                    FEATURED
                  </span>
                  <span className="text-xs font-mono text-muted-foreground px-3 py-1 rounded border border-foreground/10">
                    {post.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  {post.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed text-lg">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {post.readTime} min read
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                      className="text-xs font-mono bg-foreground/5 px-3 py-1.5 rounded-full border border-foreground/10 hover:border-foreground/20 transition-colors cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                <Magnetic strength={0.2}>
                  <Button className="gap-2 font-mono group" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read Article
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>

              {/* Visual Element */}
              <div className="hidden md:block relative">
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Decorative elements */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-foreground/10"
                    animate={prefersReducedMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-4 rounded-2xl border border-dashed border-foreground/[0.06]"
                    animate={prefersReducedMotion ? {} : { rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-8 rounded-2xl border border-foreground/[0.04]"
                    animate={prefersReducedMotion ? {} : { rotate: 180 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
                      className="w-24 h-24 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center"
                    >
                      <BookOpen className="w-10 h-10 text-foreground/60" />
                    </motion.div>
                  </div>

                  {/* Floating badges */}
                  {[
                    { text: post.category, x: '15%', y: '20%', delay: 0 },
                    { text: `${post.readTime}m`, x: '75%', y: '15%', delay: 0.1 },
                    { text: post.tags[0], x: '80%', y: '70%', delay: 0.2 },
                    { text: post.tags[1], x: '10%', y: '75%', delay: 0.3 },
                  ].map((badge, i) => (
                    <motion.div
                      key={badge.text}
                      className="absolute"
                      style={{ left: badge.x, top: badge.y }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: badge.delay, duration: 0.5, type: 'spring' }}
                    >
                      <motion.div
                        animate={
                          prefersReducedMotion
                            ? {}
                            : {
                                y: [0, -8, 0],
                                rotate: [0, i % 2 === 0 ? 2 : -2, 0],
                              }
                        }
                        transition={{
                          duration: 4 + i * 0.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="px-3 py-1.5 backdrop-blur-sm border rounded-full font-mono whitespace-nowrap bg-foreground/5 border-foreground/10 text-foreground/60 text-xs"
                      >
                        {badge.text}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </HoverCard3D>
    </RevealOnScroll>
  )
}

// Blog Post Card Component
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={staggerItemVariants}>
      <Link to={`/blog/${post.slug}`} className="block h-full">
        <TiltCard tiltAmount={8} glareEnabled={true} glareOpacity={0.08} className="h-full">
          <SpotlightCard
            className="h-full"
            spotlightColor="rgba(255,255,255,0.08)"
            spotlightSize={250}
          >
            <Card className="h-full p-6 bg-background border-foreground/10 hover:border-foreground/20 transition-all group cursor-pointer">
              <div className="flex flex-col h-full">
                {/* Category & Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}m
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 group-hover:text-foreground transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono bg-foreground/5 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="text-xs font-mono text-foreground/60 group-hover:text-foreground flex items-center gap-1 transition-colors">
                    Read
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Card>
          </SpotlightCard>
        </TiltCard>
      </Link>
    </motion.div>
  )
}

export default function Blog() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')
  const prefersReducedMotion = useReducedMotion()

  // Filter posts by category
  const filteredPosts =
    activeCategory === 'All'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory)

  // Get featured post (first one marked as featured)
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = filteredPosts.filter((post) => !post.featured)

  return (
    <>
      <SEO
        title={t('blog.meta.title')}
        description={t('blog.meta.description')}
        path="/blog"
        type="blog"
        image="/og-blog.png"
        imageAlt="Charles Jackson Technical Blog - Architecture, Performance, and TypeScript"
        keywords="software architecture blog, react typescript articles, full stack development tutorials, web development insights, performance optimization"
      />

      {/* Hero Section */}
      <Section id="blog-hero" className="relative min-h-[50vh] flex items-center overflow-hidden">
        <SectionSpots variant="hero" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl">
            <BlurFadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-full mb-8">
                <BookOpen className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-xs font-mono text-foreground/60">
                  {t('blog.hero.badge', 'Technical Blog')}
                </span>
              </div>
            </BlurFadeIn>

            <BlurFadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {t('blog.hero.title', 'Thoughts on')}{' '}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  {t('blog.hero.titleHighlight', 'Building Software')}
                </span>
              </h1>
            </BlurFadeIn>

            <BlurFadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                {t(
                  'blog.hero.subtitle',
                  'Deep dives into architecture decisions, performance optimization, and lessons learned from two decades of shipping production code.'
                )}
              </p>
            </BlurFadeIn>
          </div>
        </div>
      </Section>

      {/* Featured Post */}
      {featuredPost && (
        <Section id="blog-featured" className="py-12 lg:py-16 relative overflow-hidden">
          <SectionSpots variant="default" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <FeaturedPost post={featuredPost} />
          </div>
        </Section>
      )}

      {/* Categories Filter */}
      <Section id="blog-categories" className="py-8 relative">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn>
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                  className={`
                    px-4 py-2 rounded-full font-mono text-sm transition-all
                    ${
                      activeCategory === category.name
                        ? 'bg-foreground text-background'
                        : 'bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/10 border border-foreground/10'
                    }
                  `}
                >
                  {category.name}
                  <span
                    className={`ml-1.5 text-xs ${
                      activeCategory === category.name ? 'text-background/60' : 'text-foreground/40'
                    }`}
                  >
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </Section>

      {/* Blog Grid */}
      <Section id="blog-grid" className="py-12 lg:py-20 relative overflow-hidden">
        <SectionSpots variant="accent" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <StaggerContainer
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.08}
          >
            {regularPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </StaggerContainer>

          {regularPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found in this category.
              </p>
            </div>
          )}
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section id="blog-newsletter" className="py-20 lg:py-28 relative overflow-hidden">
        <SectionSpots variant="subtle" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <ScrollFadeIn className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-foreground/5 border border-foreground/10 rounded-full text-xs font-mono text-muted-foreground mb-6">
              <Sparkles className="w-3 h-3" />
              {t('blog.newsletter.badge', 'Stay Updated')}
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t('blog.newsletter.title', 'More articles coming soon')}
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              {t(
                'blog.newsletter.subtitle',
                "I write about building production systems, architecture patterns, and lessons learned from shipping software. Follow along as I share more insights."
              )}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.15}>
                <Button size="lg" className="font-mono group" asChild>
                  <Link to="/contact">
                    {t('common.startConversation', 'Get in Touch')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.15}>
                <Button size="lg" variant="outline" className="font-mono" asChild>
                  <Link to="/projects">{t('blog.newsletter.viewProjects', 'View Projects')}</Link>
                </Button>
              </Magnetic>
            </div>
          </ScrollFadeIn>
        </div>
      </Section>
    </>
  )
}
