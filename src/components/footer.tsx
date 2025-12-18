import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail, ArrowUpRight } from 'lucide-react'
import { FOOTER_NAV, SOCIAL_LINKS, SITE } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  // Map nav items to translated names
  const mainNavigation = FOOTER_NAV.map((item) => ({
    name: t(item.nameKey),
    href: item.href,
  }))

  return (
    <footer className="border-t border-border bg-muted/30" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container mx-auto px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                <span className="text-background font-bold">CG</span>
              </div>
              <span className="text-xl font-bold">Charles</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  whileHover={{ y: -2 }}
                  className="p-2.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t('nav.navigation')}
            </h3>
            <nav className="space-y-3">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {item.name}
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact CTA */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {t('footer.letsConnect')}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('footer.openTo')}
            </p>
            <motion.a
              href={`mailto:${SITE.email}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {t('footer.getInTouch')}
            </motion.a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
