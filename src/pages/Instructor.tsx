import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'

export default function Instructor() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Meet the Instructor — Charles Jackson"
        description="20+ years building production systems. Founder of Predictive (Augure), creator of NxSupabase, and instructor of the Agentic SaaS Course. Based in Montreal, Canada."
        path="/instructor"
        type="profile"
        keywords="charles jackson developer, software instructor montreal, full stack developer, ai development teacher, predictive augure founder, nxsupabase creator, 20 years experience"
        jsonLd={{
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Charles Jackson',
            jobTitle: 'Software Instructor',
            description: '20+ years building production systems, now teaching the principles that matter.',
            url: 'https://shaolincharles.dev/instructor',
            image: 'https://shaolincharles.dev/og-image.png',
            sameAs: ['https://github.com/versalarchitect'],
            knowsAbout: ['React', 'Next.js', 'TypeScript', 'Python', 'Supabase', 'Claude Code', 'Vercel', 'Software Architecture'],
            address: { '@type': 'PostalAddress', addressLocality: 'Montreal', addressRegion: 'Quebec', addressCountry: 'CA' },
          },
        }}
      />

      <Section id="instructor" className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-8 text-center py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('nav.instructor')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Coming soon.
          </p>
        </div>
      </Section>
    </>
  )
}
