import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'

export default function Principles() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="8 Principles — The Agentic SaaS Course"
        description="The 8 timeless principles behind building software with AI. Judgment over prompt tricks, principles over patterns, builders not prompters. These outlast the next model release."
        path="/principles"
        keywords="ai development principles, software engineering principles, building with ai guidelines, judgment over prompts, principles-first development, agentic development philosophy"
        jsonLd={{
          '@type': 'ItemList',
          name: '8 Principles of the Agentic SaaS Course',
          description: 'Timeless principles for building software with AI that outlast the next model release.',
          url: 'https://shaolincharles.dev/principles',
          numberOfItems: 8,
        }}
      />

      <Section id="principles" className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 lg:px-8 text-center py-32">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('nav.principles')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Coming soon.
          </p>
        </div>
      </Section>
    </>
  )
}
