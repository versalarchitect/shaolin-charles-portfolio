import type { MessageTemplate, TemplateCategory } from './templates.js';
import { getTemplatesByCategory } from './templates.js';
import type { LessonData } from './curriculum-data.js';

export function pickTemplate(
  category: TemplateCategory,
  recentIds: string[],
  channelFilter?: string,
): MessageTemplate | null {
  let templates = getTemplatesByCategory(category)
  if (channelFilter) {
    templates = templates.filter((t) => t.channel === channelFilter)
  }
  if (templates.length === 0) return null

  const weighted = templates.map((t) => ({
    template: t,
    weight: recentIds.includes(t.id) ? t.weight * 0.3 : t.weight,
  }))

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)
  let roll = Math.random() * totalWeight
  for (const w of weighted) {
    roll -= w.weight
    if (roll <= 0) return w.template
  }
  return weighted[weighted.length - 1].template
}

export function renderTemplate(
  template: MessageTemplate,
  vars: Record<string, string>,
): string {
  let text = template.text
  for (const [key, value] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return text
}

export function buildVarsForLesson(
  lesson: LessonData,
  totalXp: number,
  streakDays: number,
): Record<string, string> {
  return {
    lesson_title: lesson.title,
    lesson_number: lesson.number,
    tier_name: lesson.tierName,
    tools: lesson.tools.length > 0 ? lesson.tools[0] : 'the concepts',
    xp: String(lesson.xp),
    total_xp: String(totalXp),
    streak_days: String(streakDays),
  }
}

export function trackTemplate(recentIds: string[], templateId: string): string[] {
  return [templateId, ...recentIds].slice(0, 10)
}
