import type { VercelRequest, VercelResponse } from '@vercel/node'

// Live USD→CAD from the Bank of Canada Valet API (no key needed). Cached at the edge; falls back to
// a sane default so an invoice can always be generated even if the API is down. The returned rate
// is editable downstream before it lands on an invoice.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const from = String(req.query.from ?? 'USD')
  const to = String(req.query.to ?? 'CAD')
  if (from !== 'USD' || to !== 'CAD') {
    return res.status(400).json({ error: 'Only USD→CAD is supported.' })
  }
  try {
    const r = await fetch('https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1')
    if (!r.ok) throw new Error(`Bank of Canada responded ${r.status}`)
    const json = (await r.json()) as {
      observations?: Array<{ d: string; FXUSDCAD?: { v: string } }>
    }
    const obs = json.observations?.[0]
    const rate = obs?.FXUSDCAD ? Number(obs.FXUSDCAD.v) : Number.NaN
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('No usable rate in response')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    return res.status(200).json({ rate, date: obs?.d ?? null, source: 'Bank of Canada' })
  } catch (err) {
    return res.status(200).json({ rate: 1.38, date: null, source: 'fallback', note: String(err) })
  }
}
