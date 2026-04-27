import { useState, useEffect, useCallback } from 'react'
import { Check, Copy, Lightbulb, AlertTriangle } from 'lucide-react'
import type { ContentBlock, LessonContent } from '@/data/lessons/types'
import { loadLessonContent } from '@/data/lessons'

function HeadingBlock({ text }: { text: string }) {
  return <h2 className="text-xl font-bold tracking-tight mt-10 mb-4 first:mt-0">{text}</h2>
}

function TextBlock({ text }: { text: string }) {
  return <p className="text-foreground/70 leading-relaxed mb-4">{text}</p>
}

function CodeBlock({ code, filename }: { language: string; code: string; filename?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] overflow-hidden mb-4 group">
      {filename && (
        <div className="px-4 py-2 border-b border-foreground/[0.06] text-[11px] font-mono text-foreground/40">
          {filename}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/30 hover:text-foreground/60 hover:bg-foreground/10 transition-all opacity-0 group-hover:opacity-100"
        title="Copy to clipboard"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-foreground/80 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function StepsBlock({ items }: { items: { title: string; body: string; code?: string }[] }) {
  return (
    <div className="space-y-4 mb-6">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center mt-0.5">
            <span className="text-xs font-mono font-semibold text-foreground/60">{i + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground/90 mb-1">{item.title}</p>
            {item.body && <p className="text-sm text-foreground/60 leading-relaxed mb-2">{item.body}</p>}
            {item.code && (
              <pre className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-3 overflow-x-auto text-sm font-mono text-foreground/80 leading-relaxed">
                <code>{item.code}</code>
              </pre>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function TipBlock({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.03] px-4 py-3 mb-4">
      <Lightbulb className="w-4 h-4 text-foreground/40 shrink-0 mt-0.5" />
      <p className="text-sm text-foreground/70 leading-relaxed">{text}</p>
    </div>
  )
}

function WarningBlock({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-foreground/20 bg-foreground/[0.05] px-4 py-3 mb-4">
      <AlertTriangle className="w-4 h-4 text-foreground/50 shrink-0 mt-0.5" />
      <p className="text-sm text-foreground/70 leading-relaxed">{text}</p>
    </div>
  )
}

function ChecklistBlock({ title, items }: { title?: string; items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false))

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  return (
    <div className="rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] p-4 mb-4">
      {title && <p className="text-sm font-medium text-foreground/60 mb-3">{title}</p>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex items-start gap-3 w-full text-left group"
          >
            <div
              className={`
                flex-shrink-0 w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all
                ${checked[i]
                  ? 'bg-foreground/15 border-foreground/25'
                  : 'border-foreground/15 group-hover:border-foreground/25'
                }
              `}
            >
              {checked[i] && <Check className="w-3 h-3 text-foreground/70" />}
            </div>
            <span
              className={`text-sm leading-relaxed transition-colors ${
                checked[i] ? 'text-foreground/40 line-through' : 'text-foreground/70'
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock text={block.text} />
    case 'text':
      return <TextBlock text={block.text} />
    case 'code':
      return <CodeBlock language={block.language} code={block.code} filename={block.filename} />
    case 'steps':
      return <StepsBlock items={block.items} />
    case 'tip':
      return <TipBlock text={block.text} />
    case 'warning':
      return <WarningBlock text={block.text} />
    case 'checklist':
      return <ChecklistBlock title={block.title} items={block.items} />
    default:
      return null
  }
}

export function LessonContentRenderer({ lessonId }: { lessonId: string }) {
  const [content, setContent] = useState<LessonContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadLessonContent(lessonId).then((data) => {
      setContent(data)
      setLoading(false)
    })
  }, [lessonId])

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-mono text-foreground/40">Loading lesson content...</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm font-mono text-foreground/40">Lesson content coming soon.</p>
      </div>
    )
  }

  return (
    <div className="prose-custom">
      {content.blocks.map((block, i) => (
        <ContentBlockRenderer key={i} block={block} />
      ))}
    </div>
  )
}
