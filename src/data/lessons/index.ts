import type { LessonContent } from './types'

const modules: Record<string, () => Promise<{ default: LessonContent }>> = {
  p1: () => import('./p1'),
  p2: () => import('./p2'),
  p3: () => import('./p3'),
  '1-1': () => import('./1-1'),
  '1-2': () => import('./1-2'),
  '1-3': () => import('./1-3'),
  '1-4': () => import('./1-4'),
  '1-5': () => import('./1-5'),
  '1-6': () => import('./1-6'),
  '1-7': () => import('./1-7'),
  '3-1': () => import('./3-1'),
  '3-3': () => import('./3-3'),
  '3-4': () => import('./3-4'),
  '3-13': () => import('./3-13'),
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

export type { LessonStep, LessonContent } from './types'
