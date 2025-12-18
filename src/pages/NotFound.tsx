import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>404 - {t('notFound.title')}</title>
        <meta name="description" content={t('notFound.title')} />
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-8xl md:text-9xl font-bold">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold">{t('notFound.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {t('notFound.description')}
          </p>
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              {t('notFound.backHome')}
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
