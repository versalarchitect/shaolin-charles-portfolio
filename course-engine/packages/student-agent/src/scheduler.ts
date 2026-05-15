import type { SupabaseClient } from '@supabase/supabase-js';
import { PERSONAS, type SimPersona } from './personas.js';
import { ALL_LESSONS } from './curriculum-data.js';
import type { AgentState } from './state.js';
import { pickTemplate, renderTemplate, buildVarsForLesson, trackTemplate } from './message-builder.js';
import { postChatMessage } from './chat-writer.js';
import { upsertProgress } from './progress-writer.js';

function weightedPick<T extends { activityWeight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.activityWeight, 0)
  let roll = Math.random() * total
  for (const item of items) {
    roll -= item.activityWeight
    if (roll <= 0) return item
  }
  return items[items.length - 1]
}

function lessonsToAdvance(speed: SimPersona['speed']): number {
  const roll = Math.random()
  switch (speed) {
    case 'fast': return roll < 0.3 ? 2 : 1
    case 'medium': return roll < 0.7 ? 1 : 0
    case 'slow': return roll < 0.4 ? 1 : 0
  }
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export async function runScheduledTick(
  db: SupabaseClient,
  state: AgentState,
  dryRun: boolean,
): Promise<void> {
  const personaCount = Math.random() < 0.3 ? 2 : 1
  const selected = new Set<string>()

  for (let n = 0; n < personaCount; n++) {
    const persona = weightedPick(PERSONAS.filter((p) => !selected.has(p.id)))
    selected.add(persona.id)

    const ps = state.personas[persona.id]
    if (!ps) continue
    const userId = state.personaUserIds[persona.id]
    if (!userId) {
      console.warn(`No user ID for persona ${persona.id} — run --seed first`)
      continue
    }

    const count = lessonsToAdvance(persona.speed)
    if (count === 0 && Math.random() > 0.4) {
      // Post a general message even without lesson progress
      const generalChannel = state.channelIds['general'] || state.channelIds['off-topic']
      if (generalChannel) {
        const template = pickTemplate('general_chat', ps.recentTemplateIds)
        if (template) {
          const currentLesson = ALL_LESSONS[ps.currentLessonIndex] || ALL_LESSONS[0]
          const vars = buildVarsForLesson(currentLesson, ps.totalXp, ps.currentStreak)
          const content = renderTemplate(template, vars)
          await postChatMessage(db, generalChannel, persona, userId, content, dryRun)
          ps.recentTemplateIds = trackTemplate(ps.recentTemplateIds, template.id)
          ps.lastMessageTime = Date.now()
        }
      }
      continue
    }

    for (let i = 0; i < count; i++) {
      if (ps.currentLessonIndex >= ALL_LESSONS.length) break

      const lesson = ALL_LESSONS[ps.currentLessonIndex]
      ps.completedLessons.push(lesson.id)
      ps.totalXp += lesson.xp
      ps.currentLessonIndex++

      // Streak logic
      const today = todayISO()
      if (ps.lastActivityDate) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        if (ps.lastActivityDate === yesterday) {
          ps.currentStreak++
        } else if (ps.lastActivityDate !== today) {
          ps.currentStreak = 1
        }
      } else {
        ps.currentStreak = 1
      }
      ps.longestStreak = Math.max(ps.longestStreak, ps.currentStreak)
      ps.lastActivityDate = today
    }

    // Update progress in Supabase
    await upsertProgress(db, persona, userId, ps, ALL_LESSONS, dryRun)

    // Post lesson completion message
    if (count > 0 && ps.currentLessonIndex > 0) {
      const completedLesson = ALL_LESSONS[ps.currentLessonIndex - 1]
      const vars = buildVarsForLesson(completedLesson, ps.totalXp, ps.currentStreak)

      const category = completedLesson.isCapstone ? 'capstone' : 'lesson_complete'
      const preferredChannel = completedLesson.isCapstone
        ? (state.channelIds['showcase'] || state.channelIds['general'])
        : state.channelIds[persona.channelPreferences[0]] || state.channelIds['general']

      if (preferredChannel) {
        const template = pickTemplate(category, ps.recentTemplateIds)
        if (template) {
          const content = renderTemplate(template, vars)
          await postChatMessage(db, preferredChannel, persona, userId, content, dryRun)
          ps.recentTemplateIds = trackTemplate(ps.recentTemplateIds, template.id)
          ps.lastMessageTime = Date.now()
        }
      }

      // Streak milestone message
      if (ps.currentStreak > 0 && ps.currentStreak % 3 === 0 && Math.random() < 0.5) {
        const streakTemplate = pickTemplate('streak', ps.recentTemplateIds)
        if (streakTemplate && state.channelIds['general']) {
          const streakContent = renderTemplate(streakTemplate, vars)
          await postChatMessage(db, state.channelIds['general'], persona, userId, streakContent, dryRun)
          ps.recentTemplateIds = trackTemplate(ps.recentTemplateIds, streakTemplate.id)
        }
      }
    }

    console.log(`📊 ${persona.name}: lesson ${ps.currentLessonIndex}/${ALL_LESSONS.length}, ${ps.totalXp}xp, ${ps.currentStreak}d streak`)
  }
}
