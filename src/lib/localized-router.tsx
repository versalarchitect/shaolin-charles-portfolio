import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  useNavigate as useRouterNavigate,
  useParams,
  useLocation,
  type LinkProps,
  type NavigateProps,
} from 'react-router-dom'
import { forwardRef } from 'react'

export const SUPPORTED_LANGS = ['en', 'fr'] as const
export type SupportedLang = (typeof SUPPORTED_LANGS)[number]
export const DEFAULT_LANG: SupportedLang = 'fr'

export function useLang(): SupportedLang {
  const { lang } = useParams<{ lang: string }>()
  if (lang && SUPPORTED_LANGS.includes(lang as SupportedLang)) return lang as SupportedLang
  return DEFAULT_LANG
}

export function useLocalizedPathname(): string {
  const { pathname } = useLocation()
  const match = pathname.match(/^\/(en|fr)(\/.*)?$/)
  return match ? match[2] || '/' : pathname
}

export function localizePath(to: string, lang: string): string {
  if (!to || to === '#' || to.startsWith('http') || to.startsWith('mailto:')) return to
  if (!to.startsWith('/')) return to

  const qIdx = to.indexOf('?')
  const hIdx = to.indexOf('#')
  const splitIdx = qIdx >= 0 ? (hIdx >= 0 ? Math.min(qIdx, hIdx) : qIdx) : hIdx
  const path = splitIdx >= 0 ? to.slice(0, splitIdx) : to

  if (/^\/(en|fr)(\/|$)/.test(path)) return to

  if (path === '/') return `/${lang}${splitIdx >= 0 ? to.slice(splitIdx) : ''}`
  return `/${lang}${to}`
}

export function switchLangInPath(pathname: string, newLang: string): string {
  const match = pathname.match(/^\/(en|fr)(\/.*)?$/)
  if (match) return `/${newLang}${match[2] || ''}`
  return `/${newLang}${pathname}`
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...props }, ref) => {
  const lang = useLang()
  const localizedTo = typeof to === 'string' ? localizePath(to, lang) : to
  return <RouterLink ref={ref} to={localizedTo} {...props} />
})
Link.displayName = 'Link'

export function useNavigate() {
  const nav = useRouterNavigate()
  const lang = useLang()
  return (to: string | number, options?: { replace?: boolean; state?: unknown }) => {
    if (typeof to === 'number') return nav(to)
    return nav(localizePath(to, lang), options)
  }
}

export function Navigate({ to, ...props }: NavigateProps) {
  const lang = useLang()
  const localizedTo = typeof to === 'string' ? localizePath(to, lang) : to
  return <RouterNavigate to={localizedTo} {...props} />
}
