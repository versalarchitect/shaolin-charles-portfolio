import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui/gradient-background'
import { SEO } from '@/components/SEO'

export default function Curriculum() {
  const { t } = useTranslation()

  return (
    <>
      <SEO
        title="Curriculum - Charles Jackson"
        description="Course curriculum for building software with AI. 52 hours of principles-first instruction."
        path="/curriculum"
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
