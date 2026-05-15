import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'motion/react'
import { Star } from 'lucide-react'
import { useRatings, getRating, setRating } from '@/stores/ratings'
import { awardExplorerXp } from '@/stores/progress'

const DIFFICULTY_LABELS = ['Easy', 'Moderate', 'Medium', 'Challenging', 'Hard'] as const

interface LessonRatingProps {
  lessonId: string
}

function StarButton({ filled, hovered, onClick, onHover, onLeave }: {
  filled: boolean
  hovered: boolean
  onClick: () => void
  onHover: () => void
  onLeave: () => void
}) {
  const { t } = useTranslation()
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.85 }}
      className="p-0.5 transition-colors"
      aria-label={t('lessonRating.rate')}
    >
      <Star
        className={`w-5 h-5 transition-colors duration-150 ${
          filled || hovered
            ? 'fill-foreground/70 text-foreground/70'
            : 'fill-transparent text-foreground/30'
        }`}
      />
    </motion.button>
  )
}

export function LessonRating({ lessonId }: LessonRatingProps) {
  const { t } = useTranslation()
  useRatings()
  const existing = getRating(lessonId)

  const [selectedRating, setSelectedRating] = useState<number>(existing?.rating ?? 0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(existing?.difficulty ?? 0)
  const [submitted, setSubmitted] = useState(!!existing)

  function handleSubmit(rating: number, difficulty: number) {
    if (rating < 1 || rating > 5 || difficulty < 1 || difficulty > 5) return
    setRating(lessonId, difficulty as 1 | 2 | 3 | 4 | 5, rating as 1 | 2 | 3 | 4 | 5)
    awardExplorerXp(3, `rating-${lessonId}`)
    setSubmitted(true)
  }

  function handleStarClick(star: number) {
    setSelectedRating(star)
    if (selectedDifficulty > 0) {
      handleSubmit(star, selectedDifficulty)
    }
  }

  function handleDifficultyClick(level: number) {
    setSelectedDifficulty(level)
    if (selectedRating > 0) {
      handleSubmit(selectedRating, level)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-5"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-2"
          >
            <p className="text-sm font-mono text-foreground/60">
              {t('lessonRating.thanks')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-sm font-medium text-foreground/70">
              {t('lessonRating.howWas')}
            </p>

            {/* Star rating */}
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-foreground/40">{t('lessonRating.rating')}</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    filled={star <= selectedRating}
                    hovered={star <= hoveredRating}
                    onClick={() => handleStarClick(star)}
                    onHover={() => setHoveredRating(star)}
                    onLeave={() => setHoveredRating(0)}
                  />
                ))}
                {selectedRating > 0 && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-2 text-xs font-mono text-foreground/40"
                  >
                    {selectedRating}/5
                  </motion.span>
                )}
              </div>
            </div>

            {/* Difficulty selector */}
            <div className="space-y-1.5">
              <p className="text-xs font-mono text-foreground/40">{t('lessonRating.difficulty')}</p>
              <div className="flex items-center gap-1.5">
                {DIFFICULTY_LABELS.map((label, i) => {
                  const level = i + 1
                  const isSelected = selectedDifficulty === level
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleDifficultyClick(level)}
                      className={`text-xs font-mono px-2.5 py-1.5 rounded border transition-all ${
                        isSelected
                          ? 'bg-foreground/10 border-foreground/20 text-foreground/80'
                          : 'bg-foreground/[0.03] border-foreground/[0.08] text-foreground/40 hover:bg-foreground/[0.06] hover:border-foreground/15 hover:text-foreground/60'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
