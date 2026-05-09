import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { awardExplorerXp } from '@/stores/progress'

const QUOTES = [
  'The best code is no code at all.',
  'Make it work, make it right, make it fast.',
  'Debugging is twice as hard as writing code.',
  'Context windows are the memory of your AI.',
  'A good CLAUDE.md is worth a thousand prompts.',
  'Simplicity is the ultimate sophistication.',
  'First, solve the problem. Then, write the code.',
  'Code is read more often than it is written.',
  'Premature optimization is the root of all evil.',
  'The only way to go fast is to go well.',
  'Talk is cheap. Show me the code.',
  'Programs must be written for people to read.',
  'Any sufficiently advanced prompt is indistinguishable from magic.',
  'Ship early, ship often, iterate always.',
  'Delete code before you write code.',
  'The best error message is the one that never shows up.',
  'A language that doesn\'t affect how you think isn\'t worth knowing.',
  'Every great developer you know got there by solving problems.',
]

function pickQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}

function TypingChallenge() {
  const [quote] = useState(pickQuote)
  const [revealIndex, setRevealIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Typewriter reveal
  useEffect(() => {
    if (revealIndex >= quote.length) return
    const delay = revealIndex === 0 ? 200 : 25 + Math.random() * 20
    const timer = setTimeout(() => setRevealIndex((i) => i + 1), delay)
    return () => clearTimeout(timer)
  }, [revealIndex, quote])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (completed) return
      if (e.key.length > 1 && e.key !== 'Backspace') return

      if (!isTyping) {
        setIsTyping(true)
        setStartTime(Date.now())
        // Reveal the full quote once they start typing
        setRevealIndex(quote.length)
      }

      if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1))
        return
      }

      const nextChar = quote[userInput.length]
      if (e.key === nextChar) {
        const next = userInput + e.key
        setUserInput(next)

        if (next.length === quote.length) {
          setCompleted(true)
          const elapsed = (Date.now() - (startTime ?? Date.now())) / 1000 / 60
          const words = quote.split(' ').length
          const speed = Math.round(words / Math.max(elapsed, 0.01))
          setWpm(speed)
          awardExplorerXp(2, `typing-challenge-${quote.slice(0, 30)}`)
        }
      }
    },
    [completed, isTyping, quote, userInput, startTime],
  )

  const focusInput = () => inputRef.current?.focus()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto mt-6 px-4"
    >
      {/* Prompt */}
      <p className="text-xs font-mono text-foreground/30 mb-3 text-center">
        {isTyping ? 'keep going...' : 'type along if you want'}
      </p>

      {/* Quote display */}
      <div
        onClick={focusInput}
        className="relative font-mono text-sm leading-relaxed cursor-text select-none min-h-[3rem]"
        role="button"
        tabIndex={-1}
      >
        {quote.split('').map((char, i) => {
          const isRevealed = i < revealIndex
          const isTyped = i < userInput.length
          const isCursor = i === userInput.length && isTyping

          let color = 'text-foreground/10'
          if (isTyped) color = 'text-foreground/80'
          else if (isRevealed) color = 'text-foreground/40'

          return (
            <span
              key={i}
              className={`${color} transition-colors duration-150 ${isCursor ? 'border-b border-foreground/60' : ''}`}
            >
              {isRevealed ? char : ' '}
            </span>
          )
        })}

        {/* Hidden input for mobile keyboard support */}
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 opacity-0 cursor-text"
          onKeyDown={handleKeyDown}
          value=""
          onChange={() => {}}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Type the quote"
        />
      </div>

      {/* Completion feedback */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-center gap-3 text-xs font-mono"
          >
            <span className="text-foreground/50">
              {wpm} wpm
            </span>
            <span className="text-foreground/60 px-2 py-0.5 bg-foreground/[0.05] rounded border border-foreground/10">
              +2 XP
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PageLoading() {
  const [showChallenge, setShowChallenge] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowChallenge(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="space-y-4 text-center w-full">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading...</p>

        <AnimatePresence>
          {showChallenge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TypingChallenge />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
