import { site } from '@/lib/site'
import { Reveal, Section, SectionHeader } from './section'
import { SpotlightCard } from './spotlight-card'

const TECH = [
  'TypeScript',
  'React',
  'Python',
  'Node',
  'LLMs / RAG',
  'Three.js',
  'Vercel',
  'Postgres',
  'Tailwind',
  'Canvas / WebGL',
]

export function Capabilities() {
  return (
    <Section id="stack">
      <SectionHeader
        index="03"
        label="capabilities"
        title={
          <>
            What I <span className="text-foreground/40">do.</span>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {site.capabilities.map((c, i) => (
          <Reveal key={c.tag} delay={i * 0.06}>
            <SpotlightCard className="h-full p-6 md:p-8">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-5 select-none font-mono text-7xl font-bold leading-none text-foreground/[0.03]"
              >
                {c.tag}
              </span>
              <div className="relative flex h-full flex-col">
                <span className="font-mono text-xs text-foreground/40">[ {c.tag} ]</span>
                <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">{c.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-foreground/60 md:text-base">
                  {c.body}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {TECH.map((t) => (
            <li
              key={t}
              className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 font-mono text-xs text-foreground/60"
            >
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
