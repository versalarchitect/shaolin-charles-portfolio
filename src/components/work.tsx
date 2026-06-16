import { site } from '@/lib/site'
import { Reveal, Section, SectionHeader } from './section'
import { SpotlightCard } from './spotlight-card'

function StatusTag({ children }: { children: string }) {
  return (
    <span className="shrink-0 rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/55">
      {children}
    </span>
  )
}

export function Work() {
  return (
    <Section id="work">
      <SectionHeader
        index="02"
        label="selected work"
        title={
          <>
            Currently <span className="text-foreground/40">in flight.</span>
          </>
        }
      />

      <div className="flex flex-col gap-3 md:gap-4">
        {site.work.map((w, i) => (
          <Reveal key={w.id} delay={i * 0.06}>
            <SpotlightCard className="px-6 py-7 md:px-8">
              <div className="flex items-center gap-4 md:gap-6">
                <span className="font-mono text-xs text-foreground/35">{w.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-mono text-xl font-medium tracking-tight md:text-2xl">
                      {w.name}
                    </h3>
                    <StatusTag>{w.status}</StatusTag>
                  </div>
                  <p className="mt-1.5 font-mono text-sm text-foreground/50">{w.kind}</p>
                </div>
                <span
                  aria-hidden
                  className="font-mono text-lg text-foreground/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground/80"
                >
                  →
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-8 font-mono text-xs text-foreground/40">
          {'// case studies land here soon — currently shipping in private.'}
        </p>
      </Reveal>
    </Section>
  )
}
