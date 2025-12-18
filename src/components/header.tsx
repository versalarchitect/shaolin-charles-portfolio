import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { AlignJustify, X, ArrowUpRight } from 'lucide-react'
import { LanguageSwitcher } from './language-switcher'
import { Logo } from './ui/logo'
import { HEADER_NAV, SOCIAL_LINKS, SITE } from '@/lib/constants'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const prefersReducedMotion = useReducedMotion()
  const { t } = useTranslation()

  // Map nav items to translated names
  const navigation = HEADER_NAV.map((item) => ({
    name: t(item.nameKey),
    href: item.href,
  }))

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 border-b border-border/50 bg-background/80 backdrop-blur-xl" />

      <nav
        className="relative mx-auto flex container items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo with animation */}
        <motion.div
          className="flex lg:flex-1"
          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="relative"
            >
              <Logo size="sm" className="text-foreground" />
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-foreground/30 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
            <motion.span
              className="text-lg font-bold text-foreground hidden sm:block relative"
              whileHover={prefersReducedMotion ? undefined : 'hover'}
            >
              Charles
              <motion.span
                className="absolute -bottom-0.5 left-0 h-[2px] bg-foreground/50"
                initial={{ width: 0 }}
                variants={{ hover: { width: '100%' } }}
                transition={{ duration: 0.2 }}
              />
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop navigation */}
        <motion.div
          className="hidden lg:flex lg:gap-x-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {navigation.map((item) => {
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-colors rounded-lg
                  ${isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-muted rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </motion.div>

        {/* Desktop right section */}
        <motion.div
          className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageSwitcher />
          <Button size="sm" className="font-mono gap-1.5 group" asChild>
            <Link to="/contact">
              {t('nav.getInTouch')}
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <AlignJustify className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-sm bg-background border-l border-border lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Logo size="sm" className="text-foreground" />
                    <span className="text-lg font-bold text-foreground">Charles</span>
                  </Link>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {navigation.map((item, index) => {
                      const isActive = location.pathname === item.href

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            className={`
                              flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all
                              ${isActive
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              }
                            `}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                            {isActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                            )}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </nav>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 border-t border-border"
                >
                  <Button
                    className="w-full h-12 text-base font-mono gap-2"
                    asChild
                  >
                    <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.getInTouch')}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="mt-4 flex items-center justify-center gap-4">
                    {SOCIAL_LINKS.map((link, index) => (
                      <span key={link.name} className="flex items-center gap-4">
                        <a
                          href={link.href}
                          target={link.href.startsWith('mailto') ? undefined : '_blank'}
                          rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </a>
                        {index < SOCIAL_LINKS.length - 1 && (
                          <span className="text-muted-foreground">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
