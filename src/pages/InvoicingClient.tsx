import { ArrowLeft, FileText } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  adjustBase,
  type BaseChange,
  type BaseItem,
  baseSubtotalCad,
  type Client,
  type Currency,
  cadEquivalent,
  computeTaxes,
  createInvoice,
  fetchFxUsdCad,
  getClientBySlug,
  type Invoice,
  listBaseChanges,
  listBaseItems,
  listInvoices,
} from '@/lib/invoicing';

const cad = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
const inputCls =
  'w-full rounded-lg border-2 border-foreground/10 bg-transparent px-3 py-2 text-sm placeholder:text-foreground/30 outline-none transition-colors focus:border-foreground/30';

export default function InvoicingClient() {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [items, setItems] = useState<BaseItem[]>([]);
  const [changes, setChanges] = useState<BaseChange[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fx, setFx] = useState(1.38);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('CAD');
  const [reason, setReason] = useState('');

  const reload = useCallback(async (c: Client) => {
    const [bi, bc, inv] = await Promise.all([
      listBaseItems(c.id),
      listBaseChanges(c.id),
      listInvoices(c.id),
    ]);
    setItems(bi);
    setChanges(bc);
    setInvoices(inv);
  }, []);

  useEffect(() => {
    if (!clientSlug) return;
    setLoading(true);
    (async () => {
      const [c, rate] = await Promise.all([getClientBySlug(clientSlug), fetchFxUsdCad()]);
      setClient(c);
      setFx(rate);
      if (c) await reload(c);
      setLoading(false);
    })();
  }, [clientSlug, reload]);

  const activeItems = useMemo(() => items.filter((i) => i.active), [items]);
  const subtotal = useMemo(() => baseSubtotalCad(items, fx), [items, fx]);
  const taxes = useMemo(() => computeTaxes(subtotal), [subtotal]);

  async function onAdjust(e: FormEvent) {
    e.preventDefault();
    if (!client) return;
    const amt = Number(amount);
    if (!label.trim() || !Number.isFinite(amt) || amt === 0) {
      toast.error('Add a label and a non-zero amount.');
      return;
    }
    setBusy(true);
    try {
      await adjustBase({
        clientId: client.id,
        label: label.trim(),
        amount: amt,
        currency,
        reason: reason.trim(),
      });
      toast.success(`Base updated: ${label.trim()} (${amt > 0 ? '+' : ''}${amt} ${currency})`);
      setLabel('');
      setAmount('');
      setReason('');
      setCurrency('CAD');
      await reload(client);
    } catch (err) {
      toast.error(String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onGenerate() {
    if (!client) return;
    setBusy(true);
    try {
      const inv = await createInvoice({ client, fxUsdCad: fx, baseItems: items });
      toast.success(`Invoice ${inv.number} created — ${cad(inv.total_cad)}`);
      const fresh = await getClientBySlug(client.slug);
      if (fresh) {
        setClient(fresh);
        await reload(fresh);
      }
    } catch (err) {
      toast.error(String(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 font-mono text-sm text-foreground/40">
        Loading…
      </div>
    );
  }
  if (!client) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        Client not found.{' '}
        <Link to=".." className="underline">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <Link
        to=".."
        className="inline-flex items-center gap-1.5 text-sm text-foreground/40 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Invoicing
      </Link>

      <div className="mb-8 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="mt-1 font-mono text-xs text-foreground/40">
            {client.pay_cadence} · next invoice #{client.next_invoice_seq} · USD→CAD {fx.toFixed(4)}
          </p>
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" /> Generate invoice
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* The base + live preview */}
        <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 lg:col-span-3">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-foreground/40">
            The base
          </h2>
          <div>
            {activeItems.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between border-b border-foreground/[0.06] py-2.5 last:border-0"
              >
                <div>
                  <p className="text-sm">{i.label}</p>
                  {i.currency === 'USD' && (
                    <p className="font-mono text-xs text-foreground/40">
                      USD {i.amount.toFixed(2)} @ {fx.toFixed(4)}
                    </p>
                  )}
                </div>
                <span className="font-mono text-sm">
                  {cad(cadEquivalent(i.amount, i.currency, fx))}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 font-mono text-sm">
            <Row label="Subtotal" value={cad(subtotal)} />
            <Row label="GST/HST (TPS) 5%" value={cad(taxes.gst)} muted />
            <Row label="QST (TVQ) 9.975%" value={cad(taxes.qst)} muted />
            <div className="my-1 h-px bg-foreground/10" />
            <Row label="Total" value={cad(taxes.total)} bold />
          </div>
        </div>

        {/* Adjust the base */}
        <form
          onSubmit={onAdjust}
          className="space-y-3 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 lg:col-span-2"
        >
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/40">
            Adjust the base
          </h2>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="What changed (e.g. Marketing)"
            className={inputCls}
          />
          <div className="flex gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="+ amount"
              className={inputCls}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className={`${inputCls} w-24`}
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why (e.g. replacing the marketing dept)"
            className={inputCls}
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Add to base
          </button>
          <p className="text-xs text-foreground/40">
            Use a negative amount to decrease. Each change adjusts what you charge and is logged
            below with its reason.
          </p>
        </form>
      </div>

      {changes.length > 0 && (
        <div className="mt-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-foreground/40">
            Base history
          </h2>
          <div className="space-y-3">
            {changes.map((ch) => (
              <div key={ch.id} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p>
                    {ch.label}
                    {ch.reason && <span className="text-foreground/40"> — {ch.reason}</span>}
                  </p>
                  <p className="font-mono text-xs text-foreground/30">
                    {new Date(ch.created_at).toLocaleDateString('en-CA')}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-foreground/70">
                  {ch.delta_amount >= 0 ? '+' : ''}
                  {ch.delta_amount} {ch.currency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {invoices.length > 0 && (
        <div className="mt-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-foreground/40">
            Invoices
          </h2>
          <div>
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between border-b border-foreground/[0.06] py-2.5 text-sm last:border-0"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-foreground/30" />
                  <span className="font-mono">{inv.number}</span>
                  <span className="text-foreground/40">{inv.issue_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono">{cad(inv.total_cad)}</span>
                  <span className="font-mono text-xs uppercase text-foreground/40">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? 'font-semibold text-foreground' : muted ? 'text-foreground/50' : 'text-foreground/80'
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
