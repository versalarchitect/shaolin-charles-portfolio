import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  Bot,
  X,
  Send,
  Loader2,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  ChevronRight,
  GraduationCap,
  MessageSquareText,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  initAssistant,
  askAssistant,
  isAssistantReady,
  isAssistantLoading,
  type AssistantMessage,
  type ProgressStage,
} from '@/lib/student-assistant-engine'
import { ALL_LESSONS } from '@/data/curriculum'

// ============================================================================
// Block parsing — turns model output into renderable blocks
// ============================================================================

type MessageBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'quiz'; question: string; options: string[]; correct: number; explanation: string }
  | { type: 'code-challenge'; instruction: string; answer: string; hint?: string }

function parseBlocks(text: string): MessageBlock[] {
  const blocks: MessageBlock[] = []
  let remaining = text

  while (remaining.length > 0) {
    // Check for :::quiz block
    const quizStart = remaining.indexOf(':::quiz')
    const codeStart = remaining.indexOf(':::code-challenge')
    const fenceStart = remaining.indexOf('```')

    const candidates = [
      quizStart >= 0 ? { idx: quizStart, type: 'quiz' as const } : null,
      codeStart >= 0 ? { idx: codeStart, type: 'code-challenge' as const } : null,
      fenceStart >= 0 ? { idx: fenceStart, type: 'fence' as const } : null,
    ].filter(Boolean) as { idx: number; type: string }[]

    if (candidates.length === 0) {
      const trimmed = remaining.trim()
      if (trimmed) blocks.push({ type: 'text', content: trimmed })
      break
    }

    candidates.sort((a, b) => a.idx - b.idx)
    const first = candidates[0]

    // Text before the block
    const before = remaining.slice(0, first.idx).trim()
    if (before) blocks.push({ type: 'text', content: before })

    if (first.type === 'quiz') {
      const end = remaining.indexOf(':::', first.idx + 7)
      if (end === -1) {
        blocks.push({ type: 'text', content: remaining.slice(first.idx).trim() })
        break
      }
      const body = remaining.slice(first.idx + 7, end).trim()
      const quiz = parseQuizBlock(body)
      if (quiz) blocks.push(quiz)
      else blocks.push({ type: 'text', content: body })
      remaining = remaining.slice(end + 3)
    } else if (first.type === 'code-challenge') {
      const end = remaining.indexOf(':::', first.idx + 17)
      if (end === -1) {
        blocks.push({ type: 'text', content: remaining.slice(first.idx).trim() })
        break
      }
      const body = remaining.slice(first.idx + 17, end).trim()
      const challenge = parseCodeChallengeBlock(body)
      if (challenge) blocks.push(challenge)
      else blocks.push({ type: 'text', content: body })
      remaining = remaining.slice(end + 3)
    } else {
      // Fenced code block
      const langEnd = remaining.indexOf('\n', first.idx)
      const lang = remaining.slice(first.idx + 3, langEnd).trim() || 'text'
      const closeIdx = remaining.indexOf('```', langEnd + 1)
      if (closeIdx === -1) {
        blocks.push({ type: 'text', content: remaining.slice(first.idx).trim() })
        break
      }
      const code = remaining.slice(langEnd + 1, closeIdx).trim()
      blocks.push({ type: 'code', language: lang, code })
      remaining = remaining.slice(closeIdx + 3)
    }
  }

  return blocks.length > 0 ? blocks : [{ type: 'text', content: text }]
}

