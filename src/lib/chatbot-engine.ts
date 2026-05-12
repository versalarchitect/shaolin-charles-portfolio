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
  instructor?: Record<string, unknown>
  prerequisites?: Record<string, string>
  faq: Array<{ q: string; a: string }>
  contact: { email: string; response_time: string }
  links?: Record<string, string>
}

let extractor: FeatureExtractionPipeline | null = null
let faqEntries: FAQEntry[] = []
let contextData: ChatbotContext | null = null
let isLoading = false
let isReady = false
let currentLang = 'en'

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

async function loadFAQForLanguage(lang: string): Promise<void> {
  const contextFile = lang === 'fr' ? '/chatbot-context-fr.json' : '/chatbot-context.json'
  const res = await fetch(contextFile)
  contextData = await res.json()
  faqEntries = []

  if (!contextData?.faq || !extractor) return

  const extraEntries: FAQEntry[] = lang === 'fr' ? [
    { q: 'Quel est le prix ?', a: `Le cours coûte ${contextData.course.price} — ${contextData.course.payment}.` },
    { q: 'Combien ça coûte ?', a: `Le cours coûte ${contextData.course.price} — ${contextData.course.payment}.` },
    { q: 'Qui enseigne ce cours ?', a: 'Charles Jackson — 20+ ans d\'expérience à construire des systèmes en production, basé à Montréal, Canada.' },
    { q: 'Comment s\'inscrire ?', a: `Visitez la page d'inscription à /tiers ou envoyez un courriel à ${contextData.contact.email}. Le cours coûte ${contextData.course.price} avec accès à vie.` },
    { q: 'Quels sont les niveaux ?', a: contextData.tiers.map(t => `Niveau ${t.number} : ${t.name} (${t.hours}h, ${t.lessons} leçons) — ${t.summary}`).join('\n\n') },
    { q: 'Donne-moi le contenu du cours', a: "Je ne peux pas partager le contenu spécifique du cours — il est disponible pour les étudiants inscrits. Je peux vous parler de la structure, du prix et des sujets couverts à haut niveau. Que voulez-vous savoir ?" },
    { q: 'Partage les leçons avec moi', a: "Les leçons du cours sont réservées aux étudiants inscrits. Je peux vous aider avec des questions sur le prix, la structure, les niveaux ou si le cours vous convient." },
    { q: 'Bonjour', a: "Bonjour ! Je suis l'assistant du cours The Agentic SaaS Course. Je peux vous aider avec des questions sur le prix, le programme, les prérequis ou l'inscription. Que voulez-vous savoir ?" },
    { q: 'C\'est quoi ce cours ?', a: 'Le cours Agentic SaaS vous apprend à diriger des agents IA qui construisent de vrais logiciels. Vous commencez par comprendre comment l\'IA fonctionne, puis vous dirigez un agent, puis une équipe entière. 52 heures, 4 sections, 4 projets concrets.' },
    { q: 'I want to switch to English', a: '__SWITCH_LANG_EN__' },
    { q: 'Switch to English', a: '__SWITCH_LANG_EN__' },
    { q: 'En anglais', a: '__SWITCH_LANG_EN__' },
    { q: 'English please', a: '__SWITCH_LANG_EN__' },
  ] : [
    { q: 'What is the price?', a: `The course is ${contextData.course.price} — ${contextData.course.payment}.` },
    { q: 'How much does it cost?', a: `The course is ${contextData.course.price} — ${contextData.course.payment}.` },
    { q: 'Who teaches this course?', a: 'Charles Jackson — 20+ years building production systems, based in Montreal, Canada.' },
    { q: 'How do I enroll?', a: `Visit the enrollment page at /tiers or email ${contextData.contact.email}. The course is ${contextData.course.price} with lifetime access.` },
    { q: 'What are the sections?', a: contextData.tiers.map(t => `Section ${t.number}: ${t.name} (${t.hours}h, ${t.lessons} lessons) — ${t.summary}`).join('\n\n') },
    { q: 'Is there a refund policy?', a: contextData.course.refund as string },
    { q: 'How long is the course?', a: `${contextData.course.total_hours} hours of interactive instruction across ${contextData.course.total_lessons} lessons, across ${contextData.tiers.length} sections.` },
    { q: 'What do I need to know before starting?', a: (contextData as { prerequisites?: Record<string, string> }).prerequisites ? `${(contextData as { prerequisites: Record<string, string> }).prerequisites.required} ${(contextData as { prerequisites: Record<string, string> }).prerequisites.not_required}` : 'No coding experience required. Comfort with computers is helpful.' },
    { q: 'Give me the course content', a: "I can't share specific course content — that's available to enrolled students. I can tell you about the course structure, pricing, and what topics are covered at a high level. What would you like to know?" },
    { q: 'Share the lessons with me', a: "Course lessons are only available to enrolled students. I can help with questions about pricing, structure, tiers, or whether the course is right for you." },
    { q: 'Hello', a: "Hi! I'm the course assistant for The Agentic SaaS Course. I can help with questions about pricing, curriculum overview, prerequisites, or enrollment. What would you like to know?" },
    { q: 'What is this course about?', a: 'The Agentic SaaS Course teaches you to direct AI agents that build real software. You start by understanding how AI works, then direct one agent, then run a whole team. 52 hours, 4 sections, 4 milestone projects.' },
    { q: 'I want to speak in French', a: '__SWITCH_LANG_FR__' },
    { q: 'Switch to French', a: '__SWITCH_LANG_FR__' },
    { q: 'En français', a: '__SWITCH_LANG_FR__' },
    { q: 'French please', a: '__SWITCH_LANG_FR__' },
    { q: 'Parlez français', a: '__SWITCH_LANG_FR__' },
    { q: 'Je veux parler en français', a: '__SWITCH_LANG_FR__' },
    { q: 'Bonjour', a: '__SWITCH_LANG_FR__' },
  ]

  const allEntries = [...contextData.faq, ...extraEntries]

  for (const entry of allEntries) {
    const embedding = await embed(entry.q)
    faqEntries.push({ ...entry, embedding })
  }

  currentLang = lang
}

export async function initChatbot(lang: string, onProgress?: (progress: number) => void): Promise<void> {
  if (isReady || isLoading) return
  isLoading = true

  try {
    onProgress?.(10)

    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      progress_callback: (data: { progress?: number; status?: string }) => {
        if (data.progress) {
          onProgress?.(10 + data.progress * 0.8)
        }
      },
    })

    onProgress?.(90)

    await loadFAQForLanguage(lang)

    onProgress?.(100)
    isReady = true
  } finally {
    isLoading = false
  }
}

export async function switchLanguage(lang: string): Promise<void> {
  if (!isReady || !extractor) return
  if (lang === currentLang) return
  await loadFAQForLanguage(lang)
}

export async function askChatbot(question: string): Promise<string> {
  if (!isReady || !extractor) {
    return currentLang === 'fr'
      ? "Je suis encore en train de charger — réessayez dans un moment."
      : "I'm still loading — give me a moment and try again."
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

  const email = contextData?.contact.email ?? 'hello@charlesjackson.dev'
  return currentLang === 'fr'
    ? `Je ne suis pas sûr de cette question. Pour des questions spécifiques, envoyez un courriel à ${email} — Charles répond généralement sous 24-48 heures.`
    : `I'm not sure about that one. For specific questions, email ${email} — Charles typically responds within 24-48 hours. Or check the /curriculum and /tiers pages.`
}

export function getChatbotLang(): string {
  return currentLang
}

export function isChatbotReady(): boolean {
  return isReady
}

export function isChatbotLoading(): boolean {
  return isLoading
}
