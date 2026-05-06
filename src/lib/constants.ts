import { Github, Instagram, Mail } from 'lucide-react'

// =============================================================================
// SITE METADATA
// =============================================================================

export const SITE = {
  name: 'Charles Jackson',
  shortName: 'Charles',
  initials: 'CJ',
  title: 'AI Agent Orchestration Instructor',
  description: 'Learn to direct AI agents that build real software for your business.',
  url: 'https://charlesjackson.dev',
  email: 'hello@charlesjackson.dev',
} as const

// =============================================================================
// NAVIGATION
// =============================================================================

export interface NavItem {
  /** Translation key for the nav item name */
  nameKey: string
  /** Route path */
  href: string
  /** Whether to show in main navigation (header) */
  showInHeader?: boolean
  /** Whether to show in footer navigation */
  showInFooter?: boolean
  /** Whether this is an external link */
  external?: boolean
}

/**
 * Main navigation items used across the site.
 * All items use translation keys for i18n support.
 */
export const NAV_ITEMS: NavItem[] = [
  { nameKey: 'nav.home', href: '/', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.curriculum', href: '/curriculum', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.principles', href: '/principles', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.tiers', href: '/tiers', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.blog', href: '/blog', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.selfUpdatingCourse', href: '/self-updating-course', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.instructor', href: '/instructor', showInHeader: true, showInFooter: true },
  { nameKey: 'nav.contact', href: '/contact', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.dashboard', href: '/course/dashboard', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.community', href: '/course/community', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.interests', href: '/interests', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.about', href: '/about', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.projects', href: '/projects', showInHeader: false, showInFooter: false },
  { nameKey: 'nav.art', href: '/art', showInHeader: false, showInFooter: false },
]

/** Navigation items for the header */
export const HEADER_NAV = NAV_ITEMS.filter((item) => item.showInHeader)

/** Navigation items for the footer */
export const FOOTER_NAV = NAV_ITEMS.filter((item) => item.showInFooter)

// =============================================================================
// SOCIAL LINKS
// =============================================================================

export interface SocialLink {
  name: string
  href: string
  icon: typeof Github
}

/**
 * Social media and contact links.
 * Note: LinkedIn is intentionally excluded per design guidelines.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/versalarchitect',
    icon: Github,
  },
  {
    name: 'Email',
    href: `mailto:${SITE.email}`,
    icon: Mail,
  },
]

// =============================================================================
// EXTERNAL LINKS
// =============================================================================

export const EXTERNAL_LINKS = {
  github: 'https://github.com/versalarchitect',
  predictive: 'https://augure.app',
  myUrbanFarm: 'https://myurbanfarm.ai',
} as const

// =============================================================================
// PROJECTS
// =============================================================================

export interface ProjectInfo {
  name: string
  role: string
  url?: string
}

/**
 * Featured projects with roles.
 * Used in About page and other places.
 */
export const PROJECTS: ProjectInfo[] = [
  {
    name: 'Predictive (Augure)',
    role: 'Founder & Principal Developer',
    url: EXTERNAL_LINKS.predictive,
  },
  {
    name: 'MyUrbanFarm.ai',
    role: 'CTO & Principal Software Developer',
    url: EXTERNAL_LINKS.myUrbanFarm,
  },
  {
    name: 'World',
    role: 'Creator & Developer',
  },
]

// =============================================================================
// SITEMAP (for SEO and reference)
// =============================================================================

export const SITEMAP = {
  pages: [
    { path: '/', name: 'Home', priority: 1.0 },
    { path: '/interests', name: 'Interests', priority: 0.9 },
    { path: '/about', name: 'About', priority: 0.8 },
    { path: '/projects', name: 'Projects', priority: 0.8 },
    { path: '/blog', name: 'Blog', priority: 0.9 },
    { path: '/art/abstract', name: 'Art - Abstract', priority: 0.7 },
    { path: '/art/worlds', name: 'Art - Worlds', priority: 0.7 },
    { path: '/contact', name: 'Contact', priority: 0.8 },
  ],
} as const
