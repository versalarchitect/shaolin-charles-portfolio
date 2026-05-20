import { useState, useEffect, useCallback } from 'react'
import { Navigate } from '@/lib/localized-router'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import {
  Plus,
  X,
  Building2,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Pencil,
  User,
  TrendingUp,
  Loader2,
  Calendar,
  Activity,
  ArrowRight,
  Mail,
} from 'lucide-react'
import { SEO } from '@/components/SEO'
import { useAuth } from '@/hooks/use-auth'
import { hasPipelineAccess } from '@/lib/pipeline-access'
import { usePipeline, type Deal, type DealStage, type DealActivity } from '@/hooks/use-pipeline'

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Won' },
  { id: 'closed_lost', label: 'Lost' },
]

const STAGE_LABELS: Record<string, string> = Object.fromEntries(STAGES.map(s => [s.id, s.label]))

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg bg-foreground/[0.03] border border-foreground/[0.08] text-sm text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function formatValue(value: number | null, currency: string = 'CAD'): string {
  if (value === null || value === undefined) return ''
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function deadlineInfo(deadline: string | null): { label: string; urgent: boolean } | null {
  if (!deadline) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const d = new Date(`${deadline}T00:00:00`)
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Overdue', urgent: true }
  if (diff === 0) return { label: 'Today', urgent: true }
  if (diff <= 7) return { label: `${diff}d left`, urgent: false }
  return null
}

function shortEmail(email: string): string {
  return email.split('@')[0]
}

function DealCard({
  deal,
  onEdit,
  onMove,
  onDelete,
  stageIndex,
}: {
  deal: Deal
  onEdit: () => void
  onMove: (direction: 'left' | 'right') => void
  onDelete: () => void
  stageIndex: number
}) {
  const dl = deadlineInfo(deal.deadline)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.08] p-4 hover:border-foreground/15 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground/90 truncate">{deal.title}</h3>
          {deal.company && (
            <p className="text-xs font-mono text-foreground/40 mt-0.5 flex items-center gap-1">
              <Building2 className="w-3 h-3 shrink-0" />
              <span className="truncate">{deal.company}</span>
            </p>
          )}
        </div>
        {deal.value != null && (
          <div className="text-right shrink-0">
            <span className="text-sm font-mono font-semibold text-foreground/70 whitespace-nowrap">
              {formatValue(deal.value, deal.currency)}
            </span>
            <p className="text-[10px] font-mono text-foreground/25">
              {deal.commission_pct}% &middot; {formatValue(deal.value * deal.commission_pct / 100, deal.currency)}
            </p>
          </div>
        )}
      </div>

      {(deal.contact_name || deal.contact_email) && (
        <div className="mt-2 space-y-0.5">
          {deal.contact_name && (
            <p className="text-xs text-foreground/30 flex items-center gap-1">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{deal.contact_name}</span>
            </p>
          )}
          {deal.contact_email && (
            <p className="text-xs text-foreground/20 flex items-center gap-1">
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{deal.contact_email}</span>
            </p>
          )}
        </div>
      )}

      {deal.notes && (
        <p className="text-xs text-foreground/20 mt-1.5 line-clamp-2">{deal.notes}</p>
      )}

      {/* Metadata row: source + deadline */}
      {(deal.source || dl) && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {deal.source && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.04] text-foreground/30 border border-foreground/[0.06]">
              {deal.source}
            </span>
          )}
          {dl && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                dl.urgent
                  ? 'bg-foreground/10 text-foreground/70 font-semibold'
                  : 'bg-foreground/[0.04] text-foreground/40'
              }`}
            >
              <Calendar className="w-2.5 h-2.5" />
              {dl.label}
            </span>
          )}
        </div>
      )}

      <div className="h-px bg-foreground/[0.06] my-3" />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-foreground/25">
          {timeAgo(deal.updated_at)}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {stageIndex > 0 && (
            <button
              type="button"
              onClick={() => onMove('left')}
              className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-foreground/60 transition-colors"
              title={`Move to ${STAGES[stageIndex - 1].label}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {stageIndex < STAGES.length - 1 && (
            <button
              type="button"
              onClick={() => onMove('right')}
              className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-foreground/60 transition-colors"
              title={`Move to ${STAGES[stageIndex + 1].label}`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-foreground/60 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-foreground/60 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function DealModal({
  deal,
  onSave,
  onClose,
  saving,
}: {
  deal: Deal | null
  onSave: (data: Partial<Deal>) => void
  onClose: () => void
  saving: boolean
}) {
  const [form, setForm] = useState({
    title: deal?.title || '',
    company: deal?.company || '',
    contact_name: deal?.contact_name || '',
    contact_email: deal?.contact_email || '',
    value: deal?.value?.toString() || '',
    currency: deal?.currency || 'CAD',
    commission_pct: deal?.commission_pct?.toString() || '15',
    stage: deal?.stage || ('lead' as DealStage),
    source: deal?.source || '',
    deadline: deal?.deadline || '',
    notes: deal?.notes || '',
  })

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title: form.title,
      company: form.company || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      value: form.value ? parseFloat(form.value) : null,
      currency: form.currency,
      commission_pct: parseFloat(form.commission_pct) || 15,
      stage: form.stage as DealStage,
      source: form.source || null,
      deadline: form.deadline || null,
      notes: form.notes || null,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl bg-background border border-foreground/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/[0.08]">
          <h2 className="text-base font-mono font-semibold text-foreground">
            {deal ? 'Edit Deal' : 'New Deal'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-foreground/40 mb-1.5">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className={INPUT_CLASS}
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Company</label>
              <input
                type="text"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Contact</label>
              <input
                type="text"
                value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Jane Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/40 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={e => set('contact_email', e.target.value)}
              className={INPUT_CLASS}
              placeholder="jane@acme.com"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Value</label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.value}
                onChange={e => set('value', e.target.value)}
                className={INPUT_CLASS}
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Currency</label>
              <select
                value={form.currency}
                onChange={e => set('currency', e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Commission</label>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="25"
                  step="0.5"
                  value={form.commission_pct}
                  onChange={e => set('commission_pct', e.target.value)}
                  className={INPUT_CLASS}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-foreground/25 pointer-events-none">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Stage</label>
              <select
                value={form.stage}
                onChange={e => set('stage', e.target.value)}
                className={INPUT_CLASS}
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Source</label>
              <input
                type="text"
                value={form.source}
                onChange={e => set('source', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Referral, cold outreach..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-foreground/40 mb-1.5">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={e => set('deadline', e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground/40 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="Additional context..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-mono text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-mono font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : deal ? (
                'Save'
              ) : (
                'Add Deal'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl bg-background border border-foreground/[0.08] shadow-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-sm font-mono font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-xs text-foreground/50 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-mono text-foreground/50 hover:text-foreground/80 hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-mono font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ActivityFeed({ activities }: { activities: DealActivity[] }) {
  const [expanded, setExpanded] = useState(false)
  if (activities.length === 0) return null

  const shown = expanded ? activities : activities.slice(0, 8)

  return (
    <div className="border-t border-foreground/[0.06] mt-2">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-2 px-6 py-3 text-xs font-mono text-foreground/30 hover:text-foreground/50 transition-colors w-full"
      >
        <Activity className="w-3.5 h-3.5" />
        Recent Activity
        <span className="text-foreground/15">({activities.length})</span>
      </button>

      <div className="px-6 pb-4 space-y-1">
        {shown.map(a => (
          <div key={a.id} className="flex items-center gap-2 py-1 text-[11px] font-mono">
            <span className="text-foreground/20 w-14 shrink-0 text-right tabular-nums">
              {timeAgo(a.created_at)}
            </span>
            <span className="text-foreground/15">|</span>
            <span className="text-foreground/30 truncate">
              {a.action === 'created' && (
                <>
                  <span className="text-foreground/50">{shortEmail(a.actor_email)}</span>
                  {' added '}
                  <span className="text-foreground/60">{a.deal_title}</span>
                  {a.to_stage && <> to {STAGE_LABELS[a.to_stage] || a.to_stage}</>}
                </>
              )}
              {a.action === 'stage_changed' && (
                <>
                  <span className="text-foreground/50">{shortEmail(a.actor_email)}</span>
                  {' moved '}
                  <span className="text-foreground/60">{a.deal_title}</span>
                  {' '}
                  {STAGE_LABELS[a.from_stage || ''] || a.from_stage}
                  <ArrowRight className="w-3 h-3 inline mx-0.5 -mt-0.5" />
                  {STAGE_LABELS[a.to_stage || ''] || a.to_stage}
                </>
              )}
              {a.action === 'updated' && (
                <>
                  <span className="text-foreground/50">{shortEmail(a.actor_email)}</span>
                  {' updated '}
                  <span className="text-foreground/60">{a.deal_title}</span>
                </>
              )}
              {a.action === 'deleted' && (
                <>
                  <span className="text-foreground/50">{shortEmail(a.actor_email)}</span>
                  {' removed '}
                  <span className="text-foreground/60">{a.deal_title}</span>
                </>
              )}
            </span>
          </div>
        ))}
        {!expanded && activities.length > 8 && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-[10px] font-mono text-foreground/20 hover:text-foreground/40 transition-colors pt-1"
          >
            + {activities.length - 8} more
          </button>
        )}
      </div>
    </div>
  )
}

export default function Pipeline() {
  const { user } = useAuth()
  const { deals, activities, loading, addDeal, updateDeal, moveDeal, deleteDeal } = usePipeline()
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [deletingDeal, setDeletingDeal] = useState<Deal | null>(null)
  const [saving, setSaving] = useState(false)

  const openNewDeal = useCallback(() => {
    setEditingDeal(null)
    setShowModal(true)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !showModal && !deletingDeal) {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault()
          openNewDeal()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showModal, deletingDeal, openNewDeal])

  if (!hasPipelineAccess(user?.email)) {
    return <Navigate to="/course/dashboard" replace />
  }

  const dealsByStage = STAGES.reduce(
    (acc, stage) => {
      acc[stage.id] = deals.filter(d => d.stage === stage.id)
      return acc
    },
    {} as Record<DealStage, Deal[]>,
  )

  const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
  const totalActive = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0)
  const wonDeals = deals.filter(d => d.stage === 'closed_won')
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0)
  const wonCommission = wonDeals.reduce((sum, d) => sum + (d.value || 0) * d.commission_pct / 100, 0)
  const activeCommission = activeDeals.reduce((sum, d) => sum + (d.value || 0) * d.commission_pct / 100, 0)
  const closedCount = wonDeals.length + deals.filter(d => d.stage === 'closed_lost').length
  const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : null

  const handleSave = async (data: Partial<Deal>) => {
    setSaving(true)
    if (editingDeal) {
      const { error } = await updateDeal(editingDeal.id, data)
      if (error) {
        toast.error(error)
      } else {
        toast.success('Deal updated')
      }
    } else {
      const { error } = await addDeal(data)
      if (error) {
        toast.error(error)
      } else {
        toast.success('Deal added')
      }
    }
    setSaving(false)
    setShowModal(false)
    setEditingDeal(null)
  }

  const handleMove = async (deal: Deal, direction: 'left' | 'right') => {
    const currentIdx = STAGES.findIndex(s => s.id === deal.stage)
    const nextIdx = direction === 'right' ? currentIdx + 1 : currentIdx - 1
    if (nextIdx >= 0 && nextIdx < STAGES.length) {
      const target = STAGES[nextIdx]
      const { error } = await moveDeal(deal.id, target.id)
      if (error) {
        toast.error(error)
      } else {
        toast.success(`Moved to ${target.label}`)
      }
    }
  }

  const handleDelete = async () => {
    if (!deletingDeal) return
    const title = deletingDeal.title
    const { error } = await deleteDeal(deletingDeal.id)
    setDeletingDeal(null)
    if (error) {
      toast.error(error)
    } else {
      toast.success(`Deleted "${title}"`)
    }
  }

  const columnValue = (stageId: DealStage) => {
    const total = dealsByStage[stageId].reduce((sum, d) => sum + (d.value || 0), 0)
    return total > 0 ? formatValue(total) : null
  }

  return (
    <>
      <SEO title="Pipeline" description="Deal pipeline" noIndex />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-foreground/[0.08]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-semibold text-foreground">Pipeline</h1>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-xs font-mono text-foreground/40">
                  {deals.length} deal{deals.length !== 1 ? 's' : ''}
                </span>
                {totalActive > 0 && (
                  <span className="text-xs font-mono text-foreground/40 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {formatValue(totalActive)} active
                  </span>
                )}
                {wonValue > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 bg-green-500/10 text-green-500 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {formatValue(wonValue)} won
                  </span>
                )}
                {wonCommission > 0 && (
                  <span className="text-xs font-mono text-foreground/30">
                    {formatValue(wonCommission)} commission earned
                  </span>
                )}
                {activeCommission > 0 && (
                  <span className="text-xs font-mono text-foreground/20">
                    {formatValue(activeCommission)} pending
                  </span>
                )}
                {winRate !== null && (
                  <span className="text-xs font-mono text-foreground/30">
                    {winRate}% win rate
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={openNewDeal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
              title="Add deal (N)"
            >
              <Plus className="w-4 h-4" />
              Add Deal
            </button>
          </div>
        </div>

        {/* Board */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-5 h-5 animate-spin text-foreground/30" />
          </div>
        ) : deals.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.08] flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-5 h-5 text-foreground/20" />
              </div>
              <h2 className="text-sm font-mono font-semibold text-foreground/60 mb-1">No deals yet</h2>
              <p className="text-xs text-foreground/30 mb-4">
                Press <kbd className="px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/50 font-mono text-[10px]">N</kbd> or click Add Deal to get started.
              </p>
              <button
                type="button"
                onClick={openNewDeal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Deal
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto p-4 flex-1">
            <div className="flex gap-3 min-w-max">
              {STAGES.map((stage, stageIdx) => {
                const colVal = columnValue(stage.id)
                return (
                  <div key={stage.id} className="w-72 flex-shrink-0">
                    {/* Column header */}
                    <div className="flex items-center justify-between px-3 py-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            stage.id === 'closed_won'
                              ? 'bg-green-500'
                              : stage.id === 'closed_lost'
                                ? 'bg-foreground/15'
                                : 'bg-foreground/30'
                          }`}
                        />
                        <span className="text-xs font-mono font-semibold text-foreground/60 uppercase tracking-wider">
                          {stage.label}
                        </span>
                        <span className="text-[10px] font-mono text-foreground/25 tabular-nums">
                          {dealsByStage[stage.id].length}
                        </span>
                      </div>
                      {colVal && (
                        <span className="text-[10px] font-mono text-foreground/20 tabular-nums">
                          {colVal}
                        </span>
                      )}
                    </div>

                    {/* Cards */}
                    <div className="space-y-2 min-h-[200px]">
                      <AnimatePresence mode="popLayout">
                        {dealsByStage[stage.id].map(deal => (
                          <DealCard
                            key={deal.id}
                            deal={deal}
                            stageIndex={stageIdx}
                            onEdit={() => {
                              setEditingDeal(deal)
                              setShowModal(true)
                            }}
                            onMove={dir => handleMove(deal, dir)}
                            onDelete={() => setDeletingDeal(deal)}
                          />
                        ))}
                      </AnimatePresence>

                      {dealsByStage[stage.id].length === 0 && (
                        <div className="rounded-xl border border-dashed border-foreground/[0.06] p-6 text-center">
                          <p className="text-xs font-mono text-foreground/15">No deals</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <ActivityFeed activities={activities} />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <DealModal
            deal={editingDeal}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false)
              setEditingDeal(null)
            }}
            saving={saving}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingDeal && (
          <ConfirmDialog
            title="Delete deal"
            message={`Remove "${deletingDeal.title}" from the pipeline? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingDeal(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
