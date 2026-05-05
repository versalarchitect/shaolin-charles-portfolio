import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import { usePatienceEgg } from '@/components/gamification/easter-egg-handler'

export default function NotFound() {
  const { t } = useTranslation()
  const { showMessage } = usePatienceEgg()

  return (
    <>
      <SEO
        title={`404 - ${t('notFound.title')}`}
        description={t('notFound.description')}
        noindex
      />

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

          {/* Patience easter egg message */}
          <AnimatePresence>
            {showMessage && (
              <motion.p
                className="text-sm text-foreground/50 font-mono mt-8 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                You waited. Most people don't. Here's your reward.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
