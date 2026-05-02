import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Mic,
  MicOff,
  X,
  PhoneOff,
  RotateCcw,
  Bot,
  User,
  Radio,
} from 'lucide-react'
import { Button } from './ui/button'
import { VoiceTutorVisualizer } from './voice-tutor-visualizer'
import { useLiveKitVoice } from '@/hooks/use-livekit-voice'
import { isLiveKitConfigured } from '@/lib/livekit'

function useLang(): 'en' | 'fr' {
  const { i18n } = useTranslation()
  return i18n.language?.startsWith('fr') ? 'fr' : 'en'
}

const S = {
  en: {
    title: 'Voice Tutor',
    open: 'Open voice tutor',
    listening: 'Listening...',
    thinking: 'Thinking...',
    speaking: 'Speaking...',
    idle: 'Ready — tap to speak',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    disconnected: 'Disconnected',
    error: 'Connection error',
    micRequired: 'Microphone required',
    noAgent: 'Voice tutor starting...',
    agentWaiting: 'Waiting for tutor agent...',
    startSession: 'Start voice session',
    endSession: 'End session',
    retry: 'Retry',
    mute: 'Mute',
    unmute: 'Unmute',
  },
  fr: {
    title: 'Tuteur Vocal',
    open: 'Ouvrir le tuteur vocal',
    listening: 'Écoute...',
    thinking: 'Réflexion...',
    speaking: 'Parle...',
    idle: 'Prêt — parlez',
    connecting: 'Connexion...',
    reconnecting: 'Reconnexion...',
    disconnected: 'Déconnecté',
    error: 'Erreur de connexion',
    micRequired: 'Micro requis',
    noAgent: 'Démarrage du tuteur...',
    agentWaiting: "En attente de l'agent tuteur...",
    startSession: 'Démarrer la session vocale',
    endSession: 'Fin de session',
    retry: 'Réessayer',
    mute: 'Couper le micro',
    unmute: 'Activer le micro',
  },
} as const

function getContextFromPath(pathname: string): string {
  const lessonMatch = pathname.match(/\/(?:course\/)?learn\/(.+)$/)
  if (lessonMatch) return `lesson-${lessonMatch[1]}`
  if (pathname.includes('/dashboard')) return 'dashboard'
  if (pathname.includes('/community') || pathname.includes('/chat')) return 'community'
  return 'general'
}

interface VoiceTutorProps {
  context?: string
  offsetBottom?: boolean
}

