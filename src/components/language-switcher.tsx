import { useNavigate as useRouterNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { useLang, switchLangInPath, SUPPORTED_LANGS, type SupportedLang } from '@/lib/localized-router'

const languages: { code: SupportedLang; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'fr', name: 'Français', flag: '\u{1F1EB}\u{1F1F7}' },
]

export function LanguageSwitcher({ align = 'right', direction = 'down' }: { align?: 'left' | 'right'; direction?: 'up' | 'down' }) {
  const currentLang = useLang()
  const navigate = useRouterNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (code: SupportedLang) => {
    if (code !== currentLang) {
      const newPath = switchLangInPath(location.pathname, code)
      navigate(newPath + location.search + location.hash, { replace: true })
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        aria-label={`Change language, current: ${currentLangObj.name}`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-mono uppercase">{currentLangObj.code}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute w-40 rounded-lg border border-border bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden z-50 ${align === 'left' ? 'left-0' : 'right-0'} ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${
                    currentLang === lang.code
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {currentLang === lang.code && (
                  <Check className="h-4 w-4 text-foreground" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
