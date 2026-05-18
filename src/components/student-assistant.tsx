import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  Dumbbell,
  Cpu,
  Zap,
  Terminal,
  ArrowRight,
} from 'lucide-react'
import { Button } from './ui/button'
import {
  initAssistant,
  askAssistant,
  isAssistantReady,
  isAssistantLoading,
  getDeviceType,
  getKnowledgeBaseSize,
  getPracticeExercise,
  getPracticeCount,
  type AssistantMessage,
  type ProgressStage,
  type PracticeExercise,
} from '@/lib/student-assistant-engine'
import { ALL_LESSONS } from '@/data/curriculum'
import type { LessonStep } from '@/data/lessons/types'

// ============================================================================
// Bilingual strings (EN / FR)
// ============================================================================

function useLang(): 'en' | 'fr' {
  const { i18n } = useTranslation()
  return i18n.language?.startsWith('fr') ? 'fr' : 'en'
}

const S = {
  en: {
    title: 'Course Tutor',
    open: 'Open course tutor',
    newConv: 'New conversation',
    clear: 'Clear',
    offline: 'Offline',
    error: 'Error',
    stageEmbed: 'Loading search model',
    stageGen: 'Loading AI model',
    stageIndex: 'Indexing course content',
    stageInit: 'Initializing',
    loadNote: 'First load downloads ~400 MB · Cached after · All processing local',
    footer: 'Runs locally · No data sent to servers',
    placeholder: 'Ask anything about the course...',
    placeholderLoading: 'Loading AI...',
    practice: 'Practice mode',
    errMsg: 'Something went wrong. Try asking again.',
    retry: 'Retry',
    check: 'Check',
    run: 'Run',
    tryAgain: 'Try again',
    hint: 'Show hint',
    checkOrder: 'Check order',
    nextEx: 'Next exercise',
    terminal: 'Terminal',
    typeCmd: 'Type the command...',
    typeAns: 'Type your answer...',
    notQuite: 'Not quite. ',
    accel: 'accelerated',
    suggestions: ['What will I learn?', 'Quiz me', 'Explain multi-agent orchestration'],
    sugLesson: (n: string) => [`What is Lesson ${n} about?`, 'Quiz me', 'What tools do I need?'],
    welLesson: (n: string, t: string, kb: number, p: number) =>
      `Ready — **Lesson ${n}: ${t}**. I have ${kb} knowledge chunks indexed and ${p} practice exercises for this area.`,
    welGeneral: (kb: number) =>
      `Ready — ${kb} knowledge chunks indexed across all 51 lessons. Ask me anything about the curriculum or say "quiz me" for practice.`,
    welDevice: (d: string) =>
      `\n\nRunning on **${d}** — all processing happens locally in your browser.`,
  },
  fr: {
    title: 'Tuteur IA',
    open: 'Ouvrir le tuteur IA',
    newConv: 'Nouvelle conversation',
    clear: 'Effacer',
    offline: 'Hors ligne',
    error: 'Erreur',
    stageEmbed: 'Chargement du modèle de recherche',
    stageGen: 'Chargement du modèle IA',
    stageIndex: 'Indexation du contenu du cours',
    stageInit: 'Initialisation',
    loadNote: 'Premier chargement ~400 Mo · En cache ensuite · Traitement local',
    footer: 'Exécution locale · Aucune donnée envoyée',
    placeholder: 'Posez une question sur le cours...',
    placeholderLoading: "Chargement de l'IA...",
    practice: 'Mode pratique',
    errMsg: 'Une erreur est survenue. Réessayez.',
    retry: 'Réessayer',
    check: 'Vérifier',
    run: 'Exécuter',
    tryAgain: 'Réessayer',
    hint: "Voir l'indice",
    checkOrder: "Vérifier l'ordre",
    nextEx: 'Exercice suivant',
    terminal: 'Terminal',
    typeCmd: 'Tapez la commande...',
    typeAns: 'Tapez votre réponse...',
    notQuite: 'Pas tout à fait. ',
    accel: 'accéléré',
    suggestions: ["Qu'est-ce que je vais apprendre ?", 'Testez-moi', "Expliquez l'orchestration multi-agents"],
    sugLesson: (n: string) => [`De quoi parle la leçon ${n} ?`, 'Testez-moi', 'Quels outils ai-je besoin ?'],
    welLesson: (n: string, t: string, kb: number, p: number) =>
      `Prêt — **Leçon ${n} : ${t}**. ${kb} blocs de connaissances indexés et ${p} exercices pratiques pour cette section.`,
    welGeneral: (kb: number) =>
      `Prêt — ${kb} blocs de connaissances indexés sur les 51 leçons. Posez-moi une question ou dites « testez-moi » pour pratiquer.`,
    welDevice: (d: string) =>
      `\n\nFonctionne sur **${d}** — tout le traitement se fait localement dans votre navigateur.`,
  },
} as const

