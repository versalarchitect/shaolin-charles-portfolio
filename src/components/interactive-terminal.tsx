import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface TerminalLine {
  type: 'command' | 'output' | 'comment'
  content: string
  delay?: number
}

export function InteractiveTerminal() {
  const { t } = useTranslation()
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)

  // Memoize the terminal sequence to prevent infinite re-renders
  const terminalSequence = useMemo<TerminalLine[]>(
    () => [
      { type: 'comment', content: t('home.terminal.welcome') },
      { type: 'command', content: 'whoami' },
      { type: 'output', content: 'Charles Jackson' },
      { type: 'command', content: 'cat skills.json | jq ".primary"' },
      { type: 'output', content: '["React", "TypeScript", "Supabase", "Nx"]' },
      { type: 'command', content: 'echo $CURRENT_PROJECT' },
      { type: 'output', content: t('home.terminal.project') },
      { type: 'command', content: 'uptime --dev' },
      { type: 'output', content: t('home.terminal.uptime') },
      { type: 'command', content: 'cat status.txt' },
      { type: 'output', content: t('home.terminal.status') },
    ],
    [t]
  )

  // Reset terminal when language changes
  useEffect(() => {
    setLines([])
    setCurrentIndex(0)
    setCurrentText('')
    setIsTyping(false)
  }, [])

  useEffect(() => {
    if (currentIndex >= terminalSequence.length) return

    const currentLine = terminalSequence[currentIndex]

    if (currentLine.type === 'command') {
      setIsTyping(true)
      let charIndex = 0
      const text = currentLine.content

      const typeInterval = setInterval(() => {
        if (charIndex <= text.length) {
          setCurrentText(text.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
          setLines((prev) => [...prev, currentLine])
          setCurrentText('')
          setTimeout(() => setCurrentIndex((prev) => prev + 1), 200)
        }
      }, 50)

      return () => clearInterval(typeInterval)
    }
    const delay = currentLine.type === 'output' ? 100 : 300
    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, currentLine])
      setCurrentIndex((prev) => prev + 1)
    }, delay)

    return () => clearTimeout(timeout)
  }, [currentIndex, terminalSequence])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [])

  const handleRestart = () => {
    setLines([])
    setCurrentIndex(0)
    setCurrentText('')
    setIsTyping(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">charles@portfolio ~ </span>
          <button
            onClick={handleRestart}
            className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('home.terminal.restart')}
          </button>
        </div>

        {/* Terminal content */}
        <div
          ref={terminalRef}
          className="p-4 h-[300px] overflow-y-auto font-mono text-sm bg-background/50"
        >
          <AnimatePresence mode="popLayout">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`mb-1 ${
                  line.type === 'command'
                    ? 'text-foreground'
                    : line.type === 'output'
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60'
                }`}
              >
                {line.type === 'command' && <span className="text-green-500 mr-2">$</span>}
                {line.type === 'comment' && (
                  <span className="text-muted-foreground/40">{line.content}</span>
                )}
                {line.type !== 'comment' && line.content}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current typing line */}
          {isTyping && (
            <div className="text-foreground">
              <span className="text-green-500 mr-2">$</span>
              {currentText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-foreground ml-0.5 align-middle"
              />
            </div>
          )}

          {/* Idle cursor */}
          {!isTyping && currentIndex >= terminalSequence.length && (
            <div className="text-foreground">
              <span className="text-green-500 mr-2">$</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-foreground align-middle"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
