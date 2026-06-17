import { motion, useReducedMotion } from 'motion/react'
import { site } from '@/lib/site'

export function Hero() {
  const reduce = useReducedMotion()
  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.9, delay, ease: 'easeOut' as const },
        }

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col">
      {/* masthead: big cybernetic name · role · theme (left), links (right) */}
      <motion.div {...reveal(0)} className="px-6 pt-6">
        <div className="flex items-end justify-between gap-6">
          <a
            href="#top"
            data-cursor="hover"
            className="whitespace-nowrap font-display text-[1.6rem] font-bold uppercase leading-[0.82] tracking-tight transition-opacity hover:opacity-70 sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            Charles Jackson
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex shrink-0 items-center gap-6 pb-1.5">
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
        </div>

        {/* role — its own line, right under the name */}
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/55">
          {site.role}
        </p>
      </motion.div>

      {/* interactive frame — the gravity well lives in the page background */}
      <div className="relative flex-1">
        <motion.div
          {...reveal(0.2)}
          className="absolute bottom-6 left-6 whitespace-nowrap font-mono text-xs tracking-wide text-foreground/60 sm:text-sm"
        >
          <span className="text-foreground/35">&gt; </span>focused on building predictive systems
        </motion.div>

        <motion.a
          {...reveal(0.28)}
          href="#about"
          data-cursor="hover"
          className="group absolute bottom-6 right-6 hidden items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/45 transition-colors hover:text-foreground sm:flex"
        >
          scroll
          <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">
            ↓
          </span>
        </motion.a>
      </div>
    </section>
  )
}
