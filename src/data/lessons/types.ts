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

export type LessonStep =
  | { type: 'info'; title: string; body: string }
  | { type: 'code-demo'; title?: string; body: string; code: string; language: string; filename?: string }
  | { type: 'terminal'; instruction: string; expectedCommand: string; hint?: string }
  | { type: 'multiple-choice'; question: string; options: string[]; correctIndex: number; explanation: string }
  | { type: 'code-input'; instruction: string; placeholder: string; answer: string; hint?: string }
  | { type: 'order'; instruction: string; items: string[]; correctOrder: number[] }
  | { type: 'checklist'; title: string; items: string[] }
  | { type: 'checkpoint'; xp: number; message: string }
  | { type: 'diagram'; title: string; body?: string; diagram: DiagramData }
  | { type: 'code-fill'; instruction: string; language: string; template: string; blanks: CodeFillBlank[]; filename?: string; explanation?: string }
  | { type: 'compare'; title: string; body?: string; left: ComparePanel; right: ComparePanel; question?: string; correctSide?: 'left' | 'right'; explanation?: string }

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
