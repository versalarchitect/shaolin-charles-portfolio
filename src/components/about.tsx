import { site } from '@/lib/site'
import { Reveal, Section, SectionHeader } from './section'

const SPECS: [string, string][] = [
  ['role', 'agentic systems eng.'],
  ['focus', 'agents · llm systems'],
  ['stack', 'typescript · python'],
  ['location', 'remote / montréal'],
  ['status', 'building'],
]

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        index="01"
        label="about"
        title={
          <>
            I build software <span className="text-foreground/40">that runs itself.</span>
          </>
        }
      />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          {site.manifesto.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <p className="text-pretty text-lg leading-relaxed text-foreground/70 md:text-xl">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-foreground/12 bg-foreground/[0.02]">
            <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5 font-mono text-[11px] text-foreground/45">
              <span>~/charles.spec</span>
              <span aria-hidden>◦ ◦ ◦</span>
            </div>
            <dl className="divide-y divide-foreground/10 px-4">
              {SPECS.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-4 py-3 font-mono text-sm"
                >
                  <dt className="text-foreground/45">{k}</dt>
                  <dd className="text-right text-foreground/85">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
