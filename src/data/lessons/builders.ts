import type { LessonStep, DiagramData, CodeFillBlank, ComparePanel } from './types'

/**
 * Type-safe step builder functions that validate at authoring time
 * and reduce boilerplate when writing lesson content.
 */
export const step = {
  info: (title: string, body: string): LessonStep => ({ type: 'info', title, body }),

  code: (code: string, language: string, opts?: { title?: string; body?: string; filename?: string }): LessonStep => ({
    type: 'code-demo',
    code,
    language,
    body: opts?.body ?? '',
    title: opts?.title,
    filename: opts?.filename,
  }),

  terminal: (instruction: string, expectedCommand: string, hint?: string): LessonStep => ({
    type: 'terminal', instruction, expectedCommand, hint,
  }),

  quiz: (question: string, options: string[], correctIndex: number, explanation: string): LessonStep => {
    if (correctIndex < 0 || correctIndex >= options.length) {
      throw new Error(`quiz: correctIndex ${correctIndex} out of bounds for ${options.length} options`)
    }
    return { type: 'multiple-choice', question, options, correctIndex, explanation }
  },

  codeInput: (instruction: string, answer: string, opts?: { placeholder?: string; hint?: string }): LessonStep => ({
    type: 'code-input', instruction, answer, placeholder: opts?.placeholder ?? '', hint: opts?.hint,
  }),

  order: (instruction: string, items: string[], correctOrder: number[]): LessonStep => {
    if (correctOrder.length !== items.length || new Set(correctOrder).size !== items.length) {
      throw new Error(`order: correctOrder must be a permutation of [0..${items.length - 1}]`)
    }
    return { type: 'order', instruction, items, correctOrder }
  },

  checklist: (title: string, items: string[]): LessonStep => ({ type: 'checklist', title, items }),

  checkpoint: (xp: number, message: string): LessonStep => ({ type: 'checkpoint', xp, message }),

  diagram: (title: string, diagram: DiagramData, body?: string): LessonStep => ({ type: 'diagram', title, diagram, body }),

  codeFill: (instruction: string, language: string, template: string, blanks: CodeFillBlank[], opts?: { filename?: string; explanation?: string }): LessonStep => ({
    type: 'code-fill', instruction, language, template, blanks, filename: opts?.filename, explanation: opts?.explanation,
  }),

  compare: (title: string, left: ComparePanel, right: ComparePanel, opts?: { body?: string; question?: string; correctSide?: 'left' | 'right'; explanation?: string }): LessonStep => ({
    type: 'compare', title, left, right, body: opts?.body, question: opts?.question, correctSide: opts?.correctSide, explanation: opts?.explanation,
  }),
}

/**
 * Common multi-step patterns that appear across many lessons.
 */
export const patterns = {
  intro: (topic: string, body: string): LessonStep => step.info(topic, body),

  closing: (items: string[], xp: number = 10): LessonStep[] => [
    step.checklist('You can now:', items),
    step.checkpoint(xp, 'Lesson mastered!'),
  ],

  conceptIntro: (concept: string, definition: string, context: string): LessonStep[] => [
    step.info(`What is ${concept}?`, definition),
    step.info('Why this matters', context),
  ],
}
