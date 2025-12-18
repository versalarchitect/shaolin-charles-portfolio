import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
]

async function generateFavicons() {
  console.log('Launching browser...')
  const browser = await chromium.launch()

  for (const { name, size } of sizes) {
    const page = await browser.newPage()
    await page.setViewportSize({ width: size, height: size })

    // Create an HTML page with the favicon design
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; }
          body {
            width: ${size}px;
            height: ${size}px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #09090b;
            border-radius: ${Math.round(size * 0.1875)}px;
          }
          .text {
            color: white;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 600;
            font-size: ${Math.round(size * 0.4375)}px;
          }
        </style>
      </head>
      <body>
        <span class="text">CJ</span>
      </body>
      </html>
    `

    await page.setContent(html)

    const outputPath = join(__dirname, '..', 'public', name)
    console.log(`Generating ${name} (${size}x${size})...`)

    await page.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: false,
    })

    await page.close()
  }

  await browser.close()
  console.log('Done! All favicons generated.')
}

generateFavicons().catch(console.error)
