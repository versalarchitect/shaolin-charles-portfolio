import { pipeline, env } from '@huggingface/transformers'
import { CURRICULUM, ALL_LESSONS } from '@/data/curriculum'
import { loadLessonContent } from '@/data/lessons'
import type { LessonStep, LessonContent } from '@/data/lessons/types'

env.allowRemoteModels = true

const EMBED_MODEL = 'Xenova/all-MiniLM-L6-v2'
const GEN_MODEL = 'onnx-community/Qwen2.5-0.5B-Instruct'
const TOP_K = 6
const MAX_TOKENS = 512

// ============================================================================
// Types
// ============================================================================

interface ContentChunk {
  text: string
  category: 'meta' | 'tier' | 'lesson' | 'objective' | 'step' | 'faq'
  lessonId?: string
  embedding: number[]
}

export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface PracticeExercise {
  lessonId: string
  lessonNumber: string
  lessonTitle: string
  step: LessonStep
}

export type ProgressStage = 'embedding-model' | 'generation-model' | 'indexing'

// ============================================================================
// State
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let embedder: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let generator: any = null
let chunks: ContentChunk[] = []
let practiceBank: PracticeExercise[] = []
let deviceType: 'webgpu' | 'wasm' = 'wasm'
let ready = false
let loading = false

// ============================================================================
// Utilities
// ============================================================================

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

async function embed(text: string): Promise<number[]> {
  const out = await embedder(text, { pooling: 'mean', normalize: true })
  return Array.from(out.data as Float32Array).slice(0, out.dims[1])
}

async function detectDevice(): Promise<'webgpu' | 'wasm'> {
  try {
    if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
      const adapter = await (navigator as Navigator & { gpu: GPU }).gpu.requestAdapter()
      if (adapter) return 'webgpu'
    }
  } catch { /* WebGPU unavailable */ }
  return 'wasm'
}

// ============================================================================
// Degenerate output detection — prevent repetitive garbage from the model
// ============================================================================

const DEGENERATE_FALLBACK = "I couldn't generate a clear response. Please try rephrasing your question."

function isDegenerate(text: string): boolean {
  if (text.length < 30) return false
  const stripped = text.replace(/\s+/g, '')
  if (stripped.length === 0) return true
  const uniqueChars = new Set(stripped).size
  if (uniqueChars <= 3 && stripped.length > 20) return true
  const tail = stripped.slice(-40)
  for (let n = 1; n <= 4; n++) {
    const pattern = tail.slice(0, n)
    if (pattern.length > 0 && tail === pattern.repeat(Math.ceil(tail.length / n)).slice(0, tail.length)) {
      return true
    }
  }
  return false
}

function cleanDegenerate(text: string): string {
  const match = text.match(/(.{1,4}?)\1{8,}/)
  if (match?.index !== undefined) {
    return text.slice(0, match.index).trim()
  }
  return text.trim()
}

// ============================================================================
// Knowledge base — every piece of course content
// ============================================================================

interface RawChunk {
  text: string
  category: ContentChunk['category']
  lessonId?: string
}

