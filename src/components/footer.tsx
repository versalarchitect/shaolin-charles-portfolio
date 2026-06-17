import { site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="#top"
          data-cursor="hover"
          className="font-display text-sm font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-70"
        >
          Charles Jackson
        </a>

        <div className="flex items-center gap-6 font-mono text-xs">
          <a
            href={`mailto:${site.email}`}
            data-cursor="hover"
            className="group inline-flex items-center gap-1.5 text-foreground/70 transition-colors hover:text-foreground"
          >
            email
            <span
              aria-hidden
              className="text-foreground/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="hover"
            className="group inline-flex items-center gap-1.5 text-foreground/70 transition-colors hover:text-foreground"
          >
            github
            <span
              aria-hidden
              className="text-foreground/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/35">
          © {new Date().getFullYear()} · {site.domain}
        </span>
      </div>
    </footer>
  )
}
