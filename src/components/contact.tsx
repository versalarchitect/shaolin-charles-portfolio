import { site } from '@/lib/site'
import { Reveal, Section, SectionHeader } from './section'
import { SpotlightCard } from './spotlight-card'
import { buttonVariants } from './ui/button'

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeader
        index="04"
        label="contact"
        title={
          <>
            Find me <span className="text-foreground/40">here.</span>
          </>
        }
      />

      <Reveal>
        <SpotlightCard className="p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="max-w-md text-lg text-foreground/65 md:text-xl">
                Building an agent, an LLM product, or something that should run itself? Email's the
                best way to reach me.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${site.email}`}
                  data-cursor="hover"
                  className={buttonVariants({ size: 'lg', className: 'group' })}
                >
                  email me
                  <span
                    aria-hidden
                    className="font-mono transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  className={buttonVariants({ size: 'lg', variant: 'outline', className: 'group' })}
                >
                  github
                  <span
                    aria-hidden
                    className="font-mono transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </div>

              <p className="mt-6 font-mono text-xs text-foreground/40">{site.email}</p>
            </div>

            {/* a quiet technical panel where the face used to be */}
            <div>
              <div className="glass-surface rounded-xl border border-foreground/10 p-5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-foreground/10 pb-3 text-foreground/45">
                  <span>~/transmission</span>
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/40" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/80" />
                    </span>
                    open
                  </span>
                </div>
                <div className="space-y-2 pt-3 text-foreground/60">
                  <p>
                    <span className="text-foreground/30">to&nbsp;&nbsp;</span>
                    {site.email}
                  </p>
                  <p>
                    <span className="text-foreground/30">re&nbsp;&nbsp;</span>a new system
                  </p>
                  <p>
                    <span className="text-foreground/30">loc&nbsp;</span>remote / vancouver
                  </p>
                  <p>
                    <span className="text-foreground/30">eta&nbsp;</span>&lt; 24h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </Section>
  )
}
