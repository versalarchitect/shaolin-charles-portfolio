const CELLS: [string, string][] = [
  ['lat', '49.28°N'],
  ['lon', '123.12°W'],
  ['loc', 'Vancouver'],
  ['sys', 'online'],
  ['ver', '1.0'],
]

/** Thin telemetry strip framing the bottom of the page. */
export function BottomBar() {
  return (
    <div className="border-t border-foreground/10">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] sm:justify-between sm:gap-x-8">
        {CELLS.map(([k, v]) => (
          <span key={k} className="flex items-center gap-2">
            <span className="text-foreground/30">{k}</span>
            {k === 'sys' && (
              <span aria-hidden className="relative flex h-1 w-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/50" />
                <span className="relative inline-flex h-1 w-1 rounded-full bg-foreground/80" />
              </span>
            )}
            <span className="text-foreground/60">{v}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
