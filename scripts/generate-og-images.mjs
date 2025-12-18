/**
 * OG Image Generator for Charles Jackson Portfolio
 *
 * Uses Playwright to render HTML templates and capture as PNG images.
 * Run with: node scripts/generate-og-images.mjs
 */

import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// OG Image dimensions (standard)
const WIDTH = 1200;
const HEIGHT = 630;

// Design tokens matching the site's aesthetic
const theme = {
  background: '#09090b',
  foreground: '#fafafa',
  muted: '#71717a',
  border: 'rgba(250, 250, 250, 0.08)',
  gridLine: 'rgba(250, 250, 250, 0.03)',
  accent: 'rgba(250, 250, 250, 0.05)',
};

// Geist font CSS
const fontCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${theme.background};
    color: ${theme.foreground};
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    position: relative;
  }

  .container {
    width: 100%;
    height: 100%;
    padding: 64px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  /* Grid background pattern */
  .grid-pattern {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      linear-gradient(to right, ${theme.gridLine} 1px, transparent 1px),
      linear-gradient(to bottom, ${theme.gridLine} 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Gradient overlay */
  .gradient-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: radial-gradient(ellipse at 30% 20%, rgba(250, 250, 250, 0.03) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(250, 250, 250, 0.02) 0%, transparent 50%);
  }

  /* Corner markers */
  .corner-marker {
    position: absolute;
    width: 24px;
    height: 24px;
    z-index: 3;
  }

  .corner-marker::before,
  .corner-marker::after {
    content: '';
    position: absolute;
    background: ${theme.border};
  }

  .corner-marker.top-left { top: 48px; left: 48px; }
  .corner-marker.top-right { top: 48px; right: 48px; }
  .corner-marker.bottom-left { bottom: 48px; left: 48px; }
  .corner-marker.bottom-right { bottom: 48px; right: 48px; }

  .corner-marker.top-left::before,
  .corner-marker.bottom-left::before { width: 1px; height: 24px; left: 0; }
  .corner-marker.top-left::after,
  .corner-marker.top-right::after { height: 1px; width: 24px; top: 0; }
  .corner-marker.top-right::before,
  .corner-marker.bottom-right::before { width: 1px; height: 24px; right: 0; }
  .corner-marker.bottom-left::after,
  .corner-marker.bottom-right::after { height: 1px; width: 24px; bottom: 0; }

  .corner-marker.top-left::before { top: 0; }
  .corner-marker.top-left::after { left: 0; }
  .corner-marker.top-right::before { top: 0; }
  .corner-marker.top-right::after { right: 0; }
  .corner-marker.bottom-left::before { bottom: 0; }
  .corner-marker.bottom-left::after { left: 0; }
  .corner-marker.bottom-right::before { bottom: 0; }
  .corner-marker.bottom-right::after { right: 0; }

  .name {
    font-size: 64px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
    background: linear-gradient(to right, ${theme.foreground}, rgba(250, 250, 250, 0.8));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-title {
    font-size: 32px;
    font-weight: 600;
    color: ${theme.muted};
    margin-bottom: 8px;
  }

  .description {
    font-size: 24px;
    color: ${theme.muted};
    max-width: 700px;
    line-height: 1.4;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: ${theme.accent};
    border: 1px solid ${theme.border};
    border-radius: 999px;
    font-size: 14px;
    font-weight: 500;
    color: ${theme.muted};
    margin-bottom: 24px;
  }

  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .url {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 18px;
    color: ${theme.muted};
    letter-spacing: 0.02em;
  }

  .tech-badges {
    display: flex;
    gap: 12px;
  }

  .tech-badge {
    padding: 8px 16px;
    background: ${theme.accent};
    border: 1px solid ${theme.border};
    border-radius: 999px;
    font-size: 14px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: rgba(250, 250, 250, 0.6);
  }

  .stats {
    display: flex;
    gap: 48px;
    margin-top: 32px;
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 48px;
    font-weight: 700;
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: ${theme.foreground};
  }

  .stat-label {
    font-size: 14px;
    color: ${theme.muted};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .decorative-lines {
    position: absolute;
    right: 64px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }

  .decorative-lines .line {
    width: 200px;
    height: 1px;
    background: linear-gradient(to right, transparent, ${theme.border}, transparent);
    margin: 24px 0;
  }
`;

// Page configurations
const pages = [
  {
    id: 'home',
    filename: 'og-image.png', // Default OG image
    title: 'Full Stack Developer',
    badge: 'Shipping code',
    description: 'Building intelligent systems, beautiful interfaces, and scalable platforms',
    techs: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    showStats: true,
    stats: [
      { value: '20+', label: 'Years' },
      { value: '50+', label: 'Projects' },
      { value: '100%', label: 'TypeScript' },
    ],
  },
  {
    id: 'about',
    filename: 'og-about.png',
    title: 'About',
    badge: '20+ Years Experience',
    description: 'Full-stack developer building software since 2005. From startup founder to enterprise architect.',
    techs: ['React', 'Python', 'PostgreSQL', 'AWS'],
    showStats: false,
  },
  {
    id: 'projects',
    filename: 'og-projects.png',
    title: 'Projects',
    badge: 'Project Portfolio',
    description: 'Deep dives into complex systems - AI platforms, urban agriculture tech, and browser metaverses',
    techs: ['Predictive', 'MyUrbanFarm.ai', 'World'],
    showStats: false,
  },
  {
    id: 'blog',
    filename: 'og-blog.png',
    title: 'Technical Blog',
    badge: 'Thoughts on Building Software',
    description: 'Architecture decisions, performance optimization, and lessons from shipping production code',
    techs: ['Architecture', 'Performance', 'TypeScript'],
    showStats: false,
  },
  {
    id: 'art',
    filename: 'og-art.png',
    title: 'Visual Experiments',
    badge: 'Creative Code',
    description: 'Generative art, shaders, and interactive visuals at the intersection of code and creativity',
    techs: ['Three.js', 'WebGL', 'GLSL', 'Canvas'],
    showStats: false,
  },
  {
    id: 'interests',
    filename: 'og-interests.png',
    title: 'Mathematical Modeling',
    badge: 'Using Math to Predict the Future',
    description: 'Monte Carlo simulations, transformer architectures, Bayesian inference, and machine learning',
    techs: ['Monte Carlo', 'Transformers', 'NLP', 'Bayesian'],
    showStats: false,
  },
  {
    id: 'contact',
    filename: 'og-contact.png',
    title: 'Get in Touch',
    badge: 'Available for Projects',
    description: 'Open to side projects, consulting, and interesting collaborations worldwide',
    techs: ['Consulting', 'MVP Development', 'Architecture'],
    showStats: false,
  },
];

function generateHTML(page) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${fontCSS}</style>
    </head>
    <body>
      <div class="grid-pattern"></div>
      <div class="gradient-overlay"></div>

      <div class="corner-marker top-left"></div>
      <div class="corner-marker top-right"></div>
      <div class="corner-marker bottom-left"></div>
      <div class="corner-marker bottom-right"></div>

      <div class="container">
        <div class="content">
          <div class="badge">
            <span class="dot"></span>
            ${page.badge}
          </div>

          <h1 class="name">Charles Jackson</h1>
          <h2 class="page-title">${page.title}</h2>
          <p class="description">${page.description}</p>

          ${page.showStats ? `
            <div class="stats">
              ${page.stats.map(stat => `
                <div class="stat">
                  <span class="stat-value">${stat.value}</span>
                  <span class="stat-label">${stat.label}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <span class="url">shaolincharles.dev${page.id !== 'home' ? '/' + page.id : ''}</span>
          <div class="tech-badges">
            ${page.techs.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="decorative-lines">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </body>
    </html>
  `;
}

async function generateOGImages() {
  console.log('🎨 Starting OG Image Generation...\n');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2, // 2x for retina quality
  });

  for (const page of pages) {
    const html = generateHTML(page);
    const browserPage = await context.newPage();

    await browserPage.setContent(html, { waitUntil: 'networkidle' });

    // Wait for fonts to load
    await browserPage.waitForTimeout(500);

    const screenshot = await browserPage.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    const outputPath = join(publicDir, page.filename);
    await writeFile(outputPath, screenshot);

    console.log(`✅ Generated: ${page.filename}`);

    await browserPage.close();
  }

  await browser.close();

  console.log('\n🎉 All OG images generated successfully!');
  console.log(`📁 Output directory: ${publicDir}`);
}

// Run the generator
generateOGImages().catch(console.error);
