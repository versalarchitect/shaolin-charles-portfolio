import { motion } from 'motion/react'
import type { Platform } from '@/data/lessons/types'
import { usePlatform } from '@/components/platform-provider'

const PLATFORM_META: Record<Platform, { label: string; icon: React.ReactNode }> = {
  macos: {
    label: 'macOS',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M11.182 4.985c-.284.18-.53.423-.72.714a2.43 2.43 0 0 0-.388 1.088c.325.025.636-.054.934-.236.298-.183.537-.427.717-.733.18-.306.291-.623.334-.95a2.09 2.09 0 0 0-.877.117zm.96 2.243c-.54-.032-1 .138-1.378.338-.268.141-.502.214-.72.214-.234 0-.445-.073-.74-.222-.373-.19-.706-.27-1.039-.258-.87.03-1.713.654-2.134 1.592-.62 1.384-.163 3.441.868 4.57.357.391.784.83 1.345.815.357-.014.554-.116.867-.233.314-.118.579-.172.893-.17.33.005.568.068.895.2.33.134.588.176.862.171.58-.012.965-.389 1.358-.826.28-.31.47-.58.63-.832a4.14 4.14 0 0 1-.907-.765c-.436-.487-.66-1.074-.664-1.704-.006-.852.363-1.55.992-2.093a2.22 2.22 0 0 0-.128-.597z" />
      </svg>
    ),
  },
  windows: {
    label: 'Windows',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M6.555 3.168L2 3.76v4.063h4.555V3.168zm.89-.11l5.556-.726v5.49H7.444V3.06zM13 8.676H7.444v5.265l5.556.727V8.676zM6.555 8.676H2v4.064l4.555.59V8.676z" />
      </svg>
    ),
  },
  linux: {
    label: 'Linux',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M8 2c-1.1 0-2 1.12-2 2.5v1c-.14.43-.22.9-.22 1.38 0 .77.2 1.48.55 2.03-.73.45-1.33 1.1-1.33 1.84 0 .35.12.67.33.94C4.48 12.27 4 12.82 4 13.5c0 .28.22.5.5.5h7a.5.5 0 0 0 .5-.5c0-.68-.48-1.23-1.33-1.81.21-.27.33-.59.33-.94 0-.74-.6-1.39-1.33-1.84.35-.55.55-1.26.55-2.03 0-.48-.08-.95-.22-1.38v-1C10 3.12 9.1 2 8 2zm-1 2.5c0-.83.45-1.5 1-1.5s1 .67 1 1.5V5H7v-.5zM8 6c.83 0 1.56.36 2.07.93.14.37.21.78.21 1.19 0 .7-.23 1.32-.6 1.78l-.3.36.4.24c.6.37 1.04.82 1.15 1.25H5.07c.11-.43.55-.88 1.15-1.25l.4-.24-.3-.36C5.95 9.44 5.72 8.82 5.72 8.12c0-.41.07-.82.21-1.19C6.44 6.36 7.17 6 8 6z" />
      </svg>
    ),
  },
}

interface PlatformTabsProps {
  availablePlatforms: Platform[]
  className?: string
}

export function PlatformTabs({ availablePlatforms, className = '' }: PlatformTabsProps) {
  const { platform, setPlatform } = usePlatform()
  const activePlatform = availablePlatforms.includes(platform) ? platform : availablePlatforms[0]

  return (
    <div className={`inline-flex items-center gap-0.5 rounded-lg bg-foreground/[0.04] border border-foreground/[0.08] p-0.5 ${className}`}>
      {availablePlatforms.map((p) => {
        const meta = PLATFORM_META[p]
        const isActive = p === activePlatform
        return (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
              isActive ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/60'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="platform-indicator"
                className="absolute inset-0 rounded-md bg-foreground/[0.08] border border-foreground/[0.1]"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {meta.icon}
              <span className="hidden sm:inline">{meta.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
