import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import i18n from '@/lib/i18n'
import { SUPPORTED_LANGS, DEFAULT_LANG, type SupportedLang } from '@/lib/localized-router'
import { Navigate } from '@/lib/localized-router'

export function LanguageLayout() {
  const { lang } = useParams<{ lang: string }>()
  const validLang = SUPPORTED_LANGS.includes(lang as SupportedLang) ? (lang as SupportedLang) : DEFAULT_LANG

  useEffect(() => {
    if (i18n.language !== validLang) {
      i18n.changeLanguage(validLang)
    }
    document.documentElement.lang = validLang
  }, [validLang])

  if (!SUPPORTED_LANGS.includes(lang as SupportedLang)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