function parseQuizBlock(body: string): MessageBlock | null {
  try {
    const qMatch = body.match(/question:\s*(.+)/i)
    const oMatch = body.match(/options:\s*\[([^\]]+)\]/i)
    const cMatch = body.match(/correct:\s*(\d+)/i)
    const eMatch = body.match(/explanation:\s*(.+)/i)
    if (!qMatch || !oMatch || !cMatch) return null

    const options = oMatch[1].split(/",\s*"/).map((o) => o.replace(/^["']|["']$/g, '').trim())
    return {
      type: 'quiz',
      question: qMatch[1].trim(),
      options,
      correct: parseInt(cMatch[1]),
      explanation: eMatch?.[1]?.trim() ?? '',
    }
  } catch {
    return null
  }
}

function parseCodeChallengeBlock(body: string): MessageBlock | null {
  try {
    const iMatch = body.match(/instruction:\s*(.+)/i)
    const aMatch = body.match(/answer:\s*(.+)/i)
    const hMatch = body.match(/hint:\s*(.+)/i)
    if (!iMatch || !aMatch) return null

    return {
      type: 'code-challenge',
      instruction: iMatch[1].trim(),
      answer: aMatch[1].trim(),
      hint: hMatch?.[1]?.trim(),
    }
  } catch {
    return null
  }
}

// ============================================================================
// Inline interactive components for chat messages
// ============================================================================

function InlineQuiz({ block }: { block: Extract<MessageBlock, { type: 'quiz' }> }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = submitted && selected === block.correct

  return (
    <div className="space-y-3 my-2">
      <p className="text-sm font-medium text-foreground/90">{block.question}</p>
      <div className="space-y-1.5">
        {block.options.map((option, i) => {
          const isSelected = selected === i
          const isRight = submitted && i === block.correct
          const isWrong = submitted && isSelected && i !== block.correct
          return (
            <button
              key={i}
              type="button"
              onClick={() => !submitted && setSelected(i)}
              className={`
                w-full text-left px-3 py-2 rounded-lg border text-xs transition-all
                ${isRight
                  ? 'border-green-500/40 bg-green-500/10 text-foreground'
                  : isWrong
                    ? 'border-red-500/40 bg-red-500/10 text-foreground/70'
                    : isSelected
                      ? 'border-foreground/25 bg-foreground/[0.06] text-foreground'
                      : 'border-foreground/[0.08] bg-foreground/[0.02] text-foreground/70 hover:border-foreground/15'
                }
              `}
            >
              <span className="font-mono text-foreground/40 mr-2">{String.fromCharCode(65 + i)}</span>
              {option}
              {isRight && <Check className="w-3 h-3 inline ml-1 text-green-400" />}
            </button>
          )
        })}
      </div>
      {!submitted && selected !== null && (
        <Button
          size="sm"
          onClick={() => setSubmitted(true)}
          className="font-mono text-xs h-7 px-3"
        >
          Check <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs px-3 py-2 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-300/80' : 'bg-red-500/10 text-red-300/80'}`}
        >
          {isCorrect ? '' : 'Not quite. '}{block.explanation}
        </motion.div>
      )}
      {submitted && !isCorrect && (
        <button
          type="button"
          onClick={() => { setSelected(null); setSubmitted(false) }}
          className="text-[10px] font-mono text-foreground/40 hover:text-foreground/60 flex items-center gap-1"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Try again
        </button>
      )}
    </div>
  )
}

function InlineCodeChallenge({ block }: { block: Extract<MessageBlock, { type: 'code-challenge' }> }) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = () => {
    const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
    if (normalize(input) === normalize(block.answer)) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 600)
    }
  }

  return (
    <div className="space-y-2 my-2">
      <p className="text-xs text-foreground/80">{block.instruction}</p>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className={`
            flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-md px-2.5 py-1.5 font-mono text-xs outline-none transition-colors
            ${status === 'correct' ? 'text-green-400 border-green-500/30' : status === 'wrong' ? 'text-red-400 border-red-500/30' : 'text-foreground/80 focus:border-foreground/20'}
          `}
          placeholder="Type your answer..."
          spellCheck={false}
        />
        {status === 'correct' ? (
          <Check className="w-4 h-4 text-green-400 shrink-0" />
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={!input.trim()} className="h-7 px-2 text-xs font-mono">
            Run
          </Button>
        )}
      </div>
      {block.hint && (
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-[10px] text-foreground/40 hover:text-foreground/60 flex items-center gap-1"
        >
          <Lightbulb className="w-2.5 h-2.5" />
          {showHint ? block.hint : 'Show hint'}
        </button>
      )}
    </div>
  )
}

function InlineCode({ block }: { block: Extract<MessageBlock, { type: 'code' }> }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative my-2 rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] overflow-hidden group">
      <div className="flex items-center justify-between px-3 py-1 border-b border-foreground/[0.06]">
        <span className="text-[9px] font-mono text-foreground/30">{block.language}</span>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(block.code); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
          className="p-1 rounded text-foreground/20 hover:text-foreground/50 opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <pre className="px-3 py-2 overflow-x-auto text-xs font-mono text-foreground/70 leading-relaxed">
        <code>{block.code}</code>
      </pre>
    </div>
  )
}

// ============================================================================
// Message rendering
// ============================================================================

function RenderBlocks({ blocks }: { blocks: MessageBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/80">
                {block.content.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j} className="font-semibold text-foreground/90">{part}</strong> : part
                )}
              </p>
            )
          case 'code':
            return <InlineCode key={i} block={block} />
          case 'quiz':
            return <InlineQuiz key={i} block={block} />
          case 'code-challenge':
            return <InlineCodeChallenge key={i} block={block} />
        }
      })}
    </>
  )
}