// ============================================================================
// Block parsing — model output → renderable blocks
// ============================================================================

type MessageBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'quiz'; question: string; options: string[]; correct: number; explanation: string }
  | { type: 'code-challenge'; instruction: string; answer: string; hint?: string }
  | { type: 'terminal-exercise'; instruction: string; command: string; hint?: string }
  | { type: 'practice'; exercise: PracticeExercise }

function parseBlocks(text: string): MessageBlock[] {
  const blocks: MessageBlock[] = []
  let remaining = text

  while (remaining.length > 0) {
    const candidates = [
      { idx: remaining.indexOf(':::quiz'), len: 7, type: 'quiz' as const },
      { idx: remaining.indexOf(':::code-challenge'), len: 17, type: 'code-challenge' as const },
      { idx: remaining.indexOf(':::terminal'), len: 11, type: 'terminal' as const },
      { idx: remaining.indexOf('```'), len: 3, type: 'fence' as const },
    ].filter((c) => c.idx >= 0)

    if (candidates.length === 0) {
      const trimmed = remaining.trim()
      if (trimmed) blocks.push({ type: 'text', content: trimmed })
      break
    }

    candidates.sort((a, b) => a.idx - b.idx)
    const first = candidates[0]

    const before = remaining.slice(0, first.idx).trim()
    if (before) blocks.push({ type: 'text', content: before })

    if (first.type === 'fence') {
      const langEnd = remaining.indexOf('\n', first.idx)
      const lang = remaining.slice(first.idx + 3, langEnd).trim() || 'text'
      const closeIdx = remaining.indexOf('```', langEnd + 1)
      if (closeIdx === -1) {
        blocks.push({ type: 'text', content: remaining.slice(first.idx).trim() })
        break
      }
      blocks.push({ type: 'code', language: lang, code: remaining.slice(langEnd + 1, closeIdx).trim() })
      remaining = remaining.slice(closeIdx + 3)
      continue
    }

    const end = remaining.indexOf(':::', first.idx + first.len)
    if (end === -1) {
      blocks.push({ type: 'text', content: remaining.slice(first.idx).trim() })
      break
    }

    const body = remaining.slice(first.idx + first.len, end).trim()
    remaining = remaining.slice(end + 3)

    if (first.type === 'quiz') {
      const parsed = parseQuizBody(body)
      if (parsed) { blocks.push(parsed); continue }
    } else if (first.type === 'code-challenge') {
      const parsed = parseCodeChallengeBody(body)
      if (parsed) { blocks.push(parsed); continue }
    } else if (first.type === 'terminal') {
      const parsed = parseTerminalBody(body)
      if (parsed) { blocks.push(parsed); continue }
    }
    blocks.push({ type: 'text', content: body })
  }

  return blocks.length > 0 ? blocks : [{ type: 'text', content: text }]
}

