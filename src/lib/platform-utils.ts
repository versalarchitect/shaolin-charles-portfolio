import type { LessonStep, Platform } from '@/data/lessons/types'

type StepWithPlatforms = Extract<LessonStep, { platforms?: unknown }>

export function stepHasPlatformVariants(step: LessonStep): boolean {
  return 'platforms' in step && !!step.platforms && Object.keys(step.platforms as object).length > 0
}

export function getAvailablePlatforms(step: LessonStep): Platform[] {
  const base: Platform[] = ['macos']
  if (!stepHasPlatformVariants(step)) return base
  const platforms = (step as StepWithPlatforms).platforms!
  const keys = Object.keys(platforms) as Platform[]
  const all = new Set<Platform>([...base, ...keys])
  const order: Platform[] = ['macos', 'windows', 'linux']
  return order.filter(p => all.has(p))
}

export function resolvePlatformStep<T extends LessonStep>(step: T, platform: Platform): T {
  if (!stepHasPlatformVariants(step)) return step
  const platforms = (step as StepWithPlatforms).platforms!
  const overrides = platforms[platform]
  if (!overrides) {
    const { ...rest } = step
    delete (rest as Record<string, unknown>).platforms
    return rest as T
  }
  const { ...rest } = step
  delete (rest as Record<string, unknown>).platforms
  return { ...rest, ...overrides } as T
}
