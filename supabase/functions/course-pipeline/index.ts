import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_DOC_PAGES = [
  { url: 'https://docs.anthropic.com/en/docs/about-claude/models', title: 'Claude Models' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', title: 'Tool Use' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', title: 'Prompt Caching' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', title: 'Extended Thinking' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/computer-use', title: 'Computer Use' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch-processing', title: 'Batch Processing' },
  { url: 'https://docs.anthropic.com/en/docs/build-with-claude/agentic-tool-use', title: 'Agentic Tool Use' },
  { url: 'https://docs.anthropic.com/en/docs/about-claude/models/all-models', title: 'All Models Reference' },
  { url: 'https://docs.anthropic.com/en/api/messages', title: 'Messages API' },
  { url: 'https://docs.anthropic.com/en/api/streaming', title: 'Streaming' },
]

const CHANGELOG_URLS = ['https://www.anthropic.com/news']

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function fetchPage(url: string, title: string): Promise<{ url: string; title: string; content: string } | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CourseEngine-Monitor/1.0 (+https://charlesjackson.dev)' } })
    if (!res.ok) return null
    const html = await res.text()
    const content = stripHtml(html)
    return content.length >= 100 ? { url, title, content } : null
  } catch {
    return null
  }
}

interface SourceEvent {
  source: string
  url: string
  title: string
  content_hash: string
  raw_content: string
}

interface ExtractedFact {
  statement: string
  category: string
  entities: string[]
  confidence: number
}

const EXTRACTION_SCHEMA = {
  type: 'object' as const,
  properties: {
    facts: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          statement: { type: 'string' as const },
          category: { type: 'string' as const, enum: ['model_capability', 'pricing', 'sdk_api', 'pattern', 'deprecation', 'release', 'breaking_change', 'best_practice'] },
          entities: { type: 'array' as const, items: { type: 'string' as const } },
          confidence: { type: 'number' as const, minimum: 0, maximum: 1 },
        },
        required: ['statement', 'category', 'entities', 'confidence'],
      },
    },
    source_summary: { type: 'string' as const },
  },
  required: ['facts', 'source_summary'],
}

function buildExtractionPrompt(title: string, source: string, content: string): string {
  return `You are a knowledge extraction agent. Extract atomic, independently-useful facts from this AI documentation.

SOURCE: ${source} — ${title}

RULES:
1. Each fact = single atomic claim. Be specific with version numbers, dates, exact values.
2. Entity tags: lowercase, hyphen-separated (e.g. "claude-opus-4-7", "tool-use")
3. Categories: model_capability, pricing, sdk_api, pattern, deprecation, release, breaking_change, best_practice
4. Confidence: 0.95-1.0 for official docs
5. Skip marketing fluff and widely-known information
6. source_summary: 1-2 sentences about what this document covers

CONTENT:
${content.slice(0, 6000)}`
}

async function extractFacts(
  apiKey: string,
  title: string,
  source: string,
  content: string,
): Promise<{ facts: ExtractedFact[]; summary: string } | null> {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        tools: [{
          name: 'record_facts',
          description: 'Record extracted knowledge facts.',
          input_schema: EXTRACTION_SCHEMA,
        }],
        tool_choice: { type: 'tool', name: 'record_facts' },
        messages: [{ role: 'user', content: buildExtractionPrompt(title, source, content) }],
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const toolBlock = data.content?.find((b: { type: string }) => b.type === 'tool_use')
    if (!toolBlock) return null

    const input = toolBlock.input as { facts: ExtractedFact[]; source_summary: string }
    return {
      facts: input.facts.map(f => ({
        ...f,
        entities: f.entities.map(e => e.toLowerCase().replace(/\s+/g, '-')),
      })),
      summary: input.source_summary,
    }
  } catch {
    return null
  }
}

Deno.serve(async (req) => {
  const authHeader = req.headers.get('authorization')
  const expectedKey = Deno.env.get('PIPELINE_SECRET')
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!authHeader?.includes(supabaseAnonKey ?? '___none___')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
  const log: string[] = []

  try {
    // --- Create pipeline run ---
    const runId = crypto.randomUUID()
    await supabase.from('pipeline_runs').insert({
      id: runId,
      status: 'running',
      events_fetched: 0,
      facts_extracted: 0,
      blocks_flagged: 0,
      proposals_generated: 0,
    })

    // --- Stage 1: Monitor ---
    const { data: existing } = await supabase
      .from('source_events')
      .select('content_hash')
    const existingHashes = new Set((existing ?? []).map((e: { content_hash: string }) => e.content_hash))
    log.push(`Existing hashes: ${existingHashes.size}`)

    const allPages = [
      ...ANTHROPIC_DOC_PAGES.map(p => ({ ...p, source: 'anthropic_docs' })),
      ...CHANGELOG_URLS.map(u => ({ url: u, title: 'Anthropic News', source: 'anthropic_changelog' })),
    ]

    const newEvents: Array<SourceEvent & { id: string }> = []

    for (const page of allPages) {
      const result = await fetchPage(page.url, page.title)
      if (!result) continue

      const hash = await sha256(result.content)
      if (existingHashes.has(hash)) continue

      const id = crypto.randomUUID()
      const { error } = await supabase.from('source_events').insert({
        id,
        source: page.source,
        url: result.url,
        title: result.title,
        content_hash: hash,
        raw_content: result.content,
      })

      if (!error) {
        newEvents.push({ id, source: page.source, url: result.url, title: result.title, content_hash: hash, raw_content: result.content })
      }
    }

    log.push(`New events: ${newEvents.length}`)
    await supabase.from('pipeline_runs').update({ events_fetched: newEvents.length }).eq('id', runId)

    // --- Stage 2: Extract ---
    let totalFacts = 0

    if (anthropicKey && newEvents.length > 0) {
      for (const event of newEvents) {
        const result = await extractFacts(anthropicKey, event.title, event.source, event.raw_content)
        if (!result) continue

        for (const fact of result.facts) {
          const factId = crypto.randomUUID()
          await supabase.from('knowledge_facts').insert({
            id: factId,
            statement: fact.statement,
            category: fact.category,
            entities: fact.entities,
            confidence: fact.confidence,
            source_event_id: event.id,
            valid_from: new Date().toISOString(),
          })
          totalFacts++
        }

        if (result.summary) {
          await supabase.from('source_events').update({ summary: result.summary }).eq('id', event.id)
        }
      }
      log.push(`Facts extracted: ${totalFacts}`)
    } else if (!anthropicKey) {
      log.push('No ANTHROPIC_API_KEY — skipping extraction')
    } else {
      log.push('No new events — skipping extraction')
    }

    await supabase.from('pipeline_runs').update({
      facts_extracted: totalFacts,
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', runId)

    log.push('Pipeline completed')

    return new Response(JSON.stringify({
      status: 'completed',
      events: newEvents.length,
      facts: totalFacts,
      log,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    log.push(`Error: ${(err as Error).message}`)
    return new Response(JSON.stringify({ status: 'failed', error: (err as Error).message, log }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
