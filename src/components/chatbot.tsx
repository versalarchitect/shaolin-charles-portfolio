import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Link } from '@/lib/localized-router'
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles, Globe, RotateCcw, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import { initChatbot, askChatbot, switchLanguage, getChatbotLang } from '@/lib/chatbot-engine'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  actions?: Array<{ label: string; href: string }>
  typing?: boolean
}

const STORAGE_KEY = 'chatbot-messages'
const SUGGESTED_EN = ['What will I learn?', 'How much is it?', 'Do I need to know how to code?']
const SUGGESTED_FR = ["Qu'est-ce que je vais apprendre ?", 'Combien ça coûte ?', 'Dois-je savoir coder ?']

function getTimeGreeting(lang: string): string {
  const h = new Date().getHours()
  if (lang === 'fr') {
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getActionsForResponse(content: string, lang: string): Array<{ label: string; href: string }> {
  const lower = content.toLowerCase()
  const actions: Array<{ label: string; href: string }> = []

  if (lower.includes('price') || lower.includes('prix') || lower.includes('$7,500') || lower.includes('7 500') || lower.includes('enroll') || lower.includes('inscrire')) {
    actions.push({ label: lang === 'fr' ? "S'inscrire" : 'Enroll Now', href: '/tiers' })
  }
  if (lower.includes('tier') || lower.includes('niveau') || lower.includes('curriculum') || lower.includes('programme') || lower.includes('lesson') || lower.includes('leçon')) {
    actions.push({ label: lang === 'fr' ? 'Voir le programme' : 'View Curriculum', href: '/curriculum' })
  }
  if (lower.includes('instructor') || lower.includes('instructeur') || lower.includes('charles') || lower.includes('who teaches') || lower.includes('qui enseigne')) {
    actions.push({ label: lang === 'fr' ? "Voir l'instructeur" : 'Meet the Instructor', href: '/instructor' })
  }
  if (lower.includes('principle') || lower.includes('principe')) {
    actions.push({ label: lang === 'fr' ? 'Voir les principes' : 'View Principles', href: '/principles' })
  }
  if (lower.includes('email') || lower.includes('courriel') || lower.includes('contact')) {
    actions.push({ label: lang === 'fr' ? 'Nous contacter' : 'Contact Us', href: '/contact' })
  }

  return actions.slice(0, 2)
}

function getFollowUps(content: string, lang: string): string[] {
  const lower = content.toLowerCase()
  if (lang === 'fr') {
    if (lower.includes('prix') || lower.includes('7 500')) return ['Quelle est la politique de remboursement ?', 'Quels sont les niveaux ?']
    if (lower.includes('niveau') || lower.includes('tier')) return ['Combien ça coûte ?', "Qu'est-ce que je vais apprendre ?"]
    if (lower.includes('orchestr') || lower.includes('agent')) return ['Dois-je savoir coder ?', 'Quels sont les niveaux ?']
    return ['Combien ça coûte ?', "Qu'est-ce que je vais apprendre ?"]
  }
  if (lower.includes('price') || lower.includes('$7,500')) return ["What's the refund policy?", 'What are the tiers?']
  if (lower.includes('tier') || lower.includes('curriculum')) return ['How much is it?', 'What will I learn?']
  if (lower.includes('orchestrat') || lower.includes('agent')) return ['Do I need coding experience?', 'What are the tiers?']
  return ['How much is it?', 'What will I learn?']
}

function parseLinks(text: string): Array<{ type: 'text' | 'link'; content: string; href?: string }> {
  const parts: Array<{ type: 'text' | 'link'; content: string; href?: string }> = []
  const linkRegex = /\/(tiers|curriculum|principles|instructor|contact|blog)/g
  let lastIndex = 0
  let match: RegExpExecArray | null = null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'link', content: match[0], href: match[0] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }
  return parts.length ? parts : [{ type: 'text', content: text }]
}

function loadMessages(): Message[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const msgs = JSON.parse(stored) as Message[]
      if (Date.now() - (msgs[msgs.length - 1]?.timestamp ?? 0) < 30 * 60 * 1000) {
        return msgs
      }
    }
  } catch { /* ignore */ }
  return []
}

