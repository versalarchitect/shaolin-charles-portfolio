export interface DiagramData {
  nodes: Array<{
    id: string
    label: string
    sublabel?: string
    shape?: 'rect' | 'diamond' | 'rounded' | 'pill'
    highlight?: boolean
  }>
  edges: Array<{
    from: string
    to: string
    label?: string
    dashed?: boolean
  }>
  direction?: 'TB' | 'LR'
}

export interface CodeFillBlank {
  id: string
  answer: string
  alternatives?: string[]
  hint?: string
  placeholder?: string
}

export interface ComparePanel {
  label: string
  content: string
  language?: string
  filename?: string
}

export interface DiagramStage {
  highlightNodes: string[]
  highlightEdges?: Array<{ from: string; to: string }>
  explanation: string
}

export interface PromptLabResponse {
  triggerKeywords: string[]
  response: string
  quality: 'poor' | 'good' | 'excellent'
  feedback: string
}

export type Platform = 'macos' | 'windows' | 'linux'

export type LessonStep =
  | { type: 'info'; title: string; body: string; platforms?: Partial<Record<Platform, { title?: string; body: string }>> }
  | { type: 'code-demo'; title?: string; body: string; code: string; language: string; filename?: string; platforms?: Partial<Record<Platform, { body?: string; code: string; language?: string; filename?: string }>> }
  | { type: 'terminal'; instruction: string; expectedCommand: string; hint?: string; platforms?: Partial<Record<Platform, { instruction?: string; expectedCommand: string; hint?: string }>> }
  | { type: 'multiple-choice'; question: string; options: string[]; correctIndex: number; explanation: string; hint?: string; platforms?: Partial<Record<Platform, { question?: string; options?: string[]; correctIndex?: number; explanation?: string }>> }
  | { type: 'code-input'; instruction: string; placeholder: string; answer: string; hint?: string; platforms?: Partial<Record<Platform, { instruction?: string; placeholder?: string; answer: string; hint?: string }>> }
  | { type: 'order'; instruction: string; items: string[]; correctOrder: number[]; hint?: string; platforms?: Partial<Record<Platform, { instruction?: string; items: string[]; correctOrder: number[] }>> }
  | { type: 'checklist'; title: string; items: string[] }
  | { type: 'checkpoint'; xp: number; message: string }
  | { type: 'diagram'; title: string; body?: string; diagram: DiagramData }
  | { type: 'code-fill'; instruction: string; language: string; template: string; blanks: CodeFillBlank[]; filename?: string; explanation?: string; hint?: string; platforms?: Partial<Record<Platform, { instruction?: string; language?: string; template: string; blanks: CodeFillBlank[]; filename?: string; explanation?: string }>> }
  | { type: 'compare'; title: string; body?: string; left: ComparePanel; right: ComparePanel; question?: string; correctSide?: 'left' | 'right'; explanation?: string; hint?: string }
  | { type: 'match'; instruction: string; leftItems: string[]; rightItems: string[]; correctPairs: Record<number, number>; explanation?: string; hint?: string }
  | { type: 'code-diff'; title: string; body?: string; language: string; filename?: string; before: string; after: string; question?: string; highlightLines?: number[]; explanation?: string }
  | { type: 'interactive-diagram'; title: string; body?: string; diagram: DiagramData; stages: DiagramStage[] }
  | { type: 'prompt-lab'; instruction: string; scenario: string; starterPrompt?: string; responses: PromptLabResponse[]; fallbackResponse: { response: string; feedback: string }; hint?: string }

export interface LessonContent {
  lessonId: string
  steps: LessonStep[]
}

// Legacy support
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'code'; language: string; code: string; filename?: string }
  | { type: 'steps'; items: { title: string; body: string; code?: string }[] }
  | { type: 'tip'; text: string }
  | { type: 'warning'; text: string }
  | { type: 'checklist'; title?: string; items: string[] }