function buildRawChunks(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  faqData: any,
  lessonContents: Record<string, LessonContent | null>,
): RawChunk[] {
  const raw: RawChunk[] = []

  // --- Course metadata ---
  raw.push({
    text: 'The Agentic SaaS Course: 52 hours, 51 lessons, 4 tiers + prework. Multi-agent orchestration from first principles. Price: $4,500 USD one-time, lifetime access. Technologies: Claude Code, Next.js, TypeScript, Supabase, Vercel, Stripe, Drizzle ORM, Inngest, Vitest, Playwright.',
    category: 'meta',
  })
  raw.push({
    text: 'Prerequisites: Basic JavaScript/TypeScript to read and verify agent output. Not a coding bootcamp. Prior AI tool experience helpful but not required.',
    category: 'meta',
  })
  raw.push({
    text: 'XP progression system: Bronze (0-149 XP), Silver (150-499), Gold (500-999), Platinum (1000-1799), Diamond (1800+). 12 achievements including tier completions, streak badges, and Course Complete (200 XP). Total available XP: ~1,325.',
    category: 'meta',
  })
  raw.push({
    text: 'Instructor: Charles Jackson. 20+ years building production systems. Montreal, Canada. Founder at Predictive (Augure), creator of NxSupabase (official Nx plugin for Supabase), former CTO at MyUrbanFarm.ai.',
    category: 'meta',
  })
  raw.push({
    text: 'Refund policy: 30-day money-back guarantee. Complete Tier 1 and submit the capstone. If not for you, email for full refund.',
    category: 'meta',
  })
  raw.push({
    text: 'Capstone projects: Tier 1 — deploy an agent-built tool. Tier 2 — ship a full SaaS product directed by a single agent. Tier 3 — ship a product built by a coordinated agent fleet. Tier 4 — system teardown and agent-buildable redesign document.',
    category: 'meta',
  })

  // --- Tier descriptions ---
  for (const tier of CURRICULUM) {
    raw.push({
      text: `Tier ${tier.number} "${tier.name}": ${tier.description}. ${tier.hours} hours, ${tier.lessonCount} lessons.`,
      category: 'tier',
      lessonId: tier.id,
    })
  }

  // --- Every lesson: summary + objectives ---
  for (const lesson of ALL_LESSONS) {
    raw.push({
      text: `Lesson ${lesson.number} "${lesson.title}": ${lesson.description}. Tools: ${lesson.tools.join(', ')}.${lesson.isCapstone ? ' This is a capstone project.' : ''} Duration: ${lesson.duration} min, ${lesson.xp} XP.`,
      category: 'lesson',
      lessonId: lesson.id,
    })

    if (lesson.objectives.length > 0) {
      raw.push({
        text: `Lesson ${lesson.number} learning objectives: ${lesson.objectives.join('. ')}.`,
        category: 'objective',
        lessonId: lesson.id,
      })
    }
  }

  // --- Step-level content from available lessons ---
  for (const [lessonId, content] of Object.entries(lessonContents)) {
    if (!content) continue
    const lesson = ALL_LESSONS.find((l) => l.id === lessonId)
    if (!lesson) continue

    for (const step of content.steps) {
      let text = ''
      switch (step.type) {
        case 'info':
          text = `[Lesson ${lesson.number}] ${step.title}: ${step.body}`
          break
        case 'code-demo':
          text = `[Lesson ${lesson.number}] Code${step.title ? ' — ' + step.title : ''}: ${step.body} Code: ${step.code}`
          break
        case 'multiple-choice':
          text = `[Lesson ${lesson.number}] Quiz: ${step.question} Options: ${step.options.join(' / ')}. Correct: ${step.options[step.correctIndex]}. ${step.explanation}`
          break
        case 'terminal':
          text = `[Lesson ${lesson.number}] Terminal: ${step.instruction} Command: ${step.expectedCommand}${step.hint ? '. Hint: ' + step.hint : ''}`
          break
        case 'code-input':
          text = `[Lesson ${lesson.number}] Code exercise: ${step.instruction} Answer: ${step.answer}`
          break
        case 'order':
          text = `[Lesson ${lesson.number}] Ordering: ${step.instruction} Correct order: ${step.correctOrder.map((i) => step.items[i]).join(' → ')}`
          break
        case 'checklist':
          text = `[Lesson ${lesson.number}] Checklist "${step.title}": ${step.items.join('; ')}`
          break
      }
      if (text) {
        raw.push({ text, category: 'step', lessonId })
      }
    }
  }

  // --- FAQ entries ---
  if (faqData?.faq) {
    for (const entry of faqData.faq as { q: string; a: string }[]) {
      raw.push({
        text: `Q: ${entry.q} A: ${entry.a}`,
        category: 'faq',
      })
    }
  }

  return raw
}

// ============================================================================
// Practice exercise bank — real exercises from lesson step data
// ============================================================================

