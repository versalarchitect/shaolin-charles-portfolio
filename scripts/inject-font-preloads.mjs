import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const distDir = join(import.meta.dirname, '..', 'dist')
const fontsDir = join(distDir, 'assets', 'fonts')
const htmlPath = join(distDir, 'index.html')

const targetFonts = ['geist-latin-wght-normal', 'geist-mono-latin-wght-normal']

const fontFiles = readdirSync(fontsDir).filter(
  (f) => f.endsWith('.woff2') && targetFonts.some((t) => f.startsWith(t))
)

const preloadTags = fontFiles
  .map(
    (f) =>
      `    <link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`
  )
  .join('\n')

let html = readFileSync(htmlPath, 'utf-8')
html = html.replace('</head>', `${preloadTags}\n  </head>`)
writeFileSync(htmlPath, html)

console.log(`Injected ${fontFiles.length} font preload(s)`)
