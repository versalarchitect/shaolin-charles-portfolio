import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LIVEKIT_API_KEY = Deno.env.get('LIVEKIT_API_KEY')!
const LIVEKIT_API_SECRET = Deno.env.get('LIVEKIT_API_SECRET')!

function base64url(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function createLiveKitToken(
  identity: string,
  roomName: string,
  metadata?: string,
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }

  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: LIVEKIT_API_KEY,
    sub: identity,
    iat: now,
    nbf: now,
    exp: now + 600, // 10 minutes
    jti: crypto.randomUUID(),
    video: {
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    },
    metadata: metadata || '',
  }

  const enc = new TextEncoder()
  const headerB64 = base64url(enc.encode(JSON.stringify(header)))
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)))
  const signingInput = `${headerB64}.${payloadB64}`

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(LIVEKIT_API_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput))
  const sigB64 = base64url(new Uint8Array(signature))

  return `${signingInput}.${sigB64}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { roomName, identity, metadata } = await req.json()
    if (!roomName || !identity) {
      return new Response(JSON.stringify({ error: 'Missing roomName or identity' }), { status: 400 })
    }

    const token = await createLiveKitToken(identity, roomName, metadata)

    return new Response(JSON.stringify({ token }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 })
  }
})
