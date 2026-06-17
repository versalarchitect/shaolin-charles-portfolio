import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'
type Resolved = 'light' | 'dark'

const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: Resolved
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const getSystem = (): Resolved =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const readStored = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'dark' || v === 'light' || v === 'system' ? v : 'light' // default: LIGHT
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStored)
  const [resolvedTheme, setResolved] = useState<Resolved>(() =>
    theme === 'system' ? getSystem() : theme,
  )

  // Apply resolved theme to <html> + persist + sync mobile chrome colour.
  useEffect(() => {
    const resolved = theme === 'system' ? getSystem() : theme
    setResolved(resolved)
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Follow the OS when in "system" mode.
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const resolved = getSystem()
      setResolved(resolved)
      document.documentElement.classList.toggle('dark', resolved === 'dark')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggle = useCallback(
    () =>
      setThemeState((prev) =>
        (prev === 'system' ? getSystem() : prev) === 'dark' ? 'light' : 'dark',
      ),
    [],
  )

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggle }),
    [theme, resolvedTheme, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
