import puppeteer from 'puppeteer'
import { createServer } from 'http'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const routes = [
  '/',
  '/curriculum',
  '/principles',
  '/tiers',
  '/instructor',
  '/about',
  '/projects',
  '/blog',
  '/contact',
]

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

function startServer(port) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(distDir, req.url === '/' ? '/index.html' : req.url)

      if (!existsSync(filePath)) {
        filePath = join(distDir, 'index.html')
      }

      try {
        const content = readFileSync(filePath)
        const ext = '.' + filePath.split('.').pop()
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
        res.end(content)
      } catch {
        const content = readFileSync(join(distDir, 'index.html'))
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(content)
      }
    })

    server.listen(port, () => resolve(server))
  })
}

async function prerender() {
  const port = 4173
  const server = await startServer(port)
  console.log(`  Static server on http://localhost:${port}`)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const route of routes) {
    const page = await browser.newPage()

    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0', timeout: 15000 })

    // Wait for prerender-ready event or timeout
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.querySelector('main')) {
          resolve(true)
          return
        }
        document.addEventListener('prerender-ready', () => resolve(true))
        setTimeout(() => resolve(true), 5000)
      })
    })

    // Give animations a moment to settle
    await new Promise((r) => setTimeout(r, 1000))

    const html = await page.content()
    await page.close()

    const outPath = route === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.slice(1), 'index.html')

    const outDir = dirname(outPath)
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
    }

    writeFileSync(outPath, html)
    console.log(`  Prerendered: ${route} -> ${outPath.replace(distDir, 'dist')}`)
  }

  await browser.close()
  server.close()
  console.log(`  Done — ${routes.length} routes prerendered`)
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
