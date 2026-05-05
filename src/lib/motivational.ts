const LAST_MESSAGE_KEY = 'motivational-last-message'

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 21) return 'evening'
  return 'night'
}

interface MotivationalContext {
  totalXp: number
  currentStreak: number
  lessonsCompleted: number
  totalLessons: number
  dailyXpEarned: number
  dailyXpGoal: number
  rank: string
  nextRank: string | null
  xpToNextRank: number | null
}

interface MotivationalMessage {
  message: string
}

// Messages indexed by category, ordered by priority (most specific first)
const MESSAGES: Record<string, string[]> = {
  near_level_up: [
    '{remaining} XP to {nextRank}. You\'re right there.',
    'Almost {nextRank}. {remaining} XP to go.',
    '{nextRank} is within reach — {remaining} XP.',
  ],
  course_complete: [
    'You finished the whole thing. Respect.',
    'Course complete. Now go build something real.',
    'Done. You earned every XP.',
  ],
  course_halfway: [
    'Halfway through. The second half is where it gets real.',
    '50% down. The interesting stuff is ahead.',
    'Half the course behind you. Keep the momentum.',
  ],
  high_progress: [
    'Crushing it today.',
    'Momentum is real. You have it.',
    'Big day. Keep going.',
    'On pace to blow past your goal.',
  ],
  streak_high: [
    '{streak} days strong. Don\'t stop now.',
    'Consistency compounds. Keep showing up.',
    '{streak}-day streak. That\'s discipline.',
    'Day {streak}. The habit is forming.',
    '{streak} days in a row. Most people quit by now.',
  ],
  streak_start: [
    'Streak started. Come back tomorrow.',
    'Day {streak}. Build the habit.',
    'Two days in. Three is where it counts.',
  ],
  zero_progress: [
    'Every expert was once a beginner.',
    'One lesson. That\'s all it takes to start.',
    'The hardest part is opening the app. You did that.',
    'Start small. Start now.',
    'No progress yet today. Change that.',
  ],
  morning: [
    'Fresh start. Let\'s build something.',
    'Morning sessions hit different. Dive in.',
    'Early hours, clear mind. Good time to learn.',
    'Morning. Coffee and code.',
  ],
  afternoon: [
    'Afternoon push. Make it count.',
    'Post-lunch focus. Channel it.',
    'Solid time to knock out a lesson.',
  ],
  evening: [
    'Evening grind. Respect.',
    'The best work happens when no one\'s watching.',
    'Quiet hours. Deep focus.',
    'Evening session. No distractions.',
  ],
  night: [
    'Late night learning. Dedicated.',
    'Night owl mode. Let\'s go.',
    'The world sleeps. You level up.',
  ],
  default: [
    'Show up. Do the work.',
    'Progress over perfection.',
    'One lesson closer to mastery.',
    'Small steps, big results.',
    'Keep building.',
  ],
}

function pickMessage(category: string, context: MotivationalContext): string {
  const pool = MESSAGES[category]
  if (!pool || pool.length === 0) return 'Keep going.'

  // Get last shown to avoid repeats
  let lastMessage: string | null = null
  try {
    lastMessage = localStorage.getItem(LAST_MESSAGE_KEY)
  } catch {}

  // Filter out last shown message
  const candidates = pool.length > 1
    ? pool.filter((m) => m !== lastMessage)
    : pool

  // Deterministic-ish pick based on date + XP so it doesn't flicker on re-render
  // but changes across sessions
  const seed = new Date().toISOString().split('T')[0] + context.totalXp
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }
  const index = Math.abs(hash) % candidates.length
  const selected = candidates[index]

  // Persist last shown
  try {
    localStorage.setItem(LAST_MESSAGE_KEY, selected)
  } catch {}

  // Interpolate variables
  return selected
    .replace('{streak}', String(context.currentStreak))
    .replace('{remaining}', String(context.xpToNextRank ?? 0))
    .replace('{nextRank}', context.nextRank ?? 'max rank')
}

export function getMotivationalMessage(context: MotivationalContext): MotivationalMessage {
  const timeOfDay = getTimeOfDay()
  const progressPercent = context.totalLessons > 0
    ? Math.round((context.lessonsCompleted / context.totalLessons) * 100)
    : 0
  const dailyProgressPercent = context.dailyXpGoal > 0
    ? (context.dailyXpEarned / context.dailyXpGoal) * 100
    : 0

  // Priority order: most specific context wins

  // 1. Course complete
  if (progressPercent === 100) {
    return { message: pickMessage('course_complete', context) }
  }

  // 2. Near level-up (within 20 XP)
  if (context.xpToNextRank !== null && context.xpToNextRank <= 20 && context.xpToNextRank > 0) {
    return { message: pickMessage('near_level_up', context) }
  }

  // 3. High daily progress (> 80% of goal)
  if (context.dailyXpEarned > 0 && dailyProgressPercent > 80) {
    return { message: pickMessage('high_progress', context) }
  }

  // 4. Course halfway (45-55% range)
  if (progressPercent >= 45 && progressPercent <= 55) {
    return { message: pickMessage('course_halfway', context) }
  }

  // 5. Strong streak (3+ days)
  if (context.currentStreak >= 3) {
    return { message: pickMessage('streak_high', context) }
  }

  // 6. Early streak (1-2 days)
  if (context.currentStreak >= 1 && context.currentStreak < 3) {
    return { message: pickMessage('streak_start', context) }
  }

  // 7. Zero progress today
  if (context.dailyXpEarned === 0) {
    return { message: pickMessage('zero_progress', context) }
  }

  // 8. Time-of-day fallback
  if (MESSAGES[timeOfDay]) {
    return { message: pickMessage(timeOfDay, context) }
  }

  // 9. Default
  return { message: pickMessage('default', context) }
}