// ============================================================================
// Main component
// ============================================================================

interface Message {
  role: 'user' | 'assistant'
  content: string
  blocks?: MessageBlock[]
  streaming?: boolean
  timestamp: number
}

const STORAGE_KEY = 'student-assistant-messages'
const SUGGESTIONS = [
  'Explain this lesson to me',
  'Quiz me on this topic',
  'What tools will I use here?',
]

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const msgs = JSON.parse(raw) as Message[]
      if (Date.now() - (msgs[msgs.length - 1]?.timestamp ?? 0) < 60 * 60 * 1000) {
        return msgs.map((m) => ({
          ...m,
          blocks: m.role === 'assistant' ? parseBlocks(m.content) : undefined,
        }))
      }
    }
  } catch { /* ignore */ }
  return []
}

function saveMessages(msgs: Message[]) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(msgs.map(({ blocks, streaming, ...m }) => m)),
    )
  } catch { /* ignore */ }
}

export function StudentAssistant() {
  const location = useLocation()
  const lessonMatch = location.pathname.match(/^\/learn\/(.+)$/)
  const currentLessonId = lessonMatch?.[1]
  const currentLesson = currentLessonId
    ? ALL_LESSONS.find((l) => l.id === currentLessonId)
    : null

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [progressStage, setProgressStage] = useState<ProgressStage | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages)
  }, [messages])

  // Load model when panel opens
  useEffect(() => {
    if (!isOpen || modelReady || modelLoading) return

    if (isAssistantReady()) {
      setModelReady(true)
      const restored = loadMessages()
      if (restored.length > 0) setMessages(restored)
      else addWelcome()
      return
    }
    if (isAssistantLoading()) return

    setModelLoading(true)
    setError(null)

    initAssistant((stage, percent) => {
      setProgressStage(stage)
      setProgressPercent(percent)
    })
      .then(() => {
        setModelReady(true)
        setModelLoading(false)
        const restored = loadMessages()
        if (restored.length > 0) setMessages(restored)
        else addWelcome()
      })
      .catch((err) => {
        setModelLoading(false)
        setError(err?.message ?? 'Failed to load AI model. Try refreshing.')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  function addWelcome() {
    const content = currentLesson
      ? `Hey! I'm your course tutor. You're on **Lesson ${currentLesson.number} — ${currentLesson.title}**. Ask me anything about it, or say "quiz me" for practice.`
      : "Hey! I'm your course tutor. Ask me anything about the curriculum, lessons, or say \"quiz me\" for practice."
    setMessages([{
      role: 'assistant',
      content,
      blocks: parseBlocks(content),
      timestamp: Date.now(),
    }])
  }

  const handleSend = useCallback(async (text?: string) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || sending || !modelReady) return

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    const streamingMsg: Message = {
      role: 'assistant',
      content: '',
      blocks: [],
      streaming: true,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, streamingMsg])

    try {
      const history: AssistantMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))
      history.push({ role: 'user', content: trimmed })

      let accumulated = ''
      const response = await askAssistant(
        trimmed,
        history.slice(0, -1),
        currentLessonId,
        (token) => {
          accumulated += token
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last?.streaming) {
              updated[updated.length - 1] = {
                ...last,
                content: accumulated,
                blocks: parseBlocks(accumulated),
              }
            }
            return updated
          })
        },
      )

      const finalContent = accumulated || response
      const finalBlocks = parseBlocks(finalContent)

      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.streaming) {
          updated[updated.length - 1] = {
            ...last,
            content: finalContent,
            blocks: finalBlocks,
            streaming: false,
          }
        }
        return updated
      })
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.streaming) {
          const errContent = 'Something went wrong. Try asking again.'
          updated[updated.length - 1] = {
            ...last,
            content: errContent,
            blocks: [{ type: 'text', content: errContent }],
            streaming: false,
          }
        }
        return updated
      })
    } finally {
      setSending(false)
    }
  }, [input, sending, modelReady, messages, currentLessonId])

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    addWelcome()
  }

  const stageName = (s: ProgressStage | null) => {
    switch (s) {
      case 'embedding-model': return 'Loading search model'
      case 'generation-model': return 'Loading AI model'
      case 'indexing': return 'Indexing curriculum'
      default: return 'Initializing'
    }
  }

  const totalProgress = (() => {
    if (!progressStage) return 0
    const weights: Record<ProgressStage, [number, number]> = {
      'embedding-model': [0, 20],
      'generation-model': [20, 80],
      'indexing': [80, 100],
    }
    const [base, max] = weights[progressStage]
    return base + (progressPercent / 100) * (max - base)
  })()

  const showSuggestions = modelReady && messages.length <= 2 && !sending

  return (
    <>
      {/* Toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:scale-105 active:scale-95 transition-transform"
              aria-label="Open course tutor"
            >
              <GraduationCap className="w-6 h-6" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-foreground/20"
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 right-0 z-50 w-full sm:w-[440px] sm:max-w-[calc(100vw-3rem)] h-[100dvh] sm:h-[calc(100vh-3rem)] sm:bottom-6 sm:right-6 sm:rounded-2xl border-0 sm:border border-foreground/15 bg-background/98 sm:bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/10">
                  <Sparkles className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Course Tutor</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {modelReady
                      ? currentLesson
                        ? `Lesson ${currentLesson.number}`
                        : 'AI-powered · Private'
                      : modelLoading
                        ? stageName(progressStage)
                        : error
                          ? 'Error'
                          : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {modelReady && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                    aria-label="New conversation"
                    title="New conversation"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading progress */}
            {modelLoading && !modelReady && (
              <div className="px-5 py-3 border-b border-foreground/5">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {stageName(progressStage)} ({Math.round(totalProgress)}%)
                  </span>
                </div>
                <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground/30 rounded-full"
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground/40 mt-2 font-mono">
                  First load downloads ~400 MB · Cached after
                </p>
              </div>
            )}

            {/* Error state */}
            {error && !modelLoading && !modelReady && (
              <div className="px-5 py-4 border-b border-red-500/10">
                <p className="text-xs text-red-400/80 mb-2">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-mono h-7"
                  onClick={() => {
                    setError(null)
                    setModelLoading(true)
                    initAssistant((stage, percent) => {
                      setProgressStage(stage)
                      setProgressPercent(percent)
                    })
                      .then(() => {
                        setModelReady(true)
                        setModelLoading(false)
                        addWelcome()
                      })
                      .catch((err) => {
                        setModelLoading(false)
                        setError(err?.message ?? 'Failed to load.')
                      })
                  }}
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> Retry
                </Button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.timestamp}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 ${
                    msg.role === 'assistant' ? 'bg-foreground/10' : 'bg-foreground/5'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <Bot className="w-3.5 h-3.5 text-foreground/60" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-foreground/60" />
                    )}
                  </div>
                  <div className="max-w-[85%] space-y-1">
                    {msg.role === 'user' ? (
                      <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-foreground text-background">
                        {msg.content}
                      </div>
                    ) : msg.blocks && msg.blocks.length > 0 ? (
                      <div className="rounded-xl px-3.5 py-2.5 bg-foreground/[0.06] space-y-2">
                        <RenderBlocks blocks={msg.blocks} />
                        {msg.streaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                            className="inline-block w-0.5 h-[1em] bg-foreground/50 ml-0.5 align-middle"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-foreground/[0.06] text-foreground/80">
                        {msg.content}
                        {msg.streaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.4, repeat: Infinity }}
                            className="inline-block w-0.5 h-[1em] bg-foreground/50 ml-0.5 align-middle"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator when waiting (before first token) */}
              {sending && messages[messages.length - 1]?.streaming && messages[messages.length - 1]?.content === '' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-foreground/10">
                    <Bot className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                  <div className="bg-foreground/[0.06] rounded-xl px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((j) => (
                        <motion.div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full bg-foreground/30"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] text-foreground/60 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.06] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-foreground/10 bg-background/50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSend('Quiz me on the current topic')}
                  disabled={!modelReady || sending}
                  className="p-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.03] text-foreground/40 hover:text-foreground/70 hover:border-foreground/20 hover:bg-foreground/[0.06] disabled:opacity-30 transition-all shrink-0"
                  title="Practice mode"
                  aria-label="Practice mode"
                >
                  <MessageSquareText className="w-4 h-4" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder={modelReady ? 'Ask anything about the course...' : 'Loading AI...'}
                  disabled={!modelReady || sending}
                  className="flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 disabled:opacity-50 transition-colors"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || !modelReady || sending}
                  className="h-10 w-10 rounded-lg shrink-0"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground/40 text-center mt-2 font-mono">
                Runs locally · No data sent to servers
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
