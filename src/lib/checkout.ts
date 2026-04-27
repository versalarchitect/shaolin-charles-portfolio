import { supabase } from './supabase'

export async function initiateCheckout() {
  let customerEmail: string | undefined
  let userId: string | undefined

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      customerEmail = user.email ?? undefined
      userId = user.id
    }
  } catch {
    // Not logged in — proceed without prefill
  }

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerEmail, userId }),
  })

  if (!res.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { url } = await res.json()
  window.location.href = url
}
