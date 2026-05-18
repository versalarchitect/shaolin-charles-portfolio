import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { customerEmail, userId } = req.body || {}

    const origin = req.headers.origin || 'https://charlesjackson.dev'

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/tiers`,
      allow_promotion_codes: true,
      metadata: {
        ...(userId && { supabase_user_id: userId }),
      },
    }

    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return res.status(200).json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}
