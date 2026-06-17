import { useEffect, useState } from 'react'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * Condensed sticky bar. Hidden at the top (the hero masthead carries the
 * identity there); slides in once you scroll past the hero.
 */
export function Nav() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      inert={!show}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
        show
          ? 'nav-surface translate-y-0 border-foreground/10 opacity-100'
          : 'pointer-events-none -translate-y-full border-transparent opacity-0',
      )}
    >
      <nav aria-label="Site" className="flex items-center justify-between px-6 py-3.5">
        <a
          href="#top"
          data-cursor="hover"
          className="font-display text-sm font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
        >
          Charles Jackson
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-cursor="hover"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50 transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
