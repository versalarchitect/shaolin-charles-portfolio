import { supabase } from './supabase'

export interface Thread {
  id: string
  title: string
  content: string
  preview: string
  category: string
  is_pinned: boolean
  author_id: string | null
  author_name: string
  author_initial: string
  author_tier: string
  created_at: string
  updated_at: string
  reply_count: number
}

export interface Reply {
  id: string
  thread_id: string
  content: string
  author_id: string | null
  author_name: string
  author_initial: string
  author_tier: string
  created_at: string
  like_count: number
  liked_by_me: boolean
}

export async function fetchThreads(): Promise<Thread[]> {
  const { data, error } = await supabase
    .from('community_threads')
    .select('*, community_replies(count)')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data || []).map((t) => ({
    id: t.id,
    title: t.title,
    content: t.content,
    preview: t.preview,
    category: t.category,
    is_pinned: t.is_pinned,
    author_id: t.author_id,
    author_name: t.author_name,
    author_initial: t.author_initial,
    author_tier: t.author_tier,
    created_at: t.created_at,
    updated_at: t.updated_at,
    reply_count: t.community_replies?.[0]?.count ?? 0,
  }))
}

export async function fetchThread(id: string): Promise<Thread | null> {
  const { data, error } = await supabase
    .from('community_threads')
    .select('*, community_replies(count)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    preview: data.preview,
    category: data.category,
    is_pinned: data.is_pinned,
    author_id: data.author_id,
    author_name: data.author_name,
    author_initial: data.author_initial,
    author_tier: data.author_tier,
    created_at: data.created_at,
    updated_at: data.updated_at,
    reply_count: data.community_replies?.[0]?.count ?? 0,
  }
}

export async function fetchReplies(threadId: string, userId?: string): Promise<Reply[]> {
  const { data, error } = await supabase
    .from('community_replies')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  if (error) throw error

  const replies = data || []
  const replyIds = replies.map((r) => r.id)

  // Fetch like counts
  let likeCounts: Record<string, number> = {}
  if (replyIds.length > 0) {
    const { data: likes } = await supabase
      .from('community_likes')
      .select('reply_id')
      .in('reply_id', replyIds)

    if (likes) {
      for (const l of likes) {
        if (l.reply_id) likeCounts[l.reply_id] = (likeCounts[l.reply_id] || 0) + 1
      }
    }
  }

  // Fetch user's likes
  let myLikes = new Set<string>()
  if (userId && replyIds.length > 0) {
    const { data: userLikes } = await supabase
      .from('community_likes')
      .select('reply_id')
      .eq('user_id', userId)
      .in('reply_id', replyIds)

    if (userLikes) {
      for (const l of userLikes) {
        if (l.reply_id) myLikes.add(l.reply_id)
      }
    }
  }

  return replies.map((r) => ({
    id: r.id,
    thread_id: r.thread_id,
    content: r.content,
    author_id: r.author_id,
    author_name: r.author_name,
    author_initial: r.author_initial,
    author_tier: r.author_tier,
    created_at: r.created_at,
    like_count: likeCounts[r.id] || 0,
    liked_by_me: myLikes.has(r.id),
  }))
}

export async function postReply(
  threadId: string,
  content: string,
  user: { id: string; name: string; initial: string; tier: string },
): Promise<Reply> {
  const { data, error } = await supabase
    .from('community_replies')
    .insert({
      thread_id: threadId,
      content,
      author_id: user.id,
      author_name: user.name,
      author_initial: user.initial,
      author_tier: user.tier,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    thread_id: data.thread_id,
    content: data.content,
    author_id: data.author_id,
    author_name: data.author_name,
    author_initial: data.author_initial,
    author_tier: data.author_tier,
    created_at: data.created_at,
    like_count: 0,
    liked_by_me: false,
  }
}

export async function toggleLike(
  userId: string,
  target: { threadId?: string; replyId?: string },
): Promise<boolean> {
  const col = target.threadId ? 'thread_id' : 'reply_id'
  const val = target.threadId || target.replyId

  const { data: existing } = await supabase
    .from('community_likes')
    .select('id')
    .eq('user_id', userId)
    .eq(col, val!)
    .maybeSingle()

  if (existing) {
    await supabase.from('community_likes').delete().eq('id', existing.id)
    return false
  } else {
    await supabase.from('community_likes').insert({
      user_id: userId,
      thread_id: target.threadId || null,
      reply_id: target.replyId || null,
    })
    return true
  }
}

export async function isBookmarked(userId: string, threadId: string): Promise<boolean> {
  const { data } = await supabase
    .from('community_bookmarks')
    .select('thread_id')
    .eq('user_id', userId)
    .eq('thread_id', threadId)
    .maybeSingle()

  return !!data
}

export async function toggleBookmark(userId: string, threadId: string): Promise<boolean> {
  const exists = await isBookmarked(userId, threadId)

  if (exists) {
    await supabase
      .from('community_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('thread_id', threadId)
    return false
  } else {
    await supabase
      .from('community_bookmarks')
      .insert({ user_id: userId, thread_id: threadId })
    return true
  }
}

export async function createThread(
  thread: {
    title: string
    content: string
    preview: string
    category: string
  },
  user: { id: string; name: string; initial: string; tier: string },
): Promise<Thread> {
  const id = thread.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  const { data, error } = await supabase
    .from('community_threads')
    .insert({
      id,
      title: thread.title,
      content: thread.content,
      preview: thread.preview,
      category: thread.category,
      author_id: user.id,
      author_name: user.name,
      author_initial: user.initial,
      author_tier: user.tier,
    })
    .select()
    .single()

  if (error) throw error

  return { ...data, reply_count: 0 }
}

export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return '1d ago'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function subscribeToReplies(
  threadId: string,
  callback: () => void,
) {
  return supabase
    .channel(`replies:${threadId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'community_replies', filter: `thread_id=eq.${threadId}` },
      callback,
    )
    .subscribe()
}
