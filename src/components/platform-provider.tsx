import { createContext, useContext, useEffect, useState } from 'react'
import type { Platform } from '@/data/lessons/types'

export type { Platform }

interface PlatformProviderProps {
  children: React.ReactNode
  storageKey?: string
}

interface PlatformProviderState {
  platform: Platform
  setPlatform: (platform: Platform) => void
}

const PlatformProviderContext = createContext<PlatformProviderState | undefined>(undefined)

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'macos'
  const ua = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platformStr = ua.userAgentData?.platform ?? navigator.platform ?? ''
  if (/^Win/i.test(platformStr)) return 'windows'
  if (/^Mac/i.test(platformStr)) return 'macos'
  return 'linux'
}

export function PlatformProvider({
  children,
  storageKey = 'platform-preference',
}: PlatformProviderProps) {
  const [platform, setPlatformState] = useState<Platform>(() => {
    if (typeof window === 'undefined') return 'macos'
    const stored = localStorage.getItem(storageKey) as Platform | null
    if (stored && ['macos', 'windows', 'linux'].includes(stored)) return stored
    return detectPlatform()
  })

  useEffect(() => {
    localStorage.setItem(storageKey, platform)
  }, [platform, storageKey])

  const setPlatform = (newPlatform: Platform) => {
    setPlatformState(newPlatform)
  }

  return (
    <PlatformProviderContext.Provider value={{ platform, setPlatform }}>
      {children}
    </PlatformProviderContext.Provider>
  )
}

export const usePlatform = () => {
  const context = useContext(PlatformProviderContext)
  if (context === undefined)
    throw new Error('usePlatform must be used within a PlatformProvider')
  return context
}
