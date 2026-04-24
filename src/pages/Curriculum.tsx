import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'

export default function Curriculum() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Curriculum — The Agentic SaaS Course"
        description="52 hours across 51 lessons and 4 tiers. From tokens and context windows to system teardowns. Learn Next.js, Supabase, Claude Code, Stripe, and Vercel — guided by 8 timeless principles."
        path="/curriculum"
        keywords="agentic saas curriculum, ai development lessons, course syllabus, next.js lessons, supabase tutorial, claude code training, full stack course outline, 52 hour coding course"
        jsonLd={{
          '@type': 'Course',
          name: 'The Agentic SaaS Course — Full Curriculum',
          description: '52 hours of principles-first instruction across 51 lessons and 4 tiers, from first deploy to system teardown.',
          url: 'https://shaolincharles.dev/curriculum',
          provider: { '@type': 'Person', name: 'Charles Jackson' },
          numberOfCredits: '52 hours',
          educationalLevel: 'Intermediate to Advanced',
          teaches: ['AI-Assisted Development', 'Next.js', 'React', 'TypeScript', 'Supabase', 'Claude Code', 'Vercel', 'Drizzle ORM', 'Stripe', 'Production Operations'],
        }}
      />

      <Section id="curriculum" className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-8 text-center py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('nav.curriculum')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Coming soon.
          </p>
        </div>
      </Section>
    </>
  )
}
