import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  Copy,
  ChevronRight,
  Lightbulb,
  Terminal,
  Zap,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LessonStep, LessonContent } from '@/data/lessons/types'
import { loadLessonContent } from '@/data/lessons'

// ============================================================================
// Step components
// ============================================================================

function InfoStep({ step }: { step: Extract<LessonStep, { type: 'info' }> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
      <p className="text-foreground/70 leading-relaxed text-lg">{step.body}</p>
    </div>
  )
}

function CodeDemoStep({ step }: { step: Extract<LessonStep, { type: 'code-demo' }> }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(step.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [step.code])

  return (
    <div className="space-y-4">
      {step.title && <h2 className="text-xl font-bold tracking-tight">{step.title}</h2>}
      <p className="text-foreground/70 leading-relaxed">{step.body}</p>
      <div className="relative rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] overflow-hidden group">
        {step.filename && (
          <div className="px-4 py-2 border-b border-foreground/[0.06] text-[11px] font-mono text-foreground/40">
            {step.filename}
          </div>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 rounded-lg bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/30 hover:text-foreground/60 hover:bg-foreground/10 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
        <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground/80 leading-relaxed">
          <code>{step.code}</code>
        </pre>
      </div>
    </div>
  )
}

function TerminalStep({
  step,
  onComplete,
}: {
  step: Extract<LessonStep, { type: 'terminal' }>
  onComplete: () => void
}) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    const trimmed = input.trim()
    const expected = step.expectedCommand.trim()
    // Allow flexible matching — ignore quote style differences and exact email/name
    const normalize = (s: string) => s.replace(/["']/g, '').replace(/\s+/g, ' ').toLowerCase()
    if (normalize(trimmed).startsWith(normalize(expected).split('"')[0].split("'")[0].trim()) ||
        normalize(trimmed) === normalize(expected)) {
      setStatus('correct')
      setTimeout(onComplete, 800)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 600)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground/70 leading-relaxed text-lg">{step.instruction}</p>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-foreground/[0.06]">
          <Terminal className="w-4 h-4 text-foreground/40" />
          <span className="text-[11px] font-mono text-foreground/40">Terminal</span>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground/30 font-mono text-sm select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              className={`
                flex-1 bg-transparent font-mono text-sm outline-none
                ${status === 'correct' ? 'text-green-400' : status === 'wrong' ? 'text-red-400' : 'text-foreground/80'}
              `}
              placeholder="Type the command..."
              spellCheck={false}
              autoComplete="off"
            />
            {status === 'correct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <Check className="w-5 h-5 text-green-400" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {step.hint && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          )}
          {showHint && step.hint && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono text-foreground/40 mt-2"
            >
              {step.hint}
            </motion.p>
          )}
        </div>
        {status !== 'correct' && (
          <Button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="font-mono gap-2"
          >
            Run
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function MultipleChoiceStep({
  step,
  onComplete,
}: {
  step: Extract<LessonStep, { type: 'multiple-choice' }>
  onComplete: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = (index: number) => {
    if (submitted) return
    setSelected(index)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === step.correctIndex) {
      setTimeout(onComplete, 1200)
    }
  }

  const isCorrect = submitted && selected === step.correctIndex

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold tracking-tight">{step.question}</h2>

      <div className="space-y-2.5">
        {step.options.map((option, i) => {
          const isSelected = selected === i
          const isRight = submitted && i === step.correctIndex
          const isWrong = submitted && isSelected && i !== step.correctIndex

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              className={`
                w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium
                ${isRight
                  ? 'border-green-500/40 bg-green-500/10 text-foreground'
                  : isWrong
                    ? 'border-red-500/40 bg-red-500/10 text-foreground/70'
                    : isSelected
                      ? 'border-foreground/30 bg-foreground/[0.06] text-foreground'
                      : 'border-foreground/[0.08] bg-foreground/[0.02] text-foreground/70 hover:border-foreground/15 hover:bg-foreground/[0.04]'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-mono font-bold
                    ${isRight
                      ? 'border-green-500/60 bg-green-500/20 text-green-400'
                      : isWrong
                        ? 'border-red-500/60 bg-red-500/20 text-red-400'
                        : isSelected
                          ? 'border-foreground/30 bg-foreground/10 text-foreground/70'
                          : 'border-foreground/15 text-foreground/40'
                    }
                  `}
                >
                  {isRight ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                </div>
                <span>{option}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl px-5 py-4 ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
        >
          <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-300/80' : 'text-red-300/80'}`}>
            {isCorrect ? step.explanation : `Not quite. ${step.explanation}`}
          </p>
        </motion.div>
      )}

      {!submitted && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={selected === null}
            className="font-mono gap-2 h-12 px-6"
            size="lg"
          >
            Check
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {submitted && !isCorrect && (
        <div className="flex justify-end">
          <Button
            onClick={() => { setSelected(null); setSubmitted(false) }}
            variant="outline"
            className="font-mono gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}

function CodeInputStep({
  step,
  onComplete,
}: {
  step: Extract<LessonStep, { type: 'code-input' }>
  onComplete: () => void
}) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = () => {
    const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
    if (normalize(input) === normalize(step.answer)) {
      setStatus('correct')
      setTimeout(onComplete, 800)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 600)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground/70 leading-relaxed text-lg">{step.instruction}</p>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] p-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
          placeholder={step.placeholder}
          className={`
            w-full bg-transparent font-mono text-sm outline-none
            ${status === 'correct' ? 'text-green-400' : status === 'wrong' ? 'text-red-400' : 'text-foreground/80'}
          `}
          spellCheck={false}
        />
      </div>
      <div className="flex items-center justify-between">
        {step.hint ? (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? step.hint : 'Show hint'}
          </button>
        ) : <div />}
        {status !== 'correct' && (
          <Button onClick={handleSubmit} disabled={!input.trim()} className="font-mono gap-2">
            Check <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function OrderStep({
  step,
  onComplete,
}: {
  step: Extract<LessonStep, { type: 'order' }>
  onComplete: () => void
}) {
  const shuffled = useMemo(() => {
    const indices = step.items.map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    // Don't return if already in correct order
    if (indices.every((v, i) => v === step.correctOrder[i])) {
      [indices[0], indices[1]] = [indices[1], indices[0]]
    }
    return indices
  }, [step.items, step.correctOrder])

  const [order, setOrder] = useState(shuffled)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const moveItem = (from: number, to: number) => {
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
    setStatus('idle')
  }

  const handleCheck = () => {
    if (order.every((v, i) => v === step.correctOrder[i])) {
      setStatus('correct')
      setTimeout(onComplete, 800)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 800)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground/70 leading-relaxed text-lg">{step.instruction}</p>
      <div className="space-y-2">
        {order.map((itemIndex, position) => (
          <motion.div
            key={itemIndex}
            layout
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors
              ${status === 'correct'
                ? 'border-green-500/30 bg-green-500/5'
                : status === 'wrong'
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-foreground/[0.08] bg-foreground/[0.02]'
              }
            `}
          >
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => position > 0 && moveItem(position, position - 1)}
                disabled={position === 0}
                className="p-1 text-foreground/30 hover:text-foreground/60 disabled:opacity-20 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2 L10 8 L2 8 Z" fill="currentColor" /></svg>
              </button>
              <button
                type="button"
                onClick={() => position < order.length - 1 && moveItem(position, position + 1)}
                disabled={position === order.length - 1}
                className="p-1 text-foreground/30 hover:text-foreground/60 disabled:opacity-20 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 10 L10 4 L2 4 Z" fill="currentColor" /></svg>
              </button>
            </div>
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-xs font-mono text-foreground/50 shrink-0">
              {position + 1}
            </span>
            <span className="text-sm text-foreground/80">{step.items[itemIndex]}</span>
          </motion.div>
        ))}
      </div>
      {status !== 'correct' && (
        <div className="flex justify-end">
          <Button onClick={handleCheck} className="font-mono gap-2 h-12 px-6" size="lg">
            Check Order <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ChecklistStep({
  step,
  onComplete,
}: {
  step: Extract<LessonStep, { type: 'checklist' }>
  onComplete: () => void
}) {
  const [checked, setChecked] = useState<boolean[]>(() => step.items.map(() => false))
  const allChecked = checked.every(Boolean)

  useEffect(() => {
    if (allChecked) {
      const timer = setTimeout(onComplete, 600)
      return () => clearTimeout(timer)
    }
  }, [allChecked, onComplete])

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{step.title}</h2>
      <div className="space-y-2">
        {step.items.map((item, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all
              ${checked[i]
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-foreground/[0.08] bg-foreground/[0.02] hover:border-foreground/15'
              }
            `}
          >
            <div
              className={`
                w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all
                ${checked[i]
                  ? 'bg-green-500/20 border-green-500/40'
                  : 'border-foreground/20'
                }
              `}
            >
              {checked[i] && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                </motion.div>
              )}
            </div>
            <span className={`text-sm transition-colors ${checked[i] ? 'text-foreground/50 line-through' : 'text-foreground/80'}`}>
              {item}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function CheckpointStep({ step }: { step: Extract<LessonStep, { type: 'checkpoint' }> }) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="w-16 h-16 rounded-2xl bg-foreground/10 border border-foreground/15 flex items-center justify-center mb-4"
      >
        <Zap className="w-7 h-7 text-foreground/70" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold mb-2"
      >
        {step.message}
      </motion.p>
      {step.xp > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground/[0.06] border border-foreground/10"
        >
          <Zap className="w-4 h-4 text-foreground/60" />
          <span className="font-mono font-bold text-foreground/80">+{step.xp} XP</span>
        </motion.div>
      )}
    </div>
  )
}

// ============================================================================
// Step renderer
// ============================================================================

function StepRenderer({
  step,
  onComplete,
}: {
  step: LessonStep
  onComplete: () => void
}) {
  switch (step.type) {
    case 'info':
      return <InfoStep step={step} />
    case 'code-demo':
      return <CodeDemoStep step={step} />
    case 'terminal':
      return <TerminalStep step={step} onComplete={onComplete} />
    case 'multiple-choice':
      return <MultipleChoiceStep step={step} onComplete={onComplete} />
    case 'code-input':
      return <CodeInputStep step={step} onComplete={onComplete} />
    case 'order':
      return <OrderStep step={step} onComplete={onComplete} />
    case 'checklist':
      return <ChecklistStep step={step} onComplete={onComplete} />
    case 'checkpoint':
      return <CheckpointStep step={step} />
    default:
      return null
  }
}

// ============================================================================
// Main player
// ============================================================================

const PASSIVE_STEPS = new Set(['info', 'code-demo', 'checkpoint'])

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const [content, setContent] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    setLoading(true)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    loadLessonContent(lessonId).then((data) => {
      setContent(data)
      setLoading(false)
    })
  }, [lessonId])

  const totalSteps = content?.steps.length ?? 0
  const step = content?.steps[currentStep]
  const isPassive = step ? PASSIVE_STEPS.has(step.type) : false
  const isStepCompleted = completedSteps.has(currentStep)
  const isLastStep = currentStep === totalSteps - 1
  const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0

  const handleStepComplete = useCallback(() => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep))
  }, [currentStep])

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCompletedSteps((prev) => new Set(prev).add(currentStep))
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, totalSteps])

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goPrev])

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-mono text-foreground/40">Loading...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-foreground/5 border border-foreground/10 mb-4">
          <Zap className="w-5 h-5 text-foreground/40" />
        </div>
        <p className="text-sm font-mono text-foreground/40">Lesson content coming soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-foreground/40">
          <span>{currentStep + 1} / {totalSteps}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="relative h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/25"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        {/* Step dots */}
        <div className="flex gap-[2px]">
          {content.steps.map((s, i) => (
            <div
              key={i}
              className={`
                flex-1 h-1 rounded-full transition-colors
                ${i < currentStep
                  ? 'bg-foreground/25'
                  : i === currentStep
                    ? 'bg-foreground/40'
                    : 'bg-foreground/[0.06]'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="min-h-[300px] flex flex-col justify-center"
        >
          {step && <StepRenderer step={step} onComplete={handleStepComplete} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-foreground/[0.06]">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStep === 0}
          className="text-sm font-mono text-foreground/40 hover:text-foreground/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          Back
        </button>

        {(isPassive || isStepCompleted) && !isLastStep && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Button
              onClick={goNext}
              size="lg"
              className="font-mono gap-2 h-12 px-8 text-base group"
            >
              Continue
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </motion.div>
        )}

        {isLastStep && (isPassive || isStepCompleted) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm font-mono text-foreground/50"
          >
            <Check className="w-4 h-4" />
            Lesson complete — mark it above
          </motion.div>
        )}
      </div>
    </div>
  )
}
