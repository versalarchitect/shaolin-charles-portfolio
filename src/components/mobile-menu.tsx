import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

/**
 * Minimal mobile navigation — a fixed "menu" trigger (lg-and-below only) that
 * opens a full-screen overlay with the section links + channels. Phones have no
 * inline nav otherwise.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="fixed right-6 top-6 z-[55] font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
      >
        menu
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-background px-6 pb-10 pt-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                Charles Jackson
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
              >
                close
              </button>
            </div>

            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1">
              {site.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-fit font-display text-4xl font-bold uppercase tracking-tight text-foreground/90 transition-colors hover:text-foreground sm:text-5xl"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center gap-6 font-mono text-sm">
              <a
                href={`mailto:${site.email}`}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                email ↗
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                github ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
