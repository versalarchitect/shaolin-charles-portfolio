// 2026 Quebec self-employed (sole proprietor) income-tax + contributions estimator.
//
// IMPORTANT: this is SEPARATE from the GST/QST on invoices. GST/QST is sales tax you collect and
// remit — never your income. This module estimates what actually reduces what you KEEP: federal +
// Quebec income tax (progressive), QPP (self-employed pays both halves), and QPIP — all on NET
// self-employment income. It is an ESTIMATE for setting money aside, not tax advice.
//
// 2026 figures — sources: CRA / TaxTips.ca, Revenu Québec, Retraite Québec, RQAP.

export const TAX_YEAR = 2026;

interface Bracket {
  upTo: number;
  rate: number;
}

// Federal — lowest rate reduced to 14% effective for all of 2026.
const FEDERAL_BRACKETS: Bracket[] = [
  { upTo: 58_523, rate: 0.14 },
  { upTo: 117_045, rate: 0.205 },
  { upTo: 181_440, rate: 0.26 },
  { upTo: 258_482, rate: 0.29 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.33 },
];
const FEDERAL_BPA_BASE = 14_829;
const FEDERAL_BPA_ADDITIONAL = 1_623; // phases out between the two thresholds below
const FEDERAL_BPA_PHASEOUT_START = 181_440;
const FEDERAL_BPA_PHASEOUT_END = 258_482;
const QUEBEC_ABATEMENT = 0.165; // Quebec residents: basic federal tax reduced 16.5%

// Quebec — 2026, indexed 2.05%.
const QUEBEC_BRACKETS: Bracket[] = [
  { upTo: 54_345, rate: 0.14 },
  { upTo: 108_680, rate: 0.19 },
  { upTo: 132_245, rate: 0.24 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.2575 },
];
const QUEBEC_BPA = 18_952;
const CREDIT_RATE = 0.14; // both BPAs are credited at the lowest bracket rate

// QPP 2026 — self-employed pays both portions.
const QPP_EXEMPTION = 3_500;
const QPP_YMPE = 74_600;
const QPP_RATE_SE = 0.126; // base 10.6% + additional 2%, self-employed
const QPP2_YAMPE = 85_000;
const QPP2_RATE_SE = 0.08;

// QPIP / RQAP 2026 — self-employed.
const QPIP_RATE_SE = 0.00808;
const QPIP_MAX_INSURABLE = 103_000;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function bracketTax(income: number, brackets: Bracket[]): number {
  let tax = 0;
  let lower = 0;
  for (const b of brackets) {
    if (income <= lower) break;
    tax += (Math.min(income, b.upTo) - lower) * b.rate;
    lower = b.upTo;
  }
  return tax;
}

function marginalBracketRate(income: number, brackets: Bracket[]): number {
  for (const b of brackets) {
    if (income <= b.upTo) return b.rate;
  }
  return brackets[brackets.length - 1].rate;
}

function federalBpa(net: number): number {
  if (net <= FEDERAL_BPA_PHASEOUT_START) return FEDERAL_BPA_BASE + FEDERAL_BPA_ADDITIONAL;
  if (net >= FEDERAL_BPA_PHASEOUT_END) return FEDERAL_BPA_BASE;
  const frac =
    (net - FEDERAL_BPA_PHASEOUT_START) / (FEDERAL_BPA_PHASEOUT_END - FEDERAL_BPA_PHASEOUT_START);
  return FEDERAL_BPA_BASE + FEDERAL_BPA_ADDITIONAL * (1 - frac);
}

/** Total self-employed QPP contribution (base + additional + QPP2) on net SE income. */
export function qppContribution(seIncome: number): number {
  const base = QPP_RATE_SE * clamp(seIncome - QPP_EXEMPTION, 0, QPP_YMPE - QPP_EXEMPTION);
  const qpp2 = QPP2_RATE_SE * clamp(seIncome - QPP_YMPE, 0, QPP2_YAMPE - QPP_YMPE);
  return base + qpp2;
}

/** Self-employed QPIP/RQAP premium on net SE income. */
export function qpipPremium(income: number): number {
  return QPIP_RATE_SE * clamp(income, 0, QPIP_MAX_INSURABLE);
}

