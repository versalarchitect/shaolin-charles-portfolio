import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { inject as injectAnalytics } from '@vercel/analytics'
import router from './routes'
import PageLoading from './components/page-loading'

injectAnalytics()

// Initialize i18n (must be imported before components)
import '@/lib/i18n'

// Import variable fonts (one file per family instead of multiple weight files)
// Geist Variable: all weights (400-700) in a single file
// Geist Mono Variable: all weights (400-700) in a single file
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import '@fontsource-variable/inter'

// Import global styles (must be after fonts)
import './globals.css'

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<PageLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
)

// biome-ignore lint/style/noNonNullAssertion: root element always exists
const root = document.getElementById('root')!
const isPrerendered = root.childElementCount > 0

if (isPrerendered) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}

requestAnimationFrame(() => {
  const shell = document.getElementById('app-shell')
  if (shell) {
    shell.style.opacity = '0'
    shell.addEventListener('transitionend', () => shell.remove(), { once: true })
  }
})

