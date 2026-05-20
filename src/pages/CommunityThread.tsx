import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Link, Navigate } from '@/lib/localized-router'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  MessageSquare,
  Pin,
  Clock,
  Hash,
  ThumbsUp,
  Send,
  Bookmark,
  Share2,
  ChevronDown,
  CornerDownRight,
  Keyboard,
  Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { BlurFadeIn, SpotlightCard } from '@/components/ui/aaa-effects'
import { categories } from '@/data/community'
import { useAuth } from '@/hooks/use-auth'
import {
  fetchThread,
  fetchReplies,
  postReply,
  toggleLike,
  toggleBookmark,
  isBookmarked as checkBookmark,
  isThreadLiked as checkThreadLiked,
  subscribeToReplies,
  timeAgo,
  type Thread,
  type Reply,
} from '@/lib/community-api'
import { toast } from 'sonner'

function renderMarkdown(text: string) {
  const blocks = text.split(/(```[\s\S]*?```)/g)

  return blocks.map((block, blockIdx) => {
    if (block.startsWith('```') && block.endsWith('```')) {
      const code = block.slice(3, -3).replace(/^\w*\n/, '')
      return (
        <pre
          key={blockIdx}
          className="my-3 rounded-lg bg-foreground/[0.04] border border-foreground/[0.06] px-4 py-3 overflow-x-auto"
        >
          <code className="text-xs font-mono text-foreground/70">{code}</code>
        </pre>
      )
    }

    const lines = block.split('\n')
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*|`[^`]+`)/g)
      const rendered = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} className="font-semibold text-foreground/90">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={partIdx}
              className="px-1.5 py-0.5 rounded bg-foreground/[0.06] text-xs font-mono text-foreground/70"
            >
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={partIdx}>{part}</span>
      })

      return (
        <span key={`${blockIdx}-${lineIdx}`}>
          {rendered}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      )
    })
  })
}

function TierBadge({ tier }: { tier: string }) {
  const isInstructor = tier === 'Instructor'
  return (
    <span
      className={`inline-flex px-1.5 py-0.5 text-[10px] font-mono rounded ${
        isInstructor
          ? 'bg-foreground/15 text-foreground/90'
          : 'bg-foreground/[0.06] text-foreground/50'
      }`}
    >
      {tier}
    </span>
  )
}

function CategoryTag({ category }: { category: string }) {
  const cat = categories[category] || categories.general
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded-full ${cat.color}`}
    >
      <Hash className="w-2.5 h-2.5" />
      {cat.label}
    </span>
  )
}

function Avatar({
  initials,
  size = 'sm',
  highlighted = false,
}: {
  initials: string
  size?: 'sm' | 'md' | 'lg'
  highlighted?: boolean
}) {
  const sizes = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  }
  return (
    <div
      className={`${sizes[size]} rounded-full ${
        highlighted
          ? 'bg-foreground/[0.12] border-foreground/20'
          : 'bg-foreground/[0.08] border-foreground/10'
      } border flex items-center justify-center font-mono font-bold text-foreground/50 flex-shrink-0`}
    >
      {initials}
    </div>
  )
}

