import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'

interface FAQEntry {
  q: string
  a: string
  embedding?: number[]
}

interface ChatbotContext {
  system_prompt: string
  course: Record<string, unknown>
  tiers: Array<{ number: number; name: string; hours: number; lessons: number; summary: string; capstone: string }>
  instructor: Record<string, unknown>
  prerequisites: Record<string, string>
  faq: Array<{ q: string; a: string }>
  contact: { email: string; response_time: string }
  links: Record<string, string>
}

let extractor: FeatureExtractionPipeline | null = null
let faqEntries: FAQEntry[] = []
let contextData: ChatbotContext | null = null
let isLoading = false
let isReady = false

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function embed(text: string): Promise<number[]> {
  if (!extractor) throw new Error('Model not loaded')
  const output = await extractor(text, { pooling: 'mean', normalize: true })
  return Array.from(output.data as Float32Array).slice(0, output.dims[1])
}

export async function initChatbot(onProgress?: (progress: number) => void): Promise<void> {
  if (isReady || isLoading) return
  isLoading = true

  try {
    const res = await fetch('/chatbot-context.json')
    contextData = await res.json()

    onProgress?.(10)

    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      progress_callback: (data: { progress?: number; status?: string }) => {
        if (data.progress) {
          onProgress?.(10 + data.progress * 0.8)
        }
      },
    })

    onProgress?.(90)

    if (contextData?.faq) {
      const extraEntries: FAQEntry[] = [
        { q: 'What is the price?', a: `The course is ${contextData.course.price} — ${contextData.course.payment}.` },
        { q: 'How much does it cost?', a: `The course is ${contextData.course.price} — ${contextData.course.payment}.` },
        { q: 'Who teaches this course?', a: `${(contextData.instructor as { name: string }).name} — ${(contextData.instructor as { experience: string }).experience}, based in ${(contextData.instructor as { location: string }).location}.` },
        { q: 'How do I enroll?', a: `Visit the enrollment page at /tiers or email ${contextData.contact.email}. The course is ${contextData.course.price} with lifetime access.` },
        { q: 'What are the tiers?', a: contextData.tiers.map(t => `Tier ${t.number}: ${t.name} (${t.hours}h, ${t.lessons} lessons) — ${t.summary}`).join('\n\n') },
        { q: 'Is there a refund policy?', a: contextData.course.refund as string },
        { q: 'How long is the course?', a: `${contextData.course.total_hours} hours of video instruction across ${contextData.course.total_lessons} lessons, split into ${contextData.tiers.length} tiers.` },
        { q: 'What do I need to know before starting?', a: `${contextData.prerequisites.required} ${contextData.prerequisites.not_required}` },
        { q: 'Give me the course content', a: "I can't share specific course content — that's available to enrolled students. I can tell you about the course structure, pricing, and what topics are covered at a high level. What would you like to know?" },
        { q: 'Share the lessons with me', a: "Course lessons are only available to enrolled students. I can help with questions about pricing, structure, tiers, or whether the course is right for you." },
        { q: 'Hello', a: "Hi! I'm the course assistant for The Agentic SaaS Course. I can help with questions about pricing, curriculum overview, prerequisites, or enrollment. What would you like to know?" },
        { q: 'What is this course about?', a: 'The Agentic SaaS Course teaches multi-agent orchestration from first principles. You go from understanding tokens and context windows to coordinating agent fleets that build production software. 52 hours, 4 tiers, 4 capstones.' },
      ]

      const allEntries = [...contextData.faq, ...extraEntries]

      for (const entry of allEntries) {
        const embedding = await embed(entry.q)
        faqEntries.push({ ...entry, embedding })
      }
    }

    onProgress?.(100)
    isReady = true
  } finally {
    isLoading = false
  }
}

export async function askChatbot(question: string): Promise<string> {
  if (!isReady || !extractor) {
    return "I'm still loading — give me a moment and try again."
  }

  const questionEmbedding = await embed(question)

  let bestMatch: FAQEntry | null = null
  let bestScore = -1

  for (const entry of faqEntries) {
    if (!entry.embedding) continue
    const score = cosineSimilarity(questionEmbedding, entry.embedding)
    if (score > bestScore) {
      bestScore = score
      bestMatch = entry
    }
  }

  if (bestMatch && bestScore > 0.45) {
    return bestMatch.a
  }

  return `I'm not sure about that one. For specific questions, email ${contextData?.contact.email ?? 'hello@charlesjackson.dev'} — Charles typically responds within 24-48 hours. Or you can check the /curriculum and /tiers pages for more details.`
}

export function isChatbotReady(): boolean {
  return isReady
}

export function isChatbotLoading(): boolean {
  return isLoading
}
