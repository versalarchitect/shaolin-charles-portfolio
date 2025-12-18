import { useState, createContext, useContext, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type AccordionContextValue = {
  openItems: string[]
  toggle: (value: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) throw new Error('Accordion components must be used within an Accordion')
  return context
}

type AccordionProps = {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggle = (value: string) => {
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]))
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      )
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <div className={cn('space-y-4', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

type AccordionItemProps = {
  value: string
  children: ReactNode
  className?: string
  index?: number
}

export function AccordionItem({ value, children, className, index }: AccordionItemProps) {
  const { openItems } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl border overflow-hidden transition-all duration-300',
        isOpen
          ? 'border-foreground/20 bg-foreground/[0.03]'
          : 'border-foreground/[0.08] bg-transparent hover:border-foreground/15 hover:bg-foreground/[0.02]',
        className
      )}
      layout
    >
      {/* Index number - large and subtle, positioned to avoid plus button */}
      {typeof index === 'number' && (
        <div className="absolute bottom-4 right-4 text-[80px] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      )}
      {children}
    </motion.div>
  )
}

type AccordionTriggerProps = {
  value: string
  children: ReactNode
  icon?: ReactNode
  subtitle?: string
  className?: string
}

export function AccordionTrigger({
  value,
  children,
  icon,
  subtitle,
  className,
}: AccordionTriggerProps) {
  const { openItems, toggle } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={cn(
        'flex w-full items-start justify-between p-6 md:p-8 text-left transition-all relative z-10',
        className
      )}
    >
      <div className="flex items-start gap-5">
        {icon && (
          <motion.div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
              isOpen
                ? 'bg-foreground/10 border-foreground/20'
                : 'bg-foreground/[0.04] border-foreground/10 group-hover:bg-foreground/[0.06] group-hover:border-foreground/15'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 10 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {icon}
            </motion.div>
          </motion.div>
        )}
        <div className="pt-1">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{children}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Plus/Minus toggle button */}
      <motion.div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 mt-2',
          isOpen
            ? 'bg-foreground text-background border-foreground'
            : 'bg-transparent border-foreground/20 group-hover:border-foreground/30'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="minus"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Minus className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

type AccordionContentProps = {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionContent({ value, children, className }: AccordionContentProps) {
  const { openItems } = useAccordion()
  const isOpen = openItems.includes(value)

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: 'auto',
            opacity: 1,
            transition: {
              height: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.3, delay: 0.1 },
            },
          }}
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
              opacity: { duration: 0.15 },
            },
          }}
          className="overflow-hidden"
        >
          <div className={cn('px-6 md:px-8 pb-8 pt-0', className)}>
            {/* Decorative line */}
            <div className="ml-[4.5rem] mb-6 h-px bg-gradient-to-r from-foreground/10 via-foreground/5 to-transparent" />
            <div className="ml-[4.75rem]">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
