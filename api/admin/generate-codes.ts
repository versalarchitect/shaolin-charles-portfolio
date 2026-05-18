import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

const ADMIN_EMAILS = ['charles@predictive.company', 'charlesdotdirect@gmail.com']

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization' })
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user || !ADMIN_EMAILS.includes(user.email ?? '')) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const { count = 10, prefix = 'BETA' } = req.body || {}
    const codeCount = Math.min(Math.max(1, Number(count)), 100)

    const codes = Array.from({ length: codeCount }, () => {
      const rand = randomBytes(4).toString('hex').toUpperCase()
      return `${prefix}-${rand.slice(0, 4)}-${rand.slice(4, 8)}`
    })

    const { error } = await supabase
      .from('beta_codes')
      .insert(codes.map(code => ({ code })))

    if (error) {
      return res.status(500).json({ error: 'Failed to insert codes' })
    }

    return res.status(200).json({ codes })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
