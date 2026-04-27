import type { LessonContent } from './types'

const modules: Record<string, () => Promise<{ default: LessonContent }>> = {
  p1: () => import('./p1'),
  p2: () => import('./p2'),
}

export async function loadLessonContent(lessonId: string): Promise<LessonContent | null> {
  const loader = modules[lessonId]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}

export function hasLessonContent(lessonId: string): boolean {
  return lessonId in modules
}

export type { ContentBlock, LessonContent } from './types'