function parseQuizBody(body: string): MessageBlock | null {
  const q = body.match(/question:\s*(.+)/i)
  const o = body.match(/options:\s*\[([^\]]+)\]/i)
  const c = body.match(/correct:\s*(\d+)/i)
  const e = body.match(/explanation:\s*(.+)/i)
  if (!q || !o || !c) return null
  return {
    type: 'quiz',
    question: q[1].trim(),
    options: o[1].split(/",\s*"/).map((s) => s.replace(/^["']|["']$/g, '').trim()),
    correct: parseInt(c[1]),
    explanation: e?.[1]?.trim() ?? '',
  }
}

function parseCodeChallengeBody(body: string): MessageBlock | null {
  const i = body.match(/instruction:\s*(.+)/i)
  const a = body.match(/answer:\s*(.+)/i)
  const h = body.match(/hint:\s*(.+)/i)
  if (!i || !a) return null
  return { type: 'code-challenge', instruction: i[1].trim(), answer: a[1].trim(), hint: h?.[1]?.trim() }
}

function parseTerminalBody(body: string): MessageBlock | null {
  const i = body.match(/instruction:\s*(.+)/i)
  const c = body.match(/command:\s*(.+)/i)
  const h = body.match(/hint:\s*(.+)/i)
  if (!i || !c) return null
  return { type: 'terminal-exercise', instruction: i[1].trim(), command: c[1].trim(), hint: h?.[1]?.trim() }
}

// ============================================================================
// Inline interactive components
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
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                isRight ? 'border-green-500/40 bg-green-500/10 text-foreground'
                : isWrong ? 'border-red-500/40 bg-red-500/10 text-foreground/70'
                : isSelected ? 'border-foreground/25 bg-foreground/[0.06] text-foreground'
                : 'border-foreground/[0.08] bg-foreground/[0.02] text-foreground/70 hover:border-foreground/15'
              }`}
            >
              <span className="font-mono text-foreground/40 mr-2">{String.fromCharCode(65 + i)}</span>
              {option}
              {isRight && <Check className="w-3 h-3 inline ml-1 text-green-400" />}
            </button>
          )
        })}
      </div>
      {!submitted && selected !== null && (
        <Button size="sm" onClick={() => setSubmitted(true)} className="font-mono text-xs h-7 px-3">
          {S[useLang()].check} <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs px-3 py-2 rounded-lg ${isCorrect ? 'bg-green-500/10 text-green-300/80' : 'bg-red-500/10 text-red-300/80'}`}
        >
          {isCorrect ? '' : S[useLang()].notQuite}{block.explanation}
        </motion.div>
      )}
      {submitted && !isCorrect && (
        <button type="button" onClick={() => { setSelected(null); setSubmitted(false) }} className="text-[10px] font-mono text-foreground/40 hover:text-foreground/60 flex items-center gap-1">
          <RotateCcw className="w-2.5 h-2.5" /> {S[useLang()].tryAgain}
        </button>
      )}
    </div>
  )
}

