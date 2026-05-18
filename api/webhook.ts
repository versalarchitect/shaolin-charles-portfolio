import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  try {
    const rawBody = await getRawBody(req)
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      const email = session.customer_details?.email

      if (userId && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Idempotent enrollment insert
        await supabase.from('enrollments').upsert({
          user_id: userId,
          email,
          stripe_session_id: session.id,
          stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
          amount: session.amount_total,
          status: 'completed',
        }, { onConflict: 'stripe_session_id' })

        // Upgrade access tier to paid
        const { error: upsertError } = await supabase
          .from('user_progress')
          .upsert({ user_id: userId, state: {}, access_tier: 'paid' }, { onConflict: 'user_id' })

        if (upsertError) {
          // Row exists — just update the tier
          await supabase
            .from('user_progress')
            .update({ access_tier: 'paid' })
            .eq('user_id', userId)
        }
      }
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return res.status(400).json({ error: message })
  }
}
