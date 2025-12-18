// Monochromatic palette for generative art
// Following CLAUDE.md design system: "Sophistication is in subtlety"

export const PALETTE = {
  // Backgrounds
  bg: '#0a0a0a',
  bgSubtle: '#111111',

  // Strokes/particles at various opacities
  stroke: (alpha: number) => `rgba(255, 255, 255, ${alpha})`,

  // Accent (very subtle warmth for artistic interest)
  accent: (alpha: number) => `rgba(200, 200, 210, ${alpha})`,

  // Depth layers - from barely visible to prominent
  layers: [
    'rgba(255, 255, 255, 0.02)',
    'rgba(255, 255, 255, 0.05)',
    'rgba(255, 255, 255, 0.08)',
    'rgba(255, 255, 255, 0.12)',
    'rgba(255, 255, 255, 0.20)',
  ] as const,
}

// RGB values for p5.js color functions
export const RGB = {
  white: [255, 255, 255] as const,
  bg: [10, 10, 10] as const,
  bgSubtle: [17, 17, 17] as const,
}
