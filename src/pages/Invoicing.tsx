import { ArrowRight, BarChart3, PiggyBank, Receipt } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  type Client,
  getSettings,
  getYtdNetIncome,
  type InvoiceSettings,
  listClients,
} from '@/lib/invoicing';
import { bracketPosition, computeTaxReserve, TAX_YEAR } from '@/lib/quebec-tax';

const cad = (n: number) => n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });
const cad0 = (n: number) =>
  n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function Invoicing() {
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    Promise.all([listClients(), getSettings(), getYtdNetIncome()])
      .then(([c, s, ytd]) => {
        setClients(c);
        setSettings(s);
        if (!touched) setIncome(ytd);
      })
      .finally(() => setLoading(false));
  }, [touched]);

  const reserve = useMemo(() => computeTaxReserve(income), [income]);
  const pos = useMemo(() => bracketPosition(income), [income]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-foreground/40">Freelance</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Invoicing</h1>
        <p className="mt-2 text-foreground/60">
          Per-client base, taxes, and what to set aside — in one place.
        </p>
      </div>

      {settings && (
        <div className="mb-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
          <p className="font-medium">{settings.business_name}</p>
          <div className="mt-2 grid gap-1 font-mono text-sm text-foreground/50">
            <span>GST/HST (TPS): {settings.gst_number ?? '—'}</span>
            <span>QST (TVQ): {settings.qst_number ?? '—'}</span>
          </div>
        </div>
      )}

      {/* Tax reserve */}
      <div className="mb-6 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <div className="mb-4 flex items-center gap-2">
          <PiggyBank className="h-4 w-4 text-foreground/40" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/40">
            Tax reserve · {TAX_YEAR} · Quebec self-employed
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-5">
          <div className="sm:col-span-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: htmlFor targets the input below */}
            <label className="font-mono text-xs text-foreground/40" htmlFor="income">
              Net income this year (all clients)
            </label>
            <input
              id="income"
              inputMode="decimal"
              value={income ? String(income) : ''}
              placeholder="0"
              onChange={(e) => {
                setTouched(true);
                setIncome(Number(e.target.value) || 0);
              }}
              className="mt-1 w-full rounded-lg border-2 border-foreground/10 bg-transparent px-3 py-2 font-mono text-lg outline-none transition-colors focus:border-foreground/30"
            />
            <p className="mt-2 text-xs text-foreground/40">
              Pre-expense, billed YTD. GST/QST is excluded — collected &amp; remitted, never yours.
            </p>
            <div className="mt-4 rounded-lg bg-foreground/[0.04] p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/40">
                Set aside
              </p>
              <p className="mt-1 font-mono text-2xl font-bold">{cad(reserve.totalReserve)}</p>
              <p className="font-mono text-xs text-foreground/40">
                {pct(reserve.effectiveRate)} effective · {pct(reserve.marginalRate)} on the next
                dollar
              </p>
            </div>
            <div className="mt-3 rounded-lg border border-foreground/10 p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-foreground/40">
                You keep
              </p>
              <p className="mt-1 font-mono text-2xl font-bold">{cad(reserve.takeHome)}</p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <div className="space-y-1.5 font-mono text-sm">
              <Row
                label="Federal income tax (after 16.5% abatement)"
                value={cad(reserve.federalTax)}
                muted
              />
              <Row label="Quebec income tax" value={cad(reserve.quebecTax)} muted />
              <Row label="QPP (self-employed, both halves)" value={cad(reserve.qpp)} muted />
              <Row label="QPIP (parental insurance)" value={cad(reserve.qpip)} muted />
              <div className="my-1 h-px bg-foreground/10" />
              <Row label="Total to set aside" value={cad(reserve.totalReserve)} bold />
              <Row label="Take-home" value={cad(reserve.takeHome)} />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-foreground/40">
              Estimate, not tax advice. Income tax + QPP + QPIP on net self-employment income,
              Quebec 2026. Excludes business expenses (which lower it) and other income (which
              raises the bracket). Verify with your accountant.
            </p>
          </div>
        </div>
      </div>

      {/* Tax brackets ladder */}
      <div className="mb-8 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-foreground/40" />
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground/40">
            Your bracket · combined federal + Quebec
          </h2>
        </div>
        <p className="text-sm text-foreground/70">
          You're in the{' '}
          <span className="font-mono font-bold text-foreground">
            {pct(pos.current.combinedRate)}
          </span>{' '}
          marginal bracket.
          {pos.nextRate != null && pos.roomToNext != null && pos.nextThreshold != null && (
            <>
              {' '}
              Next jump to{' '}
              <span className="font-mono font-bold text-foreground">{pct(pos.nextRate)}</span> at{' '}
              <span className="font-mono">{cad0(pos.nextThreshold)}</span> —{' '}
              <span className="font-mono">{cad0(pos.roomToNext)}</span> away.
            </>
          )}
        </p>
        <div className="mt-4 space-y-1">
          {pos.rungs.map((r, i) => {
            const isCurrent = i === pos.index;
            const width = Math.round((r.combinedRate / 0.535) * 100);
            return (
              <div
                key={r.from}
                className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ${
                  isCurrent ? 'bg-foreground/[0.06]' : ''
                }`}
              >
                <span
                  className={`w-36 shrink-0 font-mono text-xs ${
                    isCurrent ? 'text-foreground' : 'text-foreground/40'
                  }`}
                >
                  {cad0(r.from)}
                  {Number.isFinite(r.to) ? `–${cad0(r.to)}` : '+'}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                  <div
                    className={`h-full rounded-full ${isCurrent ? 'bg-foreground' : 'bg-foreground/30'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span
                  className={`w-14 shrink-0 text-right font-mono text-sm ${
                    isCurrent ? 'font-bold text-foreground' : 'text-foreground/50'
                  }`}
                >
                  {pct(r.combinedRate)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-foreground/40">
          Income-tax marginal only. With QPP + QPIP under their ceilings, your true next-dollar rate
          is <span className="font-mono">{pct(reserve.marginalRate)}</span>.
        </p>
      </div>

      {/* Clients */}
      {loading ? (
        <p className="font-mono text-sm text-foreground/40">Loading…</p>
      ) : clients.length === 0 ? (
        <p className="text-foreground/40">No clients yet.</p>
      ) : (
        <div className="grid gap-3">
          {clients.map((c) => (
            <Link
              key={c.id}
              to={c.slug}
              className="group flex items-center justify-between rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 transition-colors hover:border-foreground/20 hover:bg-foreground/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.05]">
                  <Receipt className="h-5 w-5 text-foreground/60" />
                </div>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="font-mono text-xs text-foreground/40">
                    {c.pay_cadence} · next invoice #{c.next_invoice_seq}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-foreground/60" />
            </Link>
          ))}
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
      className={`flex justify-between gap-4 ${
        bold ? 'font-semibold text-foreground' : muted ? 'text-foreground/50' : 'text-foreground/80'
      }`}
    >
      <span>{label}</span>
      <span className="shrink-0">{value}</span>
    </div>
  );
}
