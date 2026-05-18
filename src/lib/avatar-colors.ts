const PALETTES = [
  { bg: 'bg-rose-500/30', text: 'text-rose-200' },
  { bg: 'bg-violet-500/30', text: 'text-violet-200' },
  { bg: 'bg-blue-500/30', text: 'text-blue-200' },
  { bg: 'bg-emerald-500/30', text: 'text-emerald-200' },
  { bg: 'bg-amber-500/30', text: 'text-amber-200' },
  { bg: 'bg-sky-500/30', text: 'text-sky-200' },
  { bg: 'bg-fuchsia-500/30', text: 'text-fuchsia-200' },
  { bg: 'bg-lime-500/30', text: 'text-lime-200' },
] as const

export function nameToAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTES[Math.abs(hash) % PALETTES.length]
}
