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
  '1-8': () => import('./1-8'),
  '1-9': () => import('./1-9'),
  '1-10': () => import('./1-10'),
  '2-1': () => import('./2-1'),
  '2-2': () => import('./2-2'),
  '2-3': () => import('./2-3'),
  '2-4': () => import('./2-4'),
  '2-5': () => import('./2-5'),
  '2-6': () => import('./2-6'),
  '2-7': () => import('./2-7'),
  '2-8': () => import('./2-8'),
  '2-9': () => import('./2-9'),
  '2-10': () => import('./2-10'),
  '2-11': () => import('./2-11'),
  '2-12': () => import('./2-12'),
  '3-1': () => import('./3-1'),
  '3-2': () => import('./3-2'),
  '3-3': () => import('./3-3'),
  '3-4': () => import('./3-4'),
  '3-5': () => import('./3-5'),
  '3-6': () => import('./3-6'),
  '3-7': () => import('./3-7'),
  '3-8': () => import('./3-8'),
  '3-9': () => import('./3-9'),
  '3-10': () => import('./3-10'),
  '3-11': () => import('./3-11'),
  '3-12': () => import('./3-12'),
  '3-13': () => import('./3-13'),
  '3-14': () => import('./3-14'),
  '4-1': () => import('./4-1'),
  '4-2': () => import('./4-2'),
  '4-3': () => import('./4-3'),
  '4-4': () => import('./4-4'),
  '4-5': () => import('./4-5'),
  '4-6': () => import('./4-6'),
  '4-7': () => import('./4-7'),
  '4-8': () => import('./4-8'),
  '4-9': () => import('./4-9'),
  '4-10': () => import('./4-10'),
  '4-11': () => import('./4-11'),
  '4-12': () => import('./4-12'),
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
