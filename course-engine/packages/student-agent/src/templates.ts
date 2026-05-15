export type TemplateCategory =
  | 'lesson_complete'
  | 'struggle'
  | 'question'
  | 'celebrate_other'
  | 'streak'
  | 'capstone'
  | 'general_chat'
  | 'reaction'

export interface MessageTemplate {
  id: string
  category: TemplateCategory
  text: string
  channel: string
  weight: number
}

let _id = 0
function t(category: TemplateCategory, text: string, channel: string, weight = 1): MessageTemplate {
  return { id: `t${++_id}`, category, text, channel, weight }
}

export const TEMPLATES: MessageTemplate[] = [
  // ── lesson_complete (general) ──
  t('lesson_complete', 'Just finished {lesson_number} {lesson_title}! The part about {tools} was really interesting', 'general'),
  t('lesson_complete', 'Another one done — {lesson_number} {lesson_title} ✓ +{xp}xp', 'general'),
  t('lesson_complete', '{lesson_number} complete. Took me a bit longer than expected but I feel solid on it now', 'general'),
  t('lesson_complete', 'Done with {lesson_title}! The {tools} section clicked for me', 'general'),
  t('lesson_complete', '{lesson_number} ✅ — really liked the hands-on exercises in this one', 'general'),
  t('lesson_complete', 'Just wrapped up {lesson_title}. Up to {total_xp} XP now!', 'general'),
  t('lesson_complete', 'Finished {lesson_number}! {tools} is more powerful than I expected', 'general'),
  t('lesson_complete', '{lesson_title} — done! Building momentum through {tier_name}', 'general'),

  // ── struggle (help) ──
  t('struggle', 'Anyone else finding {lesson_title} tricky? The {tools} part is confusing me', 'help'),
  t('struggle', 'Stuck on {lesson_number} — how do you actually use {tools} in practice?', 'help'),
  t('struggle', 'I keep re-reading the {tools} section in {lesson_number}. Not sure I get it yet', 'help'),
  t('struggle', 'The examples in {lesson_title} make sense but I can\'t replicate them on my own', 'help'),
  t('struggle', 'Is {lesson_number} supposed to be this hard or am I missing something?', 'help'),
  t('struggle', 'Had to take a break from {lesson_title}. Coming back to it tomorrow with fresh eyes', 'help'),

  // ── question (help) ──
  t('question', 'Quick question about {tools} from {lesson_number} — does it work the same way with larger inputs?', 'help'),
  t('question', 'In {lesson_title}, when they mention {tools}, is that the same as what we saw earlier?', 'help'),
  t('question', 'Can someone explain the difference between the two approaches in {lesson_number}?', 'help'),
  t('question', 'After {lesson_title}, should I practice {tools} more before moving on?', 'help'),
  t('question', 'How long did {lesson_number} take everyone else? I feel like I\'m slow', 'help'),
  t('question', 'Does the {tools} technique from {lesson_title} scale to real projects?', 'help'),

  // ── celebrate_other (general) ──
  t('celebrate_other', 'Nice work! That lesson is a good one', 'general'),
  t('celebrate_other', 'Congrats on finishing that! Keep the momentum going', 'general'),
  t('celebrate_other', 'That\'s awesome — I remember that one being really insightful', 'general'),
  t('celebrate_other', 'Great progress! You\'re flying through it', 'general'),
  t('celebrate_other', 'Welcome to the next section! It keeps getting better', 'general'),
  t('celebrate_other', 'That one\'s a milestone. Well done!', 'general'),

  // ── streak (general) ──
  t('streak', '{streak_days}-day streak! Trying to keep it going 💪', 'general'),
  t('streak', 'Made it to {streak_days} days in a row. Consistency is key', 'general'),
  t('streak', '{streak_days} days and counting. Who else is on a streak?', 'general'),
  t('streak', 'Day {streak_days} of learning — this habit is sticking', 'general'),

  // ── capstone (general, showcase) ──
  t('capstone', 'Just wrapped up the {tier_name} capstone! Big milestone 🎉', 'general'),
  t('capstone', 'Finished the {tier_name} section! The capstone project really tied everything together', 'showcase'),
  t('capstone', '{tier_name} capstone done — that was intense but worth it', 'general'),
  t('capstone', 'Major milestone: completed all of {tier_name}! On to the next section', 'showcase'),

  // ── general_chat (general, off-topic) ──
  t('general_chat', 'How\'s everyone doing today? I\'m trying to knock out at least 2 lessons', 'general'),
  t('general_chat', 'Taking a quick break. This course is intense but I\'m learning so much', 'general'),
  t('general_chat', 'Morning study session! Ready to tackle {tier_name}', 'general'),
  t('general_chat', 'Anyone working through {tier_name} this week?', 'general'),
  t('general_chat', 'The practical examples in this course are really what sets it apart', 'general'),
  t('general_chat', 'Love that this course makes you actually build stuff, not just watch', 'off-topic'),
  t('general_chat', 'Late night coding session — who else is a night owl learner?', 'off-topic'),
  t('general_chat', 'Just realized I\'ve been at this for 2 hours straight. Time flies', 'off-topic'),
  t('general_chat', 'Coffee and Claude — name a better combo', 'off-topic'),
  t('general_chat', 'Happy to be part of this community. Everyone\'s so helpful here', 'general'),

  // ── reaction (contextual) ──
  t('reaction', 'Same here!', 'general'),
  t('reaction', 'Good point — I hadn\'t thought of it that way', 'general'),
  t('reaction', 'I had that exact same issue. It gets clearer later on', 'help'),
  t('reaction', 'Totally agree. That section was really well done', 'general'),
  t('reaction', 'This ^^', 'general'),
  t('reaction', 'Ha, I feel that. Keep going though — it\'s worth it', 'general'),
]

export function getTemplatesByCategory(category: TemplateCategory): MessageTemplate[] {
  return TEMPLATES.filter((t) => t.category === category)
}