export function VoiceTutor({ context: contextProp, offsetBottom = false }: VoiceTutorProps) {
  const lang = useLang()
  const s = S[lang]
  const location = useLocation()
  const derivedContext = contextProp || getContextFromPath(location.pathname)

  const [isOpen, setIsOpen] = useState(false)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  const voice = useLiveKitVoice(derivedContext)

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [voice.transcript])

  if (!isLiveKitConfigured()) return null

  const statusText = (() => {
    switch (voice.connectionState) {
      case 'connecting': return s.connecting
      case 'reconnecting': return s.reconnecting
      case 'error': return voice.error || s.error
      case 'disconnected': return s.disconnected
      case 'connected':
        if (voice.agentState === 'waiting') return s.agentWaiting
        if (voice.agentIsSpeaking) return s.speaking
        if (voice.isSpeaking) return s.listening
        if (voice.agentState === 'thinking') return s.thinking
        return s.idle
      default: return s.disconnected
    }
  })()

  const statusColor = (() => {
    switch (voice.connectionState) {
      case 'connected': return 'bg-green-500'
      case 'connecting':
      case 'reconnecting': return 'bg-yellow-500 animate-pulse'
      case 'error': return 'bg-red-500'
      default: return 'bg-foreground/30'
    }
  })()

  return (
    <>
      {/* FAB toggle */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed ${offsetBottom ? 'bottom-24' : 'bottom-6'} right-6 z-50`}
          >
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-background shadow-lg hover:scale-105 active:scale-95 transition-transform"
              aria-label={s.open}
            >
              <Radio className="w-6 h-6" />
              {voice.connectionState === 'connected' && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 rounded-full bg-green-500/20"
                />
              )}
              {voice.connectionState === 'connected' && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] sm:max-w-[calc(100vw-3rem)] h-[100dvh] sm:h-[calc(100vh-3rem)] sm:bottom-6 sm:right-6 sm:rounded-2xl border-0 sm:border border-foreground/15 bg-background/98 sm:bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/10">
                  <Radio className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {statusText}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors"
                aria-label="Close voice tutor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Visualizer area */}
              <div className="flex items-center justify-center py-8 px-4">
                <div className="relative">
                  <VoiceTutorVisualizer
                    connectionState={voice.connectionState}
                    audioLevel={voice.audioLevel}
                    agentAudioLevel={voice.agentAudioLevel}
                    frequencyData={voice.frequencyData}
                    agentFrequencyData={voice.agentFrequencyData}
                    isSpeaking={voice.isSpeaking}
                    agentIsSpeaking={voice.agentIsSpeaking}
                    size={200}
                  />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {voice.connectionState === 'connected' ? (
                      voice.agentIsSpeaking ? (
                        <Bot className="w-8 h-8 text-foreground/20" />
                      ) : voice.isSpeaking ? (
                        <Mic className="w-8 h-8 text-foreground/20" />
                      ) : (
                        <Radio className="w-6 h-6 text-foreground/10" />
                      )
                    ) : voice.connectionState === 'connecting' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                      >
                        <Radio className="w-6 h-6 text-foreground/15" />
                      </motion.div>
                    ) : (
                      <Mic className="w-6 h-6 text-foreground/10" />
                    )}
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
                {voice.transcript.map((entry, i) => (
                  <motion.div
                    key={`${entry.timestamp}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${entry.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5 ${
                      entry.role === 'agent' ? 'bg-foreground/10' : 'bg-foreground/5'
                    }`}>
                      {entry.role === 'agent'
                        ? <Bot className="w-3.5 h-3.5 text-foreground/60" />
                        : <User className="w-3.5 h-3.5 text-foreground/60" />
                      }
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      entry.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-foreground/[0.06] text-foreground/80'
                    } ${!entry.final ? 'opacity-60' : ''}`}>
                      {entry.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            {/* Controls */}
            <div className="px-5 py-4 border-t border-foreground/10 bg-background/50">
              {voice.connectionState === 'disconnected' && (
                <Button
                  onClick={voice.connect}
                  size="lg"
                  className="w-full h-12 font-mono gap-2 group"
                >
                  <Mic className="w-4 h-4" />
                  {s.startSession}
                </Button>
              )}

              {voice.connectionState === 'error' && (
                <div className="space-y-2">
                  <p className="text-xs text-red-400/80 text-center">{voice.error}</p>
                  <Button
                    onClick={voice.connect}
                    variant="outline"
                    className="w-full font-mono gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {s.retry}
                  </Button>
                </div>
              )}

              {(voice.connectionState === 'connected' || voice.connectionState === 'connecting' || voice.connectionState === 'reconnecting') && (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={voice.toggleMute}
                    variant="outline"
                    size="lg"
                    className={`flex-1 h-12 font-mono gap-2 ${
                      voice.isMuted ? 'border-red-500/30 text-red-400' : ''
                    }`}
                    disabled={voice.connectionState !== 'connected'}
                  >
                    {voice.isMuted
                      ? <><MicOff className="w-4 h-4" /> {s.unmute}</>
                      : <><Mic className="w-4 h-4" /> {s.mute}</>
                    }
                  </Button>
                  <Button
                    onClick={() => { voice.disconnect(); }}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                    title={s.endSession}
                  >
                    <PhoneOff className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <p className="text-[9px] text-muted-foreground/40 text-center mt-2 font-mono">
                LiveKit · Self-hosted · End-to-end encrypted
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
