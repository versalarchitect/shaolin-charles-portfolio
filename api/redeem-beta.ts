import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization' })
  }

  const { code } = req.body || {}
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code' })
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify the user's JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Call the atomic RPC function (runs as the service role but uses auth.uid() context)
    // Since we're using the service role key, we need to impersonate the user
    const userClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data, error } = await userClient.rpc('redeem_beta_code', { p_code: code.trim().toUpperCase() })

    if (error) {
      return res.status(500).json({ error: 'Failed to redeem code' })
    }

    return res.status(200).json({ success: !!data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