function InlineTerminal({ block }: { block: Extract<MessageBlock, { type: 'terminal-exercise' }> }) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = () => {
    const normalize = (s: string) => s.replace(/["']/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
    const base = normalize(block.command).split('"')[0].split("'")[0].trim()
    if (normalize(input).startsWith(base) || normalize(input) === normalize(block.command)) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 600)
    }
  }

  return (
    <div className="space-y-2 my-2">
      <p className="text-xs text-foreground/80">{block.instruction}</p>
      <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1 border-b border-foreground/[0.06]">
          <Terminal className="w-3 h-3 text-foreground/30" />
          <span className="text-[9px] font-mono text-foreground/30">{S[useLang()].terminal}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-foreground/30 font-mono text-xs select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setStatus('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className={`flex-1 bg-transparent font-mono text-xs outline-none ${
              status === 'correct' ? 'text-green-400' : status === 'wrong' ? 'text-red-400' : 'text-foreground/80'
            }`}
            placeholder={S[useLang()].typeCmd}
            spellCheck={false}
          />
          {status === 'correct' ? (
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
          ) : (
            <Button size="sm" onClick={handleSubmit} disabled={!input.trim()} className="h-6 px-2 text-[10px] font-mono">
              {S[useLang()].run}
            </Button>
          )}
        </div>
      </div>
      {block.hint && (
        <button type="button" onClick={() => setShowHint(!showHint)} className="text-[10px] text-foreground/40 hover:text-foreground/60 flex items-center gap-1">
          <Lightbulb className="w-2.5 h-2.5" />
          {showHint ? block.hint : S[useLang()].hint}
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
          className={`flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-md px-2.5 py-1.5 font-mono text-xs outline-none transition-colors ${
            status === 'correct' ? 'text-green-400 border-green-500/30'
            : status === 'wrong' ? 'text-red-400 border-red-500/30'
            : 'text-foreground/80 focus:border-foreground/20'
          }`}
          placeholder={S[useLang()].typeAns}
          spellCheck={false}
        />
        {status === 'correct' ? (
          <Check className="w-4 h-4 text-green-400 shrink-0" />
        ) : (
          <Button size="sm" onClick={handleSubmit} disabled={!input.trim()} className="h-7 px-2 text-xs font-mono">
            {S[useLang()].check}
          </Button>
        )}
      </div>
      {block.hint && (
        <button type="button" onClick={() => setShowHint(!showHint)} className="text-[10px] text-foreground/40 hover:text-foreground/60 flex items-center gap-1">
          <Lightbulb className="w-2.5 h-2.5" />
          {showHint ? block.hint : S[useLang()].hint}
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
// Practice exercise renderer — renders actual LessonStep types from bank
// ============================================================================

function PracticeExerciseRenderer({ exercise, onNext }: { exercise: PracticeExercise; onNext: () => void }) {
  const step = exercise.step

  return (
    <div className="space-y-3 my-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono px-2 py-0.5 bg-foreground/[0.06] rounded text-foreground/50">
          {exercise.lessonNumber} — {exercise.lessonTitle}
        </span>
      </div>

      {step.type === 'multiple-choice' && (
        <InlineQuiz
          block={{
            type: 'quiz',
            question: step.question,
            options: step.options,
            correct: step.correctIndex,
            explanation: step.explanation,
          }}
        />
      )}

      {step.type === 'terminal' && (
        <InlineTerminal
          block={{
            type: 'terminal-exercise',
            instruction: step.instruction,
            command: step.expectedCommand,
            hint: step.hint,
          }}
        />
      )}

      {step.type === 'code-input' && (
        <InlineCodeChallenge
          block={{
            type: 'code-challenge',
            instruction: step.instruction,
            answer: step.answer,
            hint: step.hint,
          }}
        />
      )}

      {step.type === 'order' && (
        <OrderExercise step={step} />
      )}

      <button
        type="button"
        onClick={onNext}
        className="text-[10px] font-mono text-foreground/40 hover:text-foreground/60 flex items-center gap-1 mt-2"
      >
        {S[useLang()].nextEx} <ArrowRight className="w-2.5 h-2.5" />
      </button>
    </div>
  )
}

function OrderExercise({ step }: { step: Extract<LessonStep, { type: 'order' }> }) {
  const shuffled = useMemo(() => {
    const indices = step.items.map((_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    if (indices.every((v, i) => v === step.correctOrder[i])) {
      [indices[0], indices[1]] = [indices[1], indices[0]]
    }
    return indices
  }, [step.items, step.correctOrder])

  const [order, setOrder] = useState(shuffled)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const move = (from: number, to: number) => {
    const next = [...order]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
    setStatus('idle')
  }

  const check = () => {
    if (order.every((v, i) => v === step.correctOrder[i])) {
      setStatus('correct')
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus('idle'), 800)
    }
  }

  return (
    <div className="space-y-2 my-2">
      <p className="text-xs text-foreground/80">{step.instruction}</p>
      <div className="space-y-1">
        {order.map((itemIdx, pos) => (
          <motion.div
            key={itemIdx}
            layout
            draggable
            onDragStart={() => setDragIndex(pos)}
            onDragOver={(e) => { e.preventDefault(); setDragOverIndex(pos) }}
            onDragEnd={() => {
              if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
                move(dragIndex, dragOverIndex)
              }
              setDragIndex(null)
              setDragOverIndex(null)
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-grab active:cursor-grabbing select-none ${
              status === 'correct' ? 'border-green-500/30 bg-green-500/5'
              : status === 'wrong' ? 'border-red-500/30 bg-red-500/5'
              : dragOverIndex === pos && dragIndex !== null && dragIndex !== pos
                ? 'border-foreground/20 bg-foreground/[0.05]'
                : 'border-foreground/[0.08] bg-foreground/[0.02]'
            } ${dragIndex === pos ? 'opacity-40' : ''}`}
          >
            <div className="flex gap-0.5">
              <button type="button" onClick={() => pos > 0 && move(pos, pos - 1)} disabled={pos === 0} className="p-0.5 text-foreground/30 hover:text-foreground/60 disabled:opacity-20">
                <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 2 L10 8 L2 8 Z" fill="currentColor" /></svg>
              </button>
              <button type="button" onClick={() => pos < order.length - 1 && move(pos, pos + 1)} disabled={pos === order.length - 1} className="p-0.5 text-foreground/30 hover:text-foreground/60 disabled:opacity-20">
                <svg width="10" height="10" viewBox="0 0 12 12"><path d="M6 10 L10 4 L2 4 Z" fill="currentColor" /></svg>
              </button>
            </div>
            <svg className="w-3 h-3 text-foreground/20 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
              <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
            </svg>
            <span className="font-mono text-foreground/40 text-[10px]">{pos + 1}</span>
            <span className="text-foreground/70">{step.items[itemIdx]}</span>
          </motion.div>
        ))}
      </div>
      {status !== 'correct' && (
        <Button size="sm" onClick={check} className="font-mono text-xs h-7 px-3">
          {S[useLang()].checkOrder} <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// Message rendering
// ============================================================================

function RenderBlocks({ blocks, onPracticeNext }: { blocks: MessageBlock[]; onPracticeNext?: () => void }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/80">
                {block.content.split('**').map((part, j) =>
                  j % 2 === 1
                    ? <strong key={j} className="font-semibold text-foreground/90">{part}</strong>
                    : part
                )}
              </p>
            )
          case 'code':
            return <InlineCode key={i} block={block} />
          case 'quiz':
            return <InlineQuiz key={i} block={block} />
          case 'code-challenge':
            return <InlineCodeChallenge key={i} block={block} />
          case 'terminal-exercise':
            return <InlineTerminal key={i} block={block} />
          case 'practice':
            return <PracticeExerciseRenderer key={i} exercise={block.exercise} onNext={onPracticeNext ?? (() => {})} />
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
  const lang = useLang()
  const s = S[lang]
  const location = useLocation()
  const lessonMatch = location.pathname.match(/^\/learn\/(.+)$/)
  const currentLessonId = lessonMatch?.[1]
  const currentLesson = currentLessonId ? ALL_LESSONS.find((l) => l.id === currentLessonId) : null

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

  const addWelcome = useCallback(() => {
    const device = getDeviceType()
    const kb = getKnowledgeBaseSize()
    const practice = getPracticeCount(currentLessonId)
    const sl = S[lang]

    let content = currentLesson
      ? sl.welLesson(currentLesson.number, currentLesson.title, kb, practice)
      : sl.welGeneral(kb)

    content += sl.welDevice(device === 'webgpu' ? 'WebGPU' : 'WebAssembly')

    setMessages([{
      role: 'assistant',
      content,
      blocks: parseBlocks(content),
      timestamp: Date.now(),
    }])
  }, [currentLesson, currentLessonId, lang])

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
      const history: AssistantMessage[] = messages.map((m) => ({ role: m.role, content: m.content }))

      let accumulated = ''
      const response = await askAssistant(
        trimmed,
        history,
        currentLessonId,
        (token) => {
          accumulated += token
          setMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last?.streaming) {
              updated[updated.length - 1] = { ...last, content: accumulated, blocks: parseBlocks(accumulated) }
            }
            return updated
          })
        },
      )

      const finalContent = response || accumulated
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.streaming) {
          updated[updated.length - 1] = { ...last, content: finalContent, blocks: parseBlocks(finalContent), streaming: false }
        }
        return updated
      })
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last?.streaming) {
          const errContent = s.errMsg
          updated[updated.length - 1] = { ...last, content: errContent, blocks: [{ type: 'text', content: errContent }], streaming: false }
        }
        return updated
      })
    } finally {
      setSending(false)
    }
  }, [input, sending, modelReady, messages, currentLessonId])

  const handlePractice = useCallback(() => {
    if (!modelReady) return

    const exercise = getPracticeExercise(currentLessonId)
    if (!exercise) {
      handleSend('Quiz me on the current topic')
      return
    }

    const content = `Here's a practice exercise from **Lesson ${exercise.lessonNumber}**:`
    const practiceBlock: MessageBlock = { type: 'practice', exercise }

    setMessages((prev) => [
      ...prev,
      { role: 'user' as const, content: 'Practice exercise', timestamp: Date.now() },
      {
        role: 'assistant' as const,
        content,
        blocks: [{ type: 'text', content }, practiceBlock],
        timestamp: Date.now(),
      },
    ])
  }, [modelReady, currentLessonId, handleSend])

  const handlePracticeNext = useCallback(() => {
    handlePractice()
  }, [handlePractice])

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    addWelcome()
  }

  const stageName = (st: ProgressStage | null) => {
    switch (st) {
      case 'embedding-model': return s.stageEmbed
      case 'generation-model': return s.stageGen
      case 'indexing': return s.stageIndex
      default: return s.stageInit
    }
  }

  const totalProgress = (() => {
    if (!progressStage) return 0
    const weights: Record<ProgressStage, [number, number]> = {
      'embedding-model': [0, 15],
      'generation-model': [15, 80],
      'indexing': [80, 100],
    }
    const [base, max] = weights[progressStage]
    return base + (progressPercent / 100) * (max - base)
  })()

  const suggestions = currentLesson
    ? s.sugLesson(currentLesson.number)
    : s.suggestions

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
              aria-label={s.open}
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
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                    {modelReady ? (
                      <>
                        <Cpu className="w-2.5 h-2.5" />
                        {getDeviceType() === 'webgpu' ? 'WebGPU' : 'WASM'} · {getKnowledgeBaseSize()} chunks
                        {currentLesson && ` · L${currentLesson.number}`}
                      </>
                    ) : modelLoading ? (
                      stageName(progressStage)
                    ) : error ? s.error : s.offline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {modelReady && (
                  <button type="button" onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors" title={s.newConv}>
                    <RotateCcw className="w-3 h-3" />
                    {s.clear}
                  </button>
                )}
                <button type="button" onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors">
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
                  <motion.div className="h-full bg-foreground/30 rounded-full" animate={{ width: `${totalProgress}%` }} transition={{ duration: 0.3 }} />
                </div>
                <p className="text-[9px] text-muted-foreground/40 mt-2 font-mono">
                  {s.loadNote}
                </p>
              </div>
            )}

            {/* Error */}
            {error && !modelLoading && !modelReady && (
              <div className="px-5 py-4 border-b border-red-500/10">
                <p className="text-xs text-red-400/80 mb-2">{error}</p>
                <Button
                  size="sm" variant="outline" className="text-xs font-mono h-7"
                  onClick={() => {
                    setError(null)
                    setModelLoading(true)
                    initAssistant((stage, percent) => { setProgressStage(stage); setProgressPercent(percent) })
                      .then(() => { setModelReady(true); setModelLoading(false); addWelcome() })
                      .catch((e) => { setModelLoading(false); setError(e?.message ?? 'Failed to load.') })
                  }}
                >
                  <RotateCcw className="w-3 h-3 mr-1" /> {s.retry}
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
                  <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 ${msg.role === 'assistant' ? 'bg-foreground/10' : 'bg-foreground/5'}`}>
                    {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-foreground/60" /> : <User className="w-3.5 h-3.5 text-foreground/60" />}
                  </div>
                  <div className="max-w-[85%] space-y-1">
                    {msg.role === 'user' ? (
                      <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-foreground text-background">
                        {msg.content}
                      </div>
                    ) : msg.blocks && msg.blocks.length > 0 ? (
                      <div className="rounded-xl px-3.5 py-2.5 bg-foreground/[0.06] space-y-2">
                        <RenderBlocks blocks={msg.blocks} onPracticeNext={handlePracticeNext} />
                        {msg.streaming && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} className="inline-block w-0.5 h-[1em] bg-foreground/50 ml-0.5 align-middle" />
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-foreground/[0.06] text-foreground/80">
                        {msg.content}
                        {msg.streaming && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.4, repeat: Infinity }} className="inline-block w-0.5 h-[1em] bg-foreground/50 ml-0.5 align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {sending && messages[messages.length - 1]?.streaming && messages[messages.length - 1]?.content === '' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-foreground/10">
                    <Bot className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                  <div className="bg-foreground/[0.06] rounded-xl px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((j) => (
                        <motion.div key={j} className="w-1.5 h-1.5 rounded-full bg-foreground/30" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: j * 0.2 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2">
                  {suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => q === 'Quiz me' ? handlePractice() : handleSend(q)}
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
                  onClick={handlePractice}
                  disabled={!modelReady || sending}
                  className="p-2.5 rounded-lg border border-foreground/10 bg-foreground/[0.03] text-foreground/40 hover:text-foreground/70 hover:border-foreground/20 hover:bg-foreground/[0.06] disabled:opacity-30 transition-all shrink-0"
                  title={s.practice}
                  aria-label={s.practice}
                >
                  <Dumbbell className="w-4 h-4" />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={modelReady ? s.placeholder : s.placeholderLoading}
                  disabled={!modelReady || sending}
                  className="flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 disabled:opacity-50 transition-colors"
                />
                <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || !modelReady || sending} className="h-10 w-10 rounded-lg shrink-0">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground/40 text-center mt-2 font-mono">
                {s.footer}{modelReady ? ` · ${getDeviceType().toUpperCase()} ${s.accel}` : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
