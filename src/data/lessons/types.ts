export type LessonStep =
  | { type: 'info'; title: string; body: string }
  | { type: 'code-demo'; title?: string; body: string; code: string; language: string; filename?: string }
  | { type: 'terminal'; instruction: string; expectedCommand: string; hint?: string }
  | { type: 'multiple-choice'; question: string; options: string[]; correctIndex: number; explanation: string }
  | { type: 'code-input'; instruction: string; placeholder: string; answer: string; hint?: string }
  | { type: 'order'; instruction: string; items: string[]; correctOrder: number[] }
  | { type: 'checklist'; title: string; items: string[] }
  | { type: 'checkpoint'; xp: number; message: string }

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
