import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { Mic, Radio, ChevronRight, PhoneOff, MicOff, Bot, User } from 'lucide-react'
import { Button } from './ui/button'
import { VoiceTutorVisualizer } from './voice-tutor-visualizer'
import { useLiveKitVoice } from '@/hooks/use-livekit-voice'
import { isLiveKitConfigured } from '@/lib/livekit'

export function VoiceTutorCard() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const voice = useLiveKitVoice('dashboard')

  if (!isLiveKitConfigured()) {
    return (
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/[0.06]">
            <Radio className="w-4 h-4 text-foreground/30" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-foreground/30 uppercase tracking-wider mb-0.5">
              {t('voiceTutor.title')}
            </p>
            <p className="text-sm text-foreground/40">
              {t('voiceTutor.configure')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!expanded) {
    return (
      <motion.button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full text-left rounded-xl border border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.05] hover:border-foreground/15 transition-all p-5 group"
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 group-hover:bg-foreground/15 transition-colors">
              <Radio className="w-4 h-4 text-foreground/80" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider mb-0.5">
                {t('voiceTutor.title')}
              </p>
              <p className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                {t('voiceTutor.startSession')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-foreground/50 group-hover:translate-x-0.5 transition-all" />
        </div>
      </motion.button>
    )
  }

  const statusText = (() => {
    if (voice.connectionState === 'connected') {
      if (voice.agentIsSpeaking) return t('voiceTutor.speaking')
      if (voice.isSpeaking) return t('voiceTutor.listening')
      return t('voiceTutor.ready')
    }
    if (voice.connectionState === 'connecting') return t('voiceTutor.connecting')
    if (voice.connectionState === 'error') return voice.error || t('voiceTutor.error')
    return t('voiceTutor.disconnected')
  })()

  return (
    <motion.div
      layout
      className="rounded-xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/[0.06]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-foreground/50" />
          <span className="text-xs font-mono text-foreground/50">{t('voiceTutor.title')}</span>
          <span className="text-[9px] font-mono text-foreground/30">— {statusText}</span>
        </div>
        <button
          type="button"
          onClick={() => { voice.disconnect(); setExpanded(false) }}
          className="text-[10px] font-mono text-foreground/30 hover:text-foreground/60 transition-colors"
        >
          {t('voiceTutor.collapse')}
        </button>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Visualizer */}
          <div className="relative shrink-0">
            <VoiceTutorVisualizer
              connectionState={voice.connectionState}
              audioLevel={voice.audioLevel}
              agentAudioLevel={voice.agentAudioLevel}
              frequencyData={voice.frequencyData}
              agentFrequencyData={voice.agentFrequencyData}
              isSpeaking={voice.isSpeaking}
              agentIsSpeaking={voice.agentIsSpeaking}
              size={140}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {voice.connectionState === 'connected' ? (
                voice.agentIsSpeaking ? (
                  <Bot className="w-6 h-6 text-foreground/15" />
                ) : (
                  <Mic className="w-5 h-5 text-foreground/10" />
                )
              ) : (
                <Radio className="w-5 h-5 text-foreground/10" />
              )}
            </div>
          </div>

          {/* Controls & transcript */}
          <div className="flex-1 w-full space-y-3">
            {voice.connectionState === 'disconnected' && (
              <Button
                onClick={voice.connect}
                className="w-full font-mono gap-2 group"
              >
                <Mic className="w-4 h-4" />
                {t('voiceTutor.startVoiceSession')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            )}

            {voice.connectionState === 'error' && (
              <div className="space-y-2">
                <p className="text-xs text-red-400/80">{voice.error}</p>
                <Button onClick={voice.connect} variant="outline" size="sm" className="font-mono text-xs">
                  Retry
                </Button>
              </div>
            )}

            {(voice.connectionState === 'connected' || voice.connectionState === 'connecting') && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={voice.toggleMute}
                  variant="outline"
                  size="sm"
                  className={`flex-1 font-mono text-xs ${voice.isMuted ? 'border-red-500/30 text-red-400' : ''}`}
                  disabled={voice.connectionState !== 'connected'}
                >
                  {voice.isMuted ? <><MicOff className="w-3 h-3 mr-1" /> {t('voiceTutor.unmute')}</> : <><Mic className="w-3 h-3 mr-1" /> {t('voiceTutor.mute')}</>}
                </Button>
                <Button
                  onClick={voice.disconnect}
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <PhoneOff className="w-3 h-3 mr-1" /> {t('voiceTutor.end')}
                </Button>
              </div>
            )}

            {/* Mini transcript */}
            <AnimatePresence>
              {voice.transcript.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="max-h-32 overflow-y-auto space-y-1.5 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02] p-3"
                >
                  {voice.transcript.slice(-4).map((entry, i) => (
                    <div
                      key={`${entry.timestamp}-${i}`}
                      className={`flex items-start gap-1.5 text-xs ${
                        entry.role === 'user' ? 'text-foreground/60' : 'text-foreground/80'
                      } ${!entry.final ? 'opacity-50' : ''}`}
                    >
                      {entry.role === 'agent'
                        ? <Bot className="w-3 h-3 text-foreground/30 mt-0.5 shrink-0" />
                        : <User className="w-3 h-3 text-foreground/30 mt-0.5 shrink-0" />
                      }
                      <span>{entry.text}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