function extractPracticeExercises(
  lessonContents: Record<string, LessonContent | null>,
): PracticeExercise[] {
  const exercises: PracticeExercise[] = []
  const interactiveTypes = new Set(['multiple-choice', 'terminal', 'code-input', 'order'])

  for (const [lessonId, content] of Object.entries(lessonContents)) {
    if (!content) continue
    const lesson = ALL_LESSONS.find((l) => l.id === lessonId)
    if (!lesson) continue

    for (const step of content.steps) {
      if (interactiveTypes.has(step.type)) {
        exercises.push({
          lessonId,
          lessonNumber: lesson.number,
          lessonTitle: lesson.title,
          step,
        })
      }
    }
  }

  return exercises
}

// ============================================================================
// RAG retrieval
// ============================================================================

function retrieve(queryEmbedding: number[], currentLessonId?: string): string[] {
  const scored = chunks.map((c) => {
    let boost = 0
    if (currentLessonId && c.lessonId === currentLessonId) boost = 0.15
    if (c.category === 'step') boost += 0.05
    return {
      text: c.text,
      score: cosine(queryEmbedding, c.embedding) + boost,
    }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TOP_K).map((s) => s.text)
}

// ============================================================================
// System prompt
// ============================================================================

const SYSTEM_PROMPT = `You are the AI Tutor for The Agentic SaaS Course — a 52-hour program teaching multi-agent orchestration from first principles.

You assist enrolled students with understanding lesson concepts, answering course questions, and providing practice.

Rules:
1. Answer using the provided course context. Be concise and precise.
2. Use code examples when helpful (wrap in triple backticks with a language tag).
3. When asked to practice or quiz, output ONE exercise in one of these formats:

:::quiz
question: [Question text]
options: ["Option A", "Option B", "Option C", "Option D"]
correct: [index 0-3]
explanation: [Why the correct answer is right]
:::

:::terminal
instruction: [What the student should do]
command: [Expected command]
hint: [Help text]
:::

:::code-challenge
instruction: [What to type]
answer: [Expected answer]
hint: [Help text]
:::

4. Only use the structured exercise formats above when asked to practice/quiz.
5. If you don't know something, say so and suggest which lesson covers that topic.
6. Keep answers under 150 words unless a detailed explanation is needed.`

// ============================================================================
// Init — load models, fetch content, build index
// ============================================================================

export async function initAssistant(
  onProgress?: (stage: ProgressStage, percent: number) => void,
): Promise<void> {
  if (ready || loading) return
  loading = true

  try {
    deviceType = await detectDevice()

    // Fetch course content in parallel with model loading
    const contentPromise = Promise.all([
      fetch('/chatbot-context.json').then((r) => r.json()).catch(() => null),
      loadLessonContent('p1'),
      loadLessonContent('p2'),
    ])

    // Load embedding model
    onProgress?.('embedding-model', 0)
    embedder = await pipeline('feature-extraction', EMBED_MODEL, {
      device: deviceType,
      progress_callback: (data: { progress?: number }) => {
        if (data.progress) onProgress?.('embedding-model', data.progress)
      },
    })
    onProgress?.('embedding-model', 100)

    // Load generation model — use q4f16 for WebGPU, q4 for WASM
    onProgress?.('generation-model', 0)
    generator = await pipeline('text-generation', GEN_MODEL, {
      device: deviceType,
      dtype: deviceType === 'webgpu' ? 'q4f16' : 'q4',
      progress_callback: (data: { progress?: number }) => {
        if (data.progress) onProgress?.('generation-model', data.progress)
      },
    })
    onProgress?.('generation-model', 100)

    // Wait for content
    const [faqData, p1Content, p2Content] = await contentPromise
    const lessonContents: Record<string, LessonContent | null> = {
      p1: p1Content,
      p2: p2Content,
    }

    // Build and embed knowledge base
    onProgress?.('indexing', 0)
    const rawChunks = buildRawChunks(faqData, lessonContents)
    chunks = []
    for (let i = 0; i < rawChunks.length; i++) {
      const embedding = await embed(rawChunks[i].text)
      chunks.push({ ...rawChunks[i], embedding })
      onProgress?.('indexing', ((i + 1) / rawChunks.length) * 100)
    }

    // Build practice bank
    practiceBank = extractPracticeExercises(lessonContents)

    ready = true
  } finally {
    loading = false
  }
}

// ============================================================================
// Ask — RAG + generation with optional streaming
// ============================================================================

export async function askAssistant(
  question: string,
  history: AssistantMessage[],
  currentLessonId?: string,
  onToken?: (token: string) => void,
): Promise<string> {
  if (!ready || !generator || !embedder) {
    return "I'm still loading — give me a moment and try again."
  }

  const queryEmb = await embed(question)
  const context = retrieve(queryEmb, currentLessonId)

  const currentLesson = currentLessonId
    ? ALL_LESSONS.find((l) => l.id === currentLessonId)
    : null

  let systemContent = SYSTEM_PROMPT
  if (currentLesson) {
    systemContent += `\n\nStudent is on: Lesson ${currentLesson.number} — ${currentLesson.title}.\n${currentLesson.description}\nObjectives: ${currentLesson.objectives.join('; ')}\nTools: ${currentLesson.tools.join(', ')}`
  }
  systemContent += `\n\nCourse context:\n${context.join('\n')}`

  const messages = [
    { role: 'system' as const, content: systemContent },
    ...history.slice(-6).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: question },
  ]

  // Try streaming first
  if (onToken && generator.tokenizer) {
    try {
      let streamedText = ''
      let halted = false

      const wrappedCallback = (token: string) => {
        if (halted) return
        streamedText += token
        if (streamedText.length > 80 && isDegenerate(streamedText.slice(-80))) {
          halted = true
          return
        }
        onToken(token)
      }

      const { TextStreamer } = await import('@huggingface/transformers')
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: wrappedCallback,
      })

      const output = await generator(messages, {
        max_new_tokens: MAX_TOKENS,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.3,
        do_sample: true,
        streamer,
      })

      if (halted) {
        return cleanDegenerate(streamedText) || DEGENERATE_FALLBACK
      }
      return extractResponse(output)
    } catch {
      // Streaming unavailable, fall through
    }
  }

  const output = await generator(messages, {
    max_new_tokens: MAX_TOKENS,
    temperature: 0.7,
    top_p: 0.9,
    repetition_penalty: 1.3,
    do_sample: true,
  })

  const response = extractResponse(output)
  if (isDegenerate(response)) {
    return cleanDegenerate(response) || DEGENERATE_FALLBACK
  }
  return response
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractResponse(output: any): string {
  const generated = output?.[0]?.generated_text
  if (Array.isArray(generated)) {
    const last = generated[generated.length - 1]
    return typeof last === 'string' ? last : last?.content ?? ''
  }
  return typeof generated === 'string' ? generated : ''
}