function saveMessages(msgs: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.map(({ typing, ...m }) => m)))
  } catch { /* ignore */ }
}

export function Chatbot() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelProgress, setModelProgress] = useState(0)
  const [modelReady, setModelReady] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [showFollowUps, setShowFollowUps] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !modelReady && !modelLoading) {
      setModelLoading(true)
      initChatbot(lang, (progress) => {
        setModelProgress(progress)
      }).then(() => {
        setModelReady(true)
        setModelLoading(false)
        const restored = loadMessages()
        if (restored.length > 0) {
          setMessages(restored)
        } else {
          const greeting = getTimeGreeting(lang)
          const welcome = lang === 'fr'
            ? `${greeting} ! Je suis l'assistant du cours Agentic SaaS. Posez-moi des questions sur le prix, le programme, les prérequis ou l'inscription.`
            : `${greeting}! I'm the course assistant for The Agentic SaaS Course. Ask me about pricing, curriculum, prerequisites, or enrollment.`
          setMessages([{ role: 'assistant', content: welcome, timestamp: Date.now() }])
        }
      }).catch(() => {
        setModelLoading(false)
        setMessages([{
          role: 'assistant',
          content: lang === 'fr'
            ? "Je n'ai pas pu charger le modèle IA. Contactez-nous à hello@charlesjackson.dev."
            : "I couldn't load the AI model. Reach us at hello@charlesjackson.dev.",
          timestamp: Date.now(),
        }])
      })
    }
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, modelReady, modelLoading, lang])

  useEffect(() => {
    if (messages.length > 0) saveMessages(messages)
  }, [messages])

  const handleLanguageSwitch = useCallback(async (targetLang: string) => {
    i18n.changeLanguage(targetLang)
    await switchLanguage(targetLang)
    const confirmMsg = targetLang === 'fr'
      ? "Bien sûr ! Le site est maintenant en français. Comment puis-je vous aider ?"
      : "Sure! The site is now in English. How can I help?"
    const newMsg: Message = { role: 'assistant', content: confirmMsg, timestamp: Date.now() }
    setMessages((prev) => [...prev, newMsg])
    setShowFollowUps([])
  }, [i18n])

  const addBotMessage = useCallback((content: string, actions?: Array<{ label: string; href: string }>) => {
    if (prefersReducedMotion) {
      setMessages((prev) => [...prev, { role: 'assistant', content, timestamp: Date.now(), actions }])
      setShowFollowUps(getFollowUps(content, getChatbotLang()))
      return
    }

    const msg: Message = { role: 'assistant', content: '', timestamp: Date.now(), typing: true }
    setMessages((prev) => [...prev, msg])

    let i = 0
    const interval = setInterval(() => {
      i += Math.floor(Math.random() * 3) + 2
      if (i >= content.length) {
        i = content.length
        clearInterval(interval)
        setMessages((prev) =>
          prev.map((m) => (m.timestamp === msg.timestamp ? { ...m, content, typing: false, actions } : m))
        )
        setShowFollowUps(getFollowUps(content, getChatbotLang()))
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.timestamp === msg.timestamp ? { ...m, content: content.slice(0, i) } : m))
        )
      }
    }, 15)
  }, [prefersReducedMotion])

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: Date.now() }])
    setInput('')
    setLoading(true)
    setShowFollowUps([])

    try {
      const response = await askChatbot(trimmed)

      if (response === '__SWITCH_LANG_FR__') {
        await handleLanguageSwitch('fr')
      } else if (response === '__SWITCH_LANG_EN__') {
        await handleLanguageSwitch('en')
      } else {
        const actions = getActionsForResponse(response, getChatbotLang())
        addBotMessage(response, actions.length > 0 ? actions : undefined)
        if (!isOpen) setHasUnread(true)
      }
    } catch {
      const errorMsg = getChatbotLang() === 'fr'
        ? 'Quelque chose a mal tourné. Réessayez ou contactez hello@charlesjackson.dev.'
        : 'Something went wrong. Please try again or email hello@charlesjackson.dev.'
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg, timestamp: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    const greeting = getTimeGreeting(lang)
    const welcome = lang === 'fr'
      ? `${greeting} ! Comment puis-je vous aider ?`
      : `${greeting}! How can I help?`
    setMessages([{ role: 'assistant', content: welcome, timestamp: Date.now() }])
    setShowFollowUps([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = lang === 'fr' ? SUGGESTED_FR : SUGGESTED_EN
  const showInitialSuggestions = modelReady && messages.length <= 2 && !loading && showFollowUps.length === 0

  return (
    <>
      {/* Floating button */}
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
              aria-label={lang === 'fr' ? "Ouvrir l'assistant" : 'Open course assistant'}
            >
              <MessageSquare className="w-6 h-6" />
              <motion.div
                animate={prefersReducedMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-foreground/20"
              />
              {/* Unread dot */}
              {hasUnread && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background"
                />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[460px] sm:max-w-[calc(100vw-3rem)] h-[100dvh] sm:h-[640px] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl border-0 sm:border border-foreground/15 bg-background/98 sm:bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/10">
                  <Sparkles className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    {lang === 'fr' ? 'Assistant du cours' : 'Course Assistant'}
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {modelReady
                      ? (lang === 'fr' ? 'IA locale · Privé' : 'AI-powered · Private')
                      : modelLoading
                        ? (lang === 'fr' ? 'Chargement...' : 'Loading...')
                        : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {modelReady && (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                      aria-label={lang === 'fr' ? 'Nouvelle conversation' : 'New conversation'}
                      title={lang === 'fr' ? 'Nouvelle conversation' : 'New conversation'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageSwitch(lang === 'fr' ? 'en' : 'fr')}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                      aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                      title={lang === 'fr' ? 'English' : 'Français'}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                  aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading bar */}
            {modelLoading && !modelReady && (
              <div className="px-5 py-3 border-b border-foreground/5">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {lang === 'fr' ? `Chargement (${Math.round(modelProgress)}%)` : `Loading AI (${Math.round(modelProgress)}%)`}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-foreground/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${modelProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={`${msg.timestamp}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
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
                  <div className="max-w-[82%] space-y-2">
                    <div className={`rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-foreground/[0.06] text-foreground/80'
                    }`}>
                      {msg.content.split('\n\n').map((para, pi) => (
                        <p key={pi} className={pi > 0 ? 'mt-2' : ''}>
                          {msg.role === 'assistant'
                            ? parseLinks(para).map((part, li) =>
                                part.type === 'link' ? (
                                  <Link
                                    key={li}
                                    to={part.href!}
                                    onClick={() => setIsOpen(false)}
                                    className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors"
                                  >
                                    {part.content}
                                  </Link>
                                ) : (
                                  <span key={li}>{part.content}</span>
                                )
                              )
                            : para}
                        </p>
                      ))}
                      {msg.typing && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                          className="inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle"
                        />
                      )}
                    </div>

                    {/* Action buttons */}
                    {msg.actions && msg.actions.length > 0 && !msg.typing && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.actions.map((action) => (
                          <Link
                            key={action.href}
                            to={action.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md border border-foreground/15 bg-foreground/[0.04] text-foreground/70 hover:text-foreground hover:border-foreground/25 hover:bg-foreground/[0.08] transition-all"
                          >
                            {action.label}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 bg-foreground/10">
                    <Bot className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                  <div className="bg-foreground/[0.06] rounded-xl px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-foreground/30"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested / Follow-up questions */}
              {!loading && (showInitialSuggestions || showFollowUps.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-2"
                >
                  {(showFollowUps.length > 0 ? showFollowUps : suggestions).map((q) => (
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
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    modelReady
                      ? (lang === 'fr' ? 'Posez une question...' : 'Ask a question...')
                      : (lang === 'fr' ? 'Chargement...' : 'Loading...')
                  }
                  disabled={!modelReady || loading}
                  className="flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 disabled:opacity-50 transition-colors"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || !modelReady || loading}
                  className="h-10 w-10 rounded-lg shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-[9px] text-muted-foreground/40 text-center mt-2 font-mono">
                {lang === 'fr' ? 'IA locale · Aucune donnée envoyée' : 'Runs locally · No data sent to servers'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
