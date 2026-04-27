export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'code'; language: string; code: string; filename?: string }
  | { type: 'steps'; items: { title: string; body: string; code?: string }[] }
  | { type: 'tip'; text: string }
  | { type: 'warning'; text: string }
  | { type: 'checklist'; title?: string; items: string[] }

export interface LessonContent {
  lessonId: string
  blocks: ContentBlock[]
}