export interface TaxReserve {
  netIncome: number;
  federalTax: number;
  quebecTax: number;
  incomeTax: number;
  qpp: number;
  qpip: number;
  totalReserve: number;
  takeHome: number;
  effectiveRate: number;
  marginalRate: number;
}

/**
 * Estimate income tax + QPP + QPIP to set aside on NET self-employment income (Quebec sole
 * proprietor, 2026). About half the QPP contribution is deductible from taxable income (standard
 * self-employed treatment, approximated here). Excludes business expenses — feed NET income.
 */
export function computeTaxReserve(netIncome: number): TaxReserve {
  const income = Math.max(0, netIncome);
  const qpp = qppContribution(income);
  const qpip = qpipPremium(income);
  const taxable = Math.max(0, income - qpp / 2);

  const federalBasic = Math.max(
    0,
    bracketTax(taxable, FEDERAL_BRACKETS) - federalBpa(taxable) * CREDIT_RATE,
  );
  const federalTax = federalBasic * (1 - QUEBEC_ABATEMENT);
  const quebecTax = Math.max(0, bracketTax(taxable, QUEBEC_BRACKETS) - QUEBEC_BPA * CREDIT_RATE);
  const incomeTax = federalTax + quebecTax;
  const totalReserve = incomeTax + qpp + qpip;

  return {
    netIncome: income,
    federalTax,
    quebecTax,
    incomeTax,
    qpp,
    qpip,
    totalReserve,
    takeHome: income - totalReserve,
    effectiveRate: income > 0 ? totalReserve / income : 0,
    marginalRate: marginalRate(income),
  };
}

/** Combined marginal rate on the next dollar at `income` (income tax + QPP/QPIP under ceilings). */
export function marginalRate(income: number): number {
  const federal = marginalBracketRate(income, FEDERAL_BRACKETS) * (1 - QUEBEC_ABATEMENT);
  const quebec = marginalBracketRate(income, QUEBEC_BRACKETS);
  let payroll = 0;
  if (income > QPP_EXEMPTION && income <= QPP_YMPE) payroll += QPP_RATE_SE;
  else if (income > QPP_YMPE && income <= QPP2_YAMPE) payroll += QPP2_RATE_SE;
  if (income <= QPIP_MAX_INSURABLE) payroll += QPIP_RATE_SE;
  return federal + quebec + payroll;
}

export interface BracketRung {
  from: number;
  to: number; // Number.POSITIVE_INFINITY for the top rung
  federalRate: number; // after the 16.5% Quebec abatement
  quebecRate: number;
  combinedRate: number; // combined income-tax marginal (excludes QPP/QPIP)
}

// The combined federal + Quebec income-tax marginal ladder (the union of both threshold sets).
export function combinedBrackets(): BracketRung[] {
  const cuts = Array.from(
    new Set([...FEDERAL_BRACKETS.map((b) => b.upTo), ...QUEBEC_BRACKETS.map((b) => b.upTo)]),
  )
    .filter((x) => Number.isFinite(x))
    .sort((a, b) => a - b);
  const rungs: BracketRung[] = [];
  let from = 0;
  for (const to of [...cuts, Number.POSITIVE_INFINITY]) {
    const mid = Number.isFinite(to) ? (from + to) / 2 : from + 1;
    const federalRate = marginalBracketRate(mid, FEDERAL_BRACKETS) * (1 - QUEBEC_ABATEMENT);
    const quebecRate = marginalBracketRate(mid, QUEBEC_BRACKETS);
    rungs.push({ from, to, federalRate, quebecRate, combinedRate: federalRate + quebecRate });
    from = to;
  }
  return rungs;
}

export interface BracketPosition {
  rungs: BracketRung[];
  index: number;
  current: BracketRung;
  nextThreshold: number | null;
  roomToNext: number | null;
  nextRate: number | null;
}

// Where `income` sits on the combined income-tax ladder, and the distance to the next jump.
export function bracketPosition(income: number): BracketPosition {
  const rungs = combinedBrackets();
  let index = rungs.findIndex((r) => income < r.to);
  if (index === -1) index = rungs.length - 1;
  const current = rungs[index];
  const next = rungs[index + 1] ?? null;
  return {
    rungs,
    index,
    current,
    nextThreshold: next ? current.to : null,
    roomToNext: next ? Math.max(0, current.to - income) : null,
    nextRate: next ? next.combinedRate : null,
  };
}
