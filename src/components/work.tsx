import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
import { Reveal, Section, SectionHeader } from './section'
import { SpotlightCard } from './spotlight-card'

export function Work() {
  return (
    <Section id="work">
      <SectionHeader
        index="02"
        label="selected work"
        title={
          <>
            What I'm <span className="text-foreground/40">building.</span>
          </>
        }
      />

      {/* responsive grid — an odd count leads with a full-width feature card, then clean pairs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {site.work.map((w, i) => {
          // odd count → first card leads full-width, the rest pair off (1 · 2 · 2 …)
          const spanFull = i === 0 && site.work.length % 2 === 1
          return (
            <Reveal
              key={w.id}
              delay={i * 0.06}
              className={cn('h-full', spanFull && 'sm:col-span-2')}
            >
              <a
                href={w.url}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor="hover"
                aria-label={`${w.name} — ${w.kind} (opens in a new tab)`}
                className="block h-full"
              >
                <SpotlightCard className="flex h-full min-h-[190px] flex-col justify-between p-7 md:p-8">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-foreground/35">{w.id}</span>
                    <span
                      aria-hidden
                      className="font-mono text-lg text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/80"
                    >
                      ↗
                    </span>
                  </div>
                  <div
                    className={cn(
                      spanFull &&
                        'sm:flex sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-8 sm:gap-y-2',
                    )}
                  >
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{w.name}</h3>
                      <p className="mt-1.5 font-mono text-sm text-foreground/50">{w.kind}</p>
                    </div>
                    <p
                      className={cn(
                        'mt-4 font-mono text-xs text-foreground/50',
                        spanFull && 'sm:mt-0',
                      )}
                    >
                      {w.domain}
                    </p>
                  </div>
                </SpotlightCard>
              </a>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
