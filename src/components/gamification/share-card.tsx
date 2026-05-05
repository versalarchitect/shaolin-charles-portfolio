import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, Link2, Check, Loader2 } from 'lucide-react'
import { generateShareCard, downloadShareCard, shareCard, type ShareCardData } from '@/lib/share-card'
import { useProgress, getLevel, getOverallProgress, getActiveTitle } from '@/stores/progress'
import { ACHIEVEMENTS, ALL_LESSONS } from '@/data/curriculum'

interface ShareCardProps {
  onClose?: () => void
}

export function ShareCard({ onClose }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobRef = useRef<Blob | null>(null)
  const progress = useProgress()
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const cardData: ShareCardData = {
    displayName: 'Student',
    rank: getLevel().name,
    totalXp: progress.totalXp,
    currentStreak: progress.currentStreak,
    lessonsCompleted: Object.values(progress.lessonProgress).filter((p) => p.status === 'completed').length,
    totalLessons: ALL_LESSONS.length,
    achievementsEarned: progress.unlockedAchievements.length,
    totalAchievements: ACHIEVEMENTS.length,
    activeTitle: getActiveTitle().name,
  }

  const renderCard = useCallback(async () => {
    setLoading(true)
    try {
      const blob = await generateShareCard(cardData)
      blobRef.current = blob

      // Render to visible canvas for preview
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
            ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height)
            setLoading(false)
          }
          img.src = URL.createObjectURL(blob)
        }
      }
    } catch {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.totalXp, progress.currentStreak, progress.unlockedAchievements.length, progress.activeTitle])

  useEffect(() => {
    renderCard()
  }, [renderCard])

  const handleDownload = () => {
    if (blobRef.current) {
      downloadShareCard(blobRef.current)
    }
  }

  const handleShare = async () => {
    if (!blobRef.current) return
    const success = await shareCard(blobRef.current, `My progress on charlesjackson.dev — ${cardData.rank} rank`)
    if (success) {
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://charlesjackson.dev/self-updating-course')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silent fail
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl rounded-2xl border border-foreground/[0.08] bg-background p-6 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Share Your Progress</h2>
              <p className="text-xs font-mono text-foreground/40">Download or share your achievement card</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Canvas Preview */}
          <div className="relative rounded-xl overflow-hidden border border-foreground/[0.08] bg-foreground/[0.02] mb-4">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={1200}
              height={630}
              className="w-full h-auto"
              style={{ aspectRatio: '1200/630' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-foreground/5 border border-foreground/10 text-sm font-mono text-foreground/80 hover:bg-foreground/10 hover:border-foreground/20 transition-all disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleShare}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg bg-foreground text-background text-sm font-mono font-semibold hover:bg-foreground/90 transition-all disabled:opacity-40"
            >
              {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shared ? 'Shared!' : 'Share'}
            </button>
            <button
              onClick={handleCopyLink}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-foreground/5 border border-foreground/10 text-sm font-mono text-foreground/80 hover:bg-foreground/10 hover:border-foreground/20 transition-all disabled:opacity-40"
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