// ============================================================================
// Practice — serve real exercises from lesson data
// ============================================================================

const usedPracticeIds = new Set<number>()

export function getPracticeExercise(lessonId?: string): PracticeExercise | null {
  if (practiceBank.length === 0) return null

  // Prefer current lesson's exercises
  const pool = lessonId
    ? practiceBank.filter((e) => e.lessonId === lessonId)
    : practiceBank

  const candidates = pool.length > 0 ? pool : practiceBank

  // Try to pick an unseen exercise
  const unseen = candidates.filter((_, i) => !usedPracticeIds.has(practiceBank.indexOf(candidates[i] ?? candidates[0])))
  const source = unseen.length > 0 ? unseen : candidates

  if (usedPracticeIds.size >= practiceBank.length) usedPracticeIds.clear()

  const idx = Math.floor(Math.random() * source.length)
  const exercise = source[idx]
  usedPracticeIds.add(practiceBank.indexOf(exercise))

  return exercise
}

export function getPracticeCount(lessonId?: string): number {
  if (!lessonId) return practiceBank.length
  return practiceBank.filter((e) => e.lessonId === lessonId).length
}

// ============================================================================
// Status
// ============================================================================

export function isAssistantReady(): boolean {
  return ready
}

export function isAssistantLoading(): boolean {
  return loading
}

export function getDeviceType(): 'webgpu' | 'wasm' {
  return deviceType
}

export function getKnowledgeBaseSize(): number {
  return chunks.length
}
