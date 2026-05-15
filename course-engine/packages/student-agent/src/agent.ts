import type { SupabaseClient } from '@supabase/supabase-js';
import { loadState, saveState, loadChannelIds, type AgentState } from './state.js';
import { runScheduledTick } from './scheduler.js';
import { startReactiveListeners } from './reactor.js';

export interface AgentConfig {
  intervalMs: number
  dryRun: boolean
  mode: 'scheduled' | 'reactive' | 'both'
}

const DEFAULT_INTERVAL = 3 * 60 * 60 * 1000
const JITTER_MS = 30 * 60 * 1000

export class StudentAgent {
  private db: SupabaseClient
  private config: AgentConfig
  private state: AgentState | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private reactorCleanup: (() => void) | null = null
  private running = false

  constructor(db: SupabaseClient, config: Partial<AgentConfig> = {}) {
    this.db = db
    this.config = {
      intervalMs: config.intervalMs ?? DEFAULT_INTERVAL,
      dryRun: config.dryRun ?? false,
      mode: config.mode ?? 'both',
    }
  }

  async start(): Promise<void> {
    console.log(`🤖 Student Agent starting (mode: ${this.config.mode}, dry-run: ${this.config.dryRun})`)

    this.state = await loadState(this.db)
    await loadChannelIds(this.db, this.state)

    if (Object.keys(this.state.personaUserIds).length === 0) {
      console.error('❌ No persona user IDs found. Run with --seed first.')
      return
    }

    console.log(`📋 ${Object.keys(this.state.personaUserIds).length} personas loaded`)
    console.log(`📺 ${Object.keys(this.state.channelIds).length} channels cached`)

    this.running = true

    if (this.config.mode === 'scheduled' || this.config.mode === 'both') {
      this.scheduleNextTick()
    }

    if (this.config.mode === 'reactive' || this.config.mode === 'both') {
      const { cleanup } = startReactiveListeners(this.db, this.state, this.config.dryRun)
      this.reactorCleanup = cleanup
      console.log('👂 Reactive listeners active')
    }
  }

  async runOnce(): Promise<void> {
    this.state = await loadState(this.db)
    await loadChannelIds(this.db, this.state)

    if (Object.keys(this.state.personaUserIds).length === 0) {
      console.error('❌ No persona user IDs found. Run with --seed first.')
      return
    }

    console.log(`🔄 Running single scheduled tick...`)
    await runScheduledTick(this.db, this.state, this.config.dryRun)
    await saveState(this.db, this.state)
    console.log('✅ Tick complete')
  }

  async stop(): Promise<void> {
    this.running = false
    if (this.timer) clearTimeout(this.timer)
    if (this.reactorCleanup) this.reactorCleanup()
    if (this.state) await saveState(this.db, this.state)
    console.log('🛑 Student Agent stopped')
  }

  private scheduleNextTick(): void {
    const jitter = (Math.random() - 0.5) * 2 * JITTER_MS
    const delay = this.config.intervalMs + jitter
    const minutes = Math.round(delay / 60000)

    console.log(`⏰ Next tick in ${minutes} minutes`)

    this.timer = setTimeout(async () => {
      if (!this.running || !this.state) return

      try {
        await runScheduledTick(this.db, this.state, this.config.dryRun)
        await saveState(this.db, this.state)
      } catch (err) {
        console.error('Tick failed:', err)
      }

      if (this.running) this.scheduleNextTick()
    }, delay)
  }
}
