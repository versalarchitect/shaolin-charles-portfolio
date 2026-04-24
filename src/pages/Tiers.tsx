import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'

export default function Tiers() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Pricing & Tiers — The Agentic SaaS Course"
        description="4 tiers from Foundations to Architect. Each tier is harder, each capstone closer to professional software. Choose the path that matches your ambition."
        path="/tiers"
        keywords="agentic saas course pricing, ai course tiers, coding course enrollment, foundations tier, builder tier, operator tier, architect tier, course pricing plans"
        jsonLd={{
          '@type': 'OfferCatalog',
          name: 'The Agentic SaaS Course — Enrollment Tiers',
          description: '4 tiers from Foundations to Architect, each with a real capstone project.',
          url: 'https://shaolincharles.dev/tiers',
          itemListElement: [
            { '@type': 'Offer', name: 'Tier 1 — Foundations', description: '8 hours, 10 lessons. Learn the fundamentals and deploy your first AI-assisted tool.' },
            { '@type': 'Offer', name: 'Tier 2 — Builder', description: '12 hours, 12 lessons. Build a full CRUD SaaS with auth, database, and payments.' },
            { '@type': 'Offer', name: 'Tier 3 — Operator', description: '15 hours, 14 lessons. Ship a product with real users and handle production.' },
            { '@type': 'Offer', name: 'Tier 4 — Architect', description: '15 hours, 12 lessons. Tear down a complex system and prove architectural judgment.' },
          ],
        }}
      />

      <Section id="tiers" className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-8 text-center py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('nav.tiers')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Coming soon.
          </p>
        </div>
      </Section>
    </>
  )
}
