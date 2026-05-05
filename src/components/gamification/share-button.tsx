import { useEffect, useState } from 'react'
import { Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShareCard } from './share-card'

export function ShareButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onOpenShareCard() {
      setOpen(true)
    }
    window.addEventListener('open-share-card', onOpenShareCard)
    return () => window.removeEventListener('open-share-card', onOpenShareCard)
  }, [])

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-9 h-9 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/20 hover:bg-foreground/10 transition-all"
        title="Share your progress"
      >
        <Share2 className="w-4 h-4" />
      </motion.button>

      {open && <ShareCard onClose={() => setOpen(false)} />}
    </>
  )
}
