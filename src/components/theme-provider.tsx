import { createContext, useContext, useEffect } from 'react'

type Theme = 'dark'

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeProviderState {
  theme: Theme
  resolvedTheme: 'dark'
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  resolvedTheme: 'dark',
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Always force dark mode
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light')
    root.classList.add('dark')
  }, [])

  const value: ThemeProviderState = {
    theme: 'dark',
    resolvedTheme: 'dark',
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
