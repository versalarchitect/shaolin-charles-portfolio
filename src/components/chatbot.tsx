import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { initChatbot, askChatbot, isChatbotReady, isChatbotLoading } from '@/lib/chatbot-engine'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [modelProgress, setModelProgress] = useState(0)
  const [modelReady, setModelReady] = useState(false)
  const [modelLoading, setModelLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !modelReady && !modelLoading) {
      setModelLoading(true)
      initChatbot((progress) => {
        setModelProgress(progress)
      }).then(() => {
        setModelReady(true)
        setModelLoading(false)
        setMessages([{
          role: 'assistant',
          content: "Hi! I'm the course assistant for The Agentic SaaS Course. Ask me about pricing, curriculum, prerequisites, or enrollment — I'm here to help.",
        }])
      }).catch(() => {
        setModelLoading(false)
        setMessages([{
          role: 'assistant',
          content: "I couldn't load the AI model. You can still reach us at hello@charlesjackson.dev for any questions.",
        }])
      })
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, modelReady, modelLoading])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await askChatbot(trimmed)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again or email hello@charlesjackson.dev.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
              aria-label="Open course assistant"
            >
              <MessageSquare className="w-6 h-6" />
              <motion.div
                animate={prefersReducedMotion ? {} : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-foreground/20"
              />
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
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl border border-foreground/15 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/10">
                  <Sparkles className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Course Assistant</h3>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {modelReady ? 'AI-powered · Runs locally' : modelLoading ? 'Loading model...' : 'Offline'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Loading state */}
            {modelLoading && !modelReady && (
              <div className="px-5 py-3 border-b border-foreground/5">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Loading AI model ({Math.round(modelProgress)}%)</span>
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
                  key={`${msg.role}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/[0.06] text-foreground/80'
                  }`}>
                    {msg.content.split('\n\n').map((para, pi) => (
                      <p key={pi} className={pi > 0 ? 'mt-2' : ''}>{para}</p>
                    ))}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5"
                >
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

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-foreground/10">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={modelReady ? 'Ask about the course...' : 'Loading...'}
                  disabled={!modelReady || loading}
                  className="flex-1 bg-foreground/[0.04] border border-foreground/10 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 disabled:opacity-50 transition-colors"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
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
                Runs locally in your browser · No data sent to servers
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
