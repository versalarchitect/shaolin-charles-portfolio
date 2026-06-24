import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------- Quebec sales tax ----
// GST/HST (TPS, federal) + QST (TVQ, Quebec). QST is computed on the PRE-GST subtotal (the two are
// not compounded), per Revenu Québec. These are SALES taxes you collect and remit — not income.
export const GST_RATE = 0.05;
export const QST_RATE = 0.09975;

export interface Taxes {
  gst: number;
  qst: number;
  total: number;
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function computeTaxes(subtotalCad: number): Taxes {
  const gst = round2(subtotalCad * GST_RATE);
  const qst = round2(subtotalCad * QST_RATE);
  return { gst, qst, total: round2(subtotalCad + gst + qst) };
}

// ---------------------------------------------------------------- Types ----
export type Currency = 'CAD' | 'USD';

export interface InvoiceSettings {
  id: string;
  business_name: string;
  address: string | null;
  email: string | null;
  gst_number: string | null;
  qst_number: string | null;
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  legal_name: string | null;
  address: string | null;
  email: string | null;
  pay_cadence: string;
  invoice_prefix: string | null;
  next_invoice_seq: number;
}

export interface BaseItem {
  id: string;
  client_id: string;
  label: string;
  amount: number;
  currency: Currency;
  active: boolean;
  sort_order: number;
}

export interface BaseChange {
  id: string;
  client_id: string;
  label: string;
  delta_amount: number;
  currency: Currency;
  reason: string | null;
  created_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  number: string;
  issue_date: string;
  period_start: string | null;
  period_end: string | null;
  status: 'draft' | 'sent' | 'paid';
  fx_usd_cad: number | null;
  subtotal_cad: number;
  gst: number;
  qst: number;
  total_cad: number;
  notes: string | null;
  created_at: string;
}

export interface LineItem {
  id: string;
  invoice_id: string;
  label: string;
  amount_cad: number;
  source: 'base' | 'adjustment' | 'oneoff';
  note: string | null;
  sort_order: number;
}

// ---------------------------------------------------------------- Currency / FX ----
export function cadEquivalent(amount: number, currency: Currency, fxUsdCad: number): number {
  return currency === 'USD' ? round2(amount * fxUsdCad) : round2(amount);
}

export function baseSubtotalCad(items: BaseItem[], fxUsdCad: number): number {
  return round2(
    items
      .filter((i) => i.active)
      .reduce((sum, i) => sum + cadEquivalent(i.amount, i.currency, fxUsdCad), 0),
  );
}

let _fxCache: { rate: number; at: number } | null = null;

// Live USD→CAD via our serverless function (Bank of Canada), cached 1h, editable downstream.
export async function fetchFxUsdCad(): Promise<number> {
  if (_fxCache && Date.now() - _fxCache.at < 3_600_000) return _fxCache.rate;
  try {
    const res = await fetch('/api/fx-rate?from=USD&to=CAD');
    if (res.ok) {
      const json = (await res.json()) as { rate?: number };
      if (typeof json.rate === 'number' && json.rate > 0) {
        _fxCache = { rate: json.rate, at: Date.now() };
        return json.rate;
      }
    }
  } catch {
    // fall through to the last-known / default rate
  }
  return _fxCache?.rate ?? 1.38;
}

// ---------------------------------------------------------------- Data access (owner-only RLS) ----
export async function getSettings(): Promise<InvoiceSettings | null> {
  const { data } = await supabase.from('invoice_settings').select('*').eq('id', 'me').maybeSingle();
  return (data as InvoiceSettings | null) ?? null;
}

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('invoice_clients').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClientBySlug(slug: string): Promise<Client | null> {
  const { data } = await supabase
    .from('invoice_clients')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return (data as Client | null) ?? null;
}

export async function listBaseItems(clientId: string): Promise<BaseItem[]> {
  const { data, error } = await supabase
    .from('invoice_base_items')
    .select('*')
    .eq('client_id', clientId)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as BaseItem[];
}

export async function listBaseChanges(clientId: string): Promise<BaseChange[]> {
  const { data, error } = await supabase
    .from('invoice_base_changes')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as BaseChange[];
}

// Adjust the base: add a new chunk (or bump an existing item by a delta) WITH a reason — which
// raises what you charge AND logs a descriptive change that becomes a row on the next invoice.
export async function adjustBase(params: {
  clientId: string;
  label: string;
  amount: number;
  currency: Currency;
  reason: string;
  baseItemId?: string;
}): Promise<void> {
  const { clientId, label, amount, currency, reason, baseItemId } = params;
  if (baseItemId) {
    const { data: existing } = await supabase
      .from('invoice_base_items')
      .select('amount')
      .eq('id', baseItemId)
      .single();
    const newAmount = round2(((existing?.amount as number) ?? 0) + amount);
    await supabase.from('invoice_base_items').update({ amount: newAmount }).eq('id', baseItemId);
  } else {
    const { data: maxRow } = await supabase
      .from('invoice_base_items')
      .select('sort_order')
      .eq('client_id', clientId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const sort = ((maxRow?.sort_order as number) ?? 0) + 1;
    await supabase
      .from('invoice_base_items')
      .insert({ client_id: clientId, label, amount, currency, sort_order: sort });
  }
  await supabase.from('invoice_base_changes').insert({
    client_id: clientId,
    base_item_id: baseItemId ?? null,
    label,
    delta_amount: amount,
    currency,
    reason,
  });
}

export async function setBaseItemActive(id: string, active: boolean): Promise<void> {
  await supabase.from('invoice_base_items').update({ active }).eq('id', id);
}

export async function listInvoices(clientId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('issue_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Invoice[];
}

// Sum of invoice subtotals (pre-tax revenue) for the current calendar year, across all clients —
// "all the money you're making" — the base for the income-tax reserve.
export async function getYtdNetIncome(): Promise<number> {
  const year = new Date().getFullYear();
  const { data, error } = await supabase
    .from('invoices')
    .select('subtotal_cad')
    .gte('issue_date', `${year}-01-01`)
    .lte('issue_date', `${year}-12-31`);
  if (error) throw error;
  return round2(
    (data ?? []).reduce((sum, r) => sum + Number((r as { subtotal_cad: number }).subtotal_cad), 0),
  );
}

export async function listLineItems(invoiceId: string): Promise<LineItem[]> {
  const { data, error } = await supabase
    .from('invoice_line_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as LineItem[];
}

// Generate an invoice: snapshot the active base into rows (USD shown as CAD-equiv), add any one-off
// rows, compute GST/QST, and bump the client's invoice sequence.
export async function createInvoice(params: {
  client: Client;
  fxUsdCad: number;
  baseItems: BaseItem[];
  extraRows?: { label: string; amount_cad: number; note?: string }[];
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
}): Promise<Invoice> {
  const { client, fxUsdCad, baseItems, extraRows = [], periodStart, periodEnd, notes } = params;
  const rows = [
    ...baseItems
      .filter((i) => i.active)
      .map((i, idx) => ({
        label:
          i.currency === 'USD'
            ? `${i.label} (USD ${i.amount.toFixed(2)} @ ${fxUsdCad.toFixed(4)})`
            : i.label,
        amount_cad: cadEquivalent(i.amount, i.currency, fxUsdCad),
        source: 'base' as const,
        note: null as string | null,
        sort_order: idx,
      })),
    ...extraRows.map((r, idx) => ({
      label: r.label,
      amount_cad: round2(r.amount_cad),
      source: 'oneoff' as const,
      note: r.note ?? null,
      sort_order: 100 + idx,
    })),
  ];
  const subtotal = round2(rows.reduce((sum, r) => sum + r.amount_cad, 0));
  const taxes = computeTaxes(subtotal);
  const year = new Date().getFullYear();
  const number = `${client.invoice_prefix ?? client.slug.toUpperCase()}-${year}-${String(client.next_invoice_seq).padStart(3, '0')}`;

  const { data: inv, error } = await supabase
    .from('invoices')
    .insert({
      client_id: client.id,
      number,
      period_start: periodStart ?? null,
      period_end: periodEnd ?? null,
      status: 'draft',
      fx_usd_cad: fxUsdCad,
      subtotal_cad: subtotal,
      gst: taxes.gst,
      qst: taxes.qst,
      total_cad: taxes.total,
      notes: notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  const invoice = inv as Invoice;

  await supabase
    .from('invoice_line_items')
    .insert(rows.map((r) => ({ invoice_id: invoice.id, ...r })));
  await supabase
    .from('invoice_clients')
    .update({ next_invoice_seq: client.next_invoice_seq + 1 })
    .eq('id', client.id);

  return invoice;
}
