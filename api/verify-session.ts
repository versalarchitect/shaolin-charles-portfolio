import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sessionId = req.query.session_id as string
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return res.status(200).json({ tier: 'none', status: session.payment_status })
    }

    const userId = session.metadata?.supabase_user_id
    if (userId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Ensure tier is set (handles race with webhook)
      await supabase
        .from('user_progress')
        .upsert({ user_id: userId, state: {}, access_tier: 'paid' }, { onConflict: 'user_id' })
        .then(({ error }) => {
          if (error) {
            return supabase
              .from('user_progress')
              .update({ access_tier: 'paid' })
              .eq('user_id', userId)
          }
        })
    }

    return res.status(200).json({ tier: 'paid', status: 'paid' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
