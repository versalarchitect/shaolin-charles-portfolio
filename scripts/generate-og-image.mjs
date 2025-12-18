import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateOGImage() {
  console.log('Launching browser...')
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Set viewport to OG image dimensions
  await page.setViewportSize({ width: 1200, height: 630 })

  // Load the HTML file
  const htmlPath = join(__dirname, 'og-image.html')
  console.log(`Loading ${htmlPath}...`)
  await page.goto(`file://${htmlPath}`)

  // Wait for fonts to load
  await page.waitForTimeout(1000)

  // Take screenshot
  const outputPath = join(__dirname, '..', 'public', 'og-image.png')
  console.log(`Saving screenshot to ${outputPath}...`)
  await page.screenshot({
    path: outputPath,
    type: 'png',
  })

  await browser.close()
  console.log('Done! OG image generated at public/og-image.png')
}

generateOGImage().catch(console.error)
