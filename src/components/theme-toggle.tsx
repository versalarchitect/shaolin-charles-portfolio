import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

/** Bare, subtle icon — no border, no sphere. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggle } = useTheme()
  const dark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      data-cursor="hover"
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative inline-grid h-4 w-4 place-items-center text-foreground/40 transition-colors hover:text-foreground',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -25 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 25 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {dark ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
