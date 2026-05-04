import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type DealStage = 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

export interface Deal {
  id: string
  title: string
  company: string | null
  contact_name: string | null
  contact_email: string | null
  value: number | null
  currency: string
  stage: DealStage
  notes: string | null
  source: string | null
  deadline: string | null
  commission_pct: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface DealActivity {
  id: string
  deal_id: string
  deal_title: string
  action: 'created' | 'stage_changed' | 'updated' | 'deleted'
  from_stage: string | null
  to_stage: string | null
  details: string | null
  actor_email: string
  created_at: string
}

async function getEmail(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email || 'unknown'
}

async function logActivity(entry: Omit<DealActivity, 'id' | 'created_at'>) {
  await supabase.from('deal_activity').insert(entry)
}

export function usePipeline() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [activities, setActivities] = useState<DealActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDeals = useCallback(async () => {
    setLoading(true)
    const [dealsRes, activityRes] = await Promise.all([
      supabase.from('deals').select('*').order('updated_at', { ascending: false }),
      supabase.from('deal_activity').select('*').order('created_at', { ascending: false }).limit(50),
    ])

    if (!dealsRes.error) setDeals((dealsRes.data as Deal[]) || [])
    if (!activityRes.error) setActivities((activityRes.data as DealActivity[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  useEffect(() => {
    const channel = supabase
      .channel('deals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, (payload) => {
        switch (payload.eventType) {
          case 'INSERT':
            setDeals(prev => {
              if (prev.some(d => d.id === (payload.new as Deal).id)) return prev
              return [payload.new as Deal, ...prev]
            })
            break
          case 'UPDATE':
            setDeals(prev =>
              prev.map(d => d.id === (payload.new as Deal).id ? payload.new as Deal : d),
            )
            break
          case 'DELETE':
            setDeals(prev => prev.filter(d => d.id !== (payload.old as { id: string }).id))
            break
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const addDeal = async (deal: Partial<Deal>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error: err } = await supabase
      .from('deals')
      .insert({ ...deal, created_by: user.id })
      .select()
      .single()

    if (!err && data) {
      const d = data as Deal
      setDeals(prev => [d, ...prev])
      const email = user.email || 'unknown'
      logActivity({
        deal_id: d.id,
        deal_title: d.title,
        action: 'created',
        from_stage: null,
        to_stage: d.stage,
        details: null,
        actor_email: email,
      })
      setActivities(prev => [{
        id: crypto.randomUUID(),
        deal_id: d.id,
        deal_title: d.title,
        action: 'created',
        from_stage: null,
        to_stage: d.stage,
        details: null,
        actor_email: email,
        created_at: new Date().toISOString(),
      }, ...prev])
    }
    return { error: err?.message }
  }

  const updateDeal = async (id: string, updates: Partial<Deal>) => {
    const old = deals.find(d => d.id === id)
    const { data, error: err } = await supabase
      .from('deals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!err && data) {
      const d = data as Deal
      setDeals(prev => prev.map(deal => deal.id === id ? d : deal))
      const email = await getEmail()
      logActivity({
        deal_id: d.id,
        deal_title: d.title,
        action: 'updated',
        from_stage: old?.stage || null,
        to_stage: d.stage,
        details: null,
        actor_email: email,
      })
      setActivities(prev => [{
        id: crypto.randomUUID(),
        deal_id: d.id,
        deal_title: d.title,
        action: 'updated',
        from_stage: old?.stage || null,
        to_stage: d.stage,
        details: null,
        actor_email: email,
        created_at: new Date().toISOString(),
      }, ...prev])
    }
    return { error: err?.message }
  }

  const moveDeal = async (id: string, stage: DealStage) => {
    const old = deals.find(d => d.id === id)
    const { data, error: err } = await supabase
      .from('deals')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!err && data) {
      const d = data as Deal
      setDeals(prev => prev.map(deal => deal.id === id ? d : deal))
      const email = await getEmail()
      logActivity({
        deal_id: d.id,
        deal_title: d.title,
        action: 'stage_changed',
        from_stage: old?.stage || null,
        to_stage: stage,
        details: null,
        actor_email: email,
      })
      setActivities(prev => [{
        id: crypto.randomUUID(),
        deal_id: d.id,
        deal_title: d.title,
        action: 'stage_changed',
        from_stage: old?.stage || null,
        to_stage: stage,
        details: null,
        actor_email: email,
        created_at: new Date().toISOString(),
      }, ...prev])
    }
    return { error: err?.message }
  }

  const deleteDeal = async (id: string) => {
    const old = deals.find(d => d.id === id)
    const { error: err } = await supabase.from('deals').delete().eq('id', id)

    if (!err) {
      setDeals(prev => prev.filter(d => d.id !== id))
      if (old) {
        const email = await getEmail()
        logActivity({
          deal_id: id,
          deal_title: old.title,
          action: 'deleted',
          from_stage: old.stage,
          to_stage: null,
          details: null,
          actor_email: email,
        })
        setActivities(prev => [{
          id: crypto.randomUUID(),
          deal_id: id,
          deal_title: old.title,
          action: 'deleted',
          from_stage: old.stage,
          to_stage: null,
          details: null,
          actor_email: email,
          created_at: new Date().toISOString(),
        }, ...prev])
      }
    }
    return { error: err?.message }
  }

  return { deals, activities, loading, addDeal, updateDeal, moveDeal, deleteDeal, refetch: fetchDeals }
}