function ReplyCard({
  reply,
  index,
  isNew = false,
  userId,
  onLikeToggle,
}: {
  reply: Reply
  index: number
  isNew?: boolean
  userId?: string
  onLikeToggle: (replyId: string) => void
}) {
  const { t } = useTranslation()
  const isInstructor = reply.author_tier === 'Instructor'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      layout
    >
      <div
        className={`flex gap-3 p-4 rounded-xl border transition-all duration-200 ${
          isNew
            ? 'border-foreground/[0.12] bg-foreground/[0.04]'
            : isInstructor
              ? 'border-foreground/[0.08] bg-foreground/[0.025] hover:border-foreground/[0.12]'
              : 'border-foreground/[0.04] hover:border-foreground/[0.08] bg-foreground/[0.01] hover:bg-foreground/[0.02]'
        }`}
      >
        <Avatar initials={reply.author_initial} highlighted={isInstructor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-sm font-medium ${isInstructor ? 'text-foreground/90' : 'text-foreground/80'}`}
            >
              {reply.author_name}
            </span>
            <TierBadge tier={reply.author_tier} />
            <span className="text-foreground/15">·</span>
            <div className="flex items-center gap-1 text-[11px] text-foreground/30 font-mono">
              <Clock className="w-3 h-3" />
              {timeAgo(reply.created_at)}
            </div>
          </div>

          <div className="text-sm text-foreground/70 leading-relaxed">
            {renderMarkdown(reply.content)}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => userId && onLikeToggle(reply.id)}
              className={`flex items-center gap-1.5 text-[11px] transition-colors font-mono cursor-pointer ${
                reply.liked_by_me
                  ? 'text-foreground/60'
                  : 'text-foreground/25 hover:text-foreground/50'
              }`}
            >
              <ThumbsUp
                className={`w-3 h-3 ${reply.liked_by_me ? 'fill-foreground/40' : ''}`}
              />
              {reply.like_count}
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-foreground/25 hover:text-foreground/50 transition-colors font-mono cursor-pointer">
              <CornerDownRight className="w-3 h-3" />
              {t('communityThread.reply')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommunityThread() {
  const { t } = useTranslation()
  const { threadId } = useParams<{ threadId: string }>()
  const { user } = useAuth()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [posting, setPosting] = useState(false)
  const [newReplyIds, setNewReplyIds] = useState<Set<string>>(new Set())
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAllReplies, setShowAllReplies] = useState(false)
  const repliesSectionRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const loadData = useCallback(async () => {
    if (!threadId) return
    const [t, r] = await Promise.all([
      fetchThread(threadId),
      fetchReplies(threadId, user?.id),
    ])
    if (!t) {
      setNotFound(true)
    } else {
      setThread(t)
      setReplies(r)
    }
    setLoading(false)
  }, [threadId, user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Check bookmark + like status
  useEffect(() => {
    if (user && threadId) {
      checkBookmark(user.id, threadId).then(setBookmarked)
      checkThreadLiked(user.id, threadId).then(setLiked)
    }
  }, [user, threadId])

  // Real-time subscription for new replies
  useEffect(() => {
    if (!threadId) return
    const channel = subscribeToReplies(threadId, () => {
      fetchReplies(threadId, user?.id).then(setReplies)
    })
    return () => { supabase.removeChannel(channel) }
  }, [threadId, user?.id])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [replyText])

  if (notFound) {
    return <Navigate to="/course/community" replace />
  }

  if (loading || !thread) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/30" />
      </div>
    )
  }

  const INITIAL_REPLY_COUNT = 5
  const hasMoreReplies = replies.length > INITIAL_REPLY_COUNT && !showAllReplies
  const visibleReplies = showAllReplies
    ? replies
    : replies.slice(0, INITIAL_REPLY_COUNT)
  const hiddenCount = replies.length - INITIAL_REPLY_COUNT

  function scrollToReplies() {
    repliesSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleBookmark() {
    if (!user || !threadId) return
    try {
      const result = await toggleBookmark(user.id, threadId)
      setBookmarked(result)
      toast.success(result ? t('communityThread.threadSaved') : t('communityThread.bookmarkRemoved'))
    } catch {
      toast.error('Failed to update bookmark')
    }
  }

  async function handleThreadLike() {
    if (!user || !threadId) return
    try {
      const result = await toggleLike(user.id, { threadId })
      setLiked(result)
    } catch {
      toast.error('Failed to update like')
    }
  }

  async function handleReplyLike(replyId: string) {
    if (!user) return
    try {
      const nowLiked = await toggleLike(user.id, { replyId })
      setReplies((prev) =>
        prev.map((r) =>
          r.id === replyId
            ? {
                ...r,
                liked_by_me: nowLiked,
                like_count: r.like_count + (nowLiked ? 1 : -1),
              }
            : r,
        ),
      )
    } catch {
      toast.error('Failed to update like')
    }
  }

  async function handleSubmitReply() {
    if (!replyText.trim() || !user || !threadId || posting) return
    setPosting(true)

    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'User'
    const initial = displayName.slice(0, 2).toUpperCase()
    const tier = user.user_metadata?.tier || 'Section 1'

    try {
      const newReply = await postReply(threadId, replyText.trim(), {
        id: user.id,
        name: displayName,
        initial,
        tier,
      })
      setReplies((prev) => [...prev, newReply])
      setNewReplyIds((prev) => new Set(prev).add(newReply.id))
      setReplyText('')
      setShowAllReplies(true)
      setTimeout(() => {
        repliesSectionRef.current?.querySelector('[data-last-reply]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } catch {
      toast.error('Failed to post reply')
    } finally {
      setPosting(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && replyText.trim()) {
      e.preventDefault()
      handleSubmitReply()
    }
  }

  return (
    <>
      <SEO
        title={`${thread.title} — Community`}
        description={thread.preview}
        path={`/community/thread/${thread.id}`}
        image="/og-image.png"
        imageAlt={thread.title}
        noindex
      />

      <div className="min-h-screen pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-4xl">
          {/* Back nav */}
          <BlurFadeIn delay={0}>
            <Link
              to="/course/community"
              className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-foreground/70 transition-colors mb-6 group font-mono"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('communityThread.backToCommunity')}
            </Link>
          </BlurFadeIn>

          {/* Thread header */}
          <BlurFadeIn delay={0.05}>
            <SpotlightCard className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden mb-6">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-2 mb-3 flex-wrap">
                  {thread.is_pinned && (
                    <Pin className="w-4 h-4 text-foreground/30 rotate-45 flex-shrink-0 mt-1" />
                  )}
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground/95">
                    {thread.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <Avatar
                    initials={thread.author_initial}
                    size="md"
                    highlighted={thread.author_tier === 'Instructor'}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground/80">
                        {thread.author_name}
                      </span>
                      <TierBadge tier={thread.author_tier} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CategoryTag category={thread.category} />
                      <span className="text-foreground/15">·</span>
                      <span className="text-[11px] text-foreground/30 font-mono">
                        {timeAgo(thread.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-foreground/[0.08] via-foreground/[0.04] to-transparent mb-5" />

                <div className="text-sm text-foreground/70 leading-relaxed">
                  {renderMarkdown(thread.content)}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-foreground/[0.06]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleThreadLike}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        liked
                          ? 'bg-foreground/[0.08] text-foreground/60'
                          : 'text-foreground/30 hover:bg-foreground/[0.04] hover:text-foreground/50'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-3.5 h-3.5 ${liked ? 'fill-foreground/40' : ''}`}
                      />
                      {t('communityThread.like')}
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        bookmarked
                          ? 'bg-foreground/[0.08] text-foreground/60'
                          : 'text-foreground/30 hover:bg-foreground/[0.04] hover:text-foreground/50'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${bookmarked ? 'fill-foreground/40' : ''}`}
                      />
                      {bookmarked ? t('communityThread.saved') : t('communityThread.save')}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-foreground/30 hover:bg-foreground/[0.04] hover:text-foreground/50 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {copied ? t('communityThread.copied') : t('communityThread.share')}
                    </button>
                  </div>

                  <button
                    onClick={scrollToReplies}
                    className="flex items-center gap-1.5 text-xs text-foreground/30 font-mono hover:text-foreground/50 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {replies.length} {replies.length === 1 ? t('communityThread.reply') : t('communityThread.replies')}
                  </button>
                </div>
              </div>
            </SpotlightCard>
          </BlurFadeIn>

          {/* Replies section */}
          <div ref={repliesSectionRef}>
            <BlurFadeIn delay={0.1}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-mono font-semibold text-foreground/50 uppercase tracking-wider">
                  {t('communityThread.replies')} ({replies.length})
                </h2>
              </div>
            </BlurFadeIn>

            <div className="space-y-2 mb-4">
              <AnimatePresence>
                {visibleReplies.map((reply, i) => (
                  <div key={reply.id} data-last-reply={i === visibleReplies.length - 1 ? '' : undefined}>
                    <ReplyCard
                      reply={reply}
                      index={i}
                      isNew={newReplyIds.has(reply.id)}
                      userId={user?.id}
                      onLikeToggle={handleReplyLike}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>

            {hasMoreReplies && (
              <BlurFadeIn delay={0.12}>
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-foreground/[0.08] text-xs font-mono text-foreground/35 hover:text-foreground/60 hover:border-foreground/[0.15] hover:bg-foreground/[0.02] transition-all cursor-pointer mb-8"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  {t('communityThread.showMore').replace('{count}', String(hiddenCount))}{' '}
                  {hiddenCount === 1 ? t('communityThread.reply') : t('communityThread.replies')}
                </button>
              </BlurFadeIn>
            )}

            {replies.length === 0 && (
              <BlurFadeIn delay={0.15}>
                <div className="text-center py-12 text-foreground/30">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 text-foreground/15" />
                  <p className="text-sm font-mono">
                    {t('communityThread.noReplies')}
                  </p>
                </div>
              </BlurFadeIn>
            )}
          </div>
        </div>

        {/* Sticky reply composer */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40">
          <div className="bg-background/80 backdrop-blur-xl border-t border-foreground/[0.08]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-3">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('communityThread.writeReply')}
                    rows={1}
                    className="w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-xl px-4 py-3 pr-12 text-sm text-foreground/80 placeholder:text-foreground/20 focus:outline-none focus:border-foreground/[0.15] focus:bg-foreground/[0.06] transition-all resize-none font-mono min-h-[44px] max-h-[200px]"
                  />
                  {!replyText.trim() && (
                    <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] text-foreground/15 font-mono pointer-events-none">
                      <Keyboard className="w-3 h-3" />
                      <span className="hidden sm:inline">
                        {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  className="h-[44px] px-4 font-mono text-xs group flex-shrink-0"
                  disabled={!replyText.trim() || posting}
                  onClick={handleSubmitReply}
                >
                  {posting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  )}
                  <span className="hidden sm:inline ml-1.5">
                    {posting ? t('community.posting') : t('communityThread.post')}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
