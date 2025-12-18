import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import router from './routes'
import PageLoading from './components/page-loading'

// Initialize i18n (must be imported before components)
import '@/lib/i18n'

// Import variable fonts (one file per family instead of multiple weight files)
// Geist Variable: all weights (400-700) in a single file
// Geist Mono Variable: all weights (400-700) in a single file
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'

// Import global styles (must be after fonts)
import './globals.css'

// biome-ignore lint/style/noNonNullAssertion: root element always exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={<PageLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
)

