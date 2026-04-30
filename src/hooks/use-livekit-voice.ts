import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Room,
  RoomEvent,
  Track,
  ConnectionState,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  DataPacket_Kind,
  DisconnectReason,
} from 'livekit-client'
import { isLiveKitConfigured, LIVEKIT_URL, fetchLiveKitToken, buildRoomName } from '@/lib/livekit'
import { useAuth } from '@/hooks/use-auth'

export type VoiceConnectionState =
  | 'unavailable'
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

export interface TranscriptEntry {
  role: 'user' | 'agent'
  text: string
  timestamp: number
  final: boolean
}

export interface UseLiveKitVoiceReturn {
  connectionState: VoiceConnectionState
  connect: () => Promise<void>
  disconnect: () => void
  isSpeaking: boolean
  agentIsSpeaking: boolean
  audioLevel: number
  agentAudioLevel: number
  frequencyData: Uint8Array | null
  agentFrequencyData: Uint8Array | null
  isMuted: boolean
  toggleMute: () => void
  transcript: TranscriptEntry[]
  error: string | null
  agentState: string | null
}

const ANALYSER_FFT_SIZE = 128
const AGENT_TIMEOUT_MS = 30_000

export function useLiveKitVoice(context: string): UseLiveKitVoiceReturn {
  const { user } = useAuth()
  const roomRef = useRef<Room | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const agentAnalyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number>(0)

  const [connectionState, setConnectionState] = useState<VoiceConnectionState>(
    isLiveKitConfigured() ? 'disconnected' : 'unavailable',
  )
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [agentIsSpeaking, setAgentIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [agentAudioLevel, setAgentAudioLevel] = useState(0)
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null)
  const [agentFrequencyData, setAgentFrequencyData] = useState<Uint8Array | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [agentState, setAgentState] = useState<string | null>(null)

  const setupAnalyser = useCallback((track: MediaStreamTrack, isAgent: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const source = ctx.createMediaStreamSource(new MediaStream([track]))
    const analyser = ctx.createAnalyser()
    analyser.fftSize = ANALYSER_FFT_SIZE
    analyser.smoothingTimeConstant = 0.8
    source.connect(analyser)

    if (isAgent) {
      agentAnalyserRef.current = analyser
    } else {
      analyserRef.current = analyser
    }
  }, [])

  const updateAudioLevels = useCallback(() => {
    const update = (analyser: AnalyserNode | null, isAgent: boolean) => {
      if (!analyser) return
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)

      let sum = 0
      for (let i = 0; i < data.length; i++) sum += data[i]
      const avg = sum / data.length / 255

      if (isAgent) {
        setAgentAudioLevel(avg)
        setAgentFrequencyData(new Uint8Array(data))
      } else {
        setAudioLevel(avg)
        setFrequencyData(new Uint8Array(data))
      }
    }

    update(analyserRef.current, false)
    update(agentAnalyserRef.current, true)

    animFrameRef.current = requestAnimationFrame(updateAudioLevels)
  }, [])

  const connect = useCallback(async () => {
    if (!isLiveKitConfigured() || !LIVEKIT_URL || !user) return

    setConnectionState('connecting')
    setError(null)
    setTranscript([])
    setAgentState(null)

    try {
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      roomRef.current = room

      room.on(RoomEvent.ConnectionStateChanged, (state: ConnectionState) => {
        switch (state) {
          case ConnectionState.Connected:
            setConnectionState('connected')
            break
          case ConnectionState.Reconnecting:
            setConnectionState('reconnecting')
            break
          case ConnectionState.Disconnected:
            setConnectionState('disconnected')
            break
        }
      })

      room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
        setConnectionState('disconnected')
        if (reason === DisconnectReason.PARTICIPANT_REMOVED) {
          setError('Session ended by server')
        }
      })

      room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const el = track.attach()
          el.style.display = 'none'
          document.body.appendChild(el)

          const mediaTrack = track.mediaStreamTrack
          if (mediaTrack) setupAnalyser(mediaTrack, true)
        }
      })

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const localId = room.localParticipant?.identity
        setIsSpeaking(speakers.some((s) => s.identity === localId))
        setAgentIsSpeaking(speakers.some((s) => s.identity !== localId))
      })

      room.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant, _kind?: DataPacket_Kind) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload))

          if (msg.type === 'transcript') {
            setTranscript((prev) => {
              const entry: TranscriptEntry = {
                role: participant ? 'agent' : 'user',
                text: msg.text,
                timestamp: Date.now(),
                final: msg.final ?? true,
              }
              if (!msg.final && prev.length > 0 && !prev[prev.length - 1].final) {
                return [...prev.slice(0, -1), entry]
              }
              return [...prev, entry]
            })
          }

          if (msg.type === 'agent_state') {
            setAgentState(msg.state)
          }
        } catch {
          // ignore non-JSON data
        }
      })

      const roomName = buildRoomName(user.id, context)
      const token = await fetchLiveKitToken(roomName, user.id, JSON.stringify({ context }))

      await room.connect(LIVEKIT_URL, token)
      await room.localParticipant.setMicrophoneEnabled(true)

      const localAudioTrack = room.localParticipant.getTrackPublication(Track.Source.Microphone)
      if (localAudioTrack?.track?.mediaStreamTrack) {
        setupAnalyser(localAudioTrack.track.mediaStreamTrack, false)
      }

      animFrameRef.current = requestAnimationFrame(updateAudioLevels)

      const agentTimer = setTimeout(() => {
        if (room.remoteParticipants.size === 0) {
          setAgentState('waiting')
        }
      }, AGENT_TIMEOUT_MS)

      room.on(RoomEvent.ParticipantConnected, () => {
        clearTimeout(agentTimer)
        setAgentState('connected')
      })
    } catch (err) {
      setConnectionState('error')
      const message = err instanceof Error ? err.message : 'Connection failed'
      if (message.includes('Permission denied') || message.includes('NotAllowedError')) {
        setError('Microphone access required')
      } else {
        setError(message)
      }
    }
  }, [user, context, setupAnalyser, updateAudioLevels])

  const disconnect = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current)
    roomRef.current?.disconnect()
    roomRef.current = null
    analyserRef.current = null
    agentAnalyserRef.current = null
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close()
    }
    audioContextRef.current = null
    setConnectionState('disconnected')
    setIsSpeaking(false)
    setAgentIsSpeaking(false)
    setAudioLevel(0)
    setAgentAudioLevel(0)
    setFrequencyData(null)
    setAgentFrequencyData(null)
    setAgentState(null)
  }, [])

  const toggleMute = useCallback(() => {
    const room = roomRef.current
    if (!room) return
    const enabled = room.localParticipant.isMicrophoneEnabled
    room.localParticipant.setMicrophoneEnabled(!enabled)
    setIsMuted(enabled)
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      roomRef.current?.disconnect()
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close()
      }
    }
  }, [])

  return {
    connectionState,
    connect,
    disconnect,
    isSpeaking,
    agentIsSpeaking,
    audioLevel,
    agentAudioLevel,
    frequencyData,
    agentFrequencyData,
    isMuted,
    toggleMute,
    transcript,
    error,
    agentState,
  }
}
