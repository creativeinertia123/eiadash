export const DERIVED_SERIES = {
  cushing_plus_p3: { add: ['cushing', 'crude_p3'], sub: [] },
  gdj_stocks: { add: ['gasoline', 'distillate', 'jet'], sub: [] },
  product_stocks: { add: ['total_oil'], sub: ['crude_total'] },
  comm_oil_stocks: { add: ['total_oil'], sub: ['spr'] },
  l48_production: { add: ['crude_production'], sub: ['alaska_production'] },
};

export const SERIES_META = {
  crude_comm: { label: 'Commercial crude', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  cushing: { label: 'Cushing', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  cushing_plus_p3: { label: 'Cushing + PADD 3', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_p1: { label: 'Crude — PADD 1', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_p2: { label: 'Crude — PADD 2', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_p3: { label: 'Crude — PADD 3', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_p4: { label: 'Crude — PADD 4', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_p5: { label: 'Crude — PADD 5', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  crude_total: { label: 'Crude incl. SPR', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  spr: { label: 'SPR', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  gasoline: { label: 'Gasoline stocks', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  distillate: { label: 'Distillate stocks', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  jet: { label: 'Jet fuel stocks', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  gdj_stocks: { label: 'Gasoline + distillate + jet', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  total_oil: { label: 'Total oil stocks', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  product_stocks: { label: 'Total product stocks', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  comm_oil_stocks: { label: 'Commercial oil ex SPR', scale: 1000, unit: 'million bbl', precision: 1, group: 'stocks' },
  ref_util: { label: 'Refinery utilisation', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_util_p1: { label: 'Utilisation — PADD 1', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_util_p2: { label: 'Utilisation — PADD 2', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_util_p3: { label: 'Utilisation — PADD 3', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_util_p4: { label: 'Utilisation — PADD 4', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_util_p5: { label: 'Utilisation — PADD 5', scale: 1, unit: '%', precision: 1, group: 'refinery' },
  ref_inputs: { label: 'Refinery crude inputs', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'refinery' },
  ref_inputs_p3: { label: 'Crude inputs — PADD 3', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'refinery' },
  products_supplied: { label: 'Total products supplied', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'demand' },
  gasoline_supplied: { label: 'Gasoline supplied', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'demand' },
  distillate_supplied: { label: 'Distillate supplied', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'demand' },
  jet_supplied: { label: 'Jet supplied', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'demand' },
  crude_production: { label: 'US crude production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  alaska_production: { label: 'Alaska production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  l48_production: { label: 'Lower-48 production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  gasoline_production: { label: 'Gasoline production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  distillate_production: { label: 'Distillate production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  jet_production: { label: 'Jet production', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'production' },
  crude_imports: { label: 'Crude imports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  crude_exports: { label: 'Crude exports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  crude_net_imports: { label: 'Crude net imports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  product_imports: { label: 'Product imports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  product_exports: { label: 'Product exports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  distillate_exports: { label: 'Distillate exports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
  total_exports: { label: 'Total crude + product exports', scale: 1000, unit: 'million bbl/day', precision: 2, group: 'trade' },
};

export const TABLE_ROWS = [
  { key: 'crude_comm', label: 'Commercial crude', inventory: true },
  { key: 'cushing', label: 'Cushing', inventory: true },
  { key: 'crude_p4', label: 'PADD 4 crude', inventory: true },
  { key: 'spr', label: 'SPR', inventory: true },
  { key: 'gasoline', label: 'Gasoline stocks', inventory: true },
  { key: 'distillate', label: 'Distillate stocks', inventory: true },
  { key: 'jet', label: 'Jet fuel stocks', inventory: true },
  { key: 'product_stocks', label: 'Total product stocks', inventory: true },
  { key: 'ref_inputs', label: 'Refinery inputs', inventory: false },
  { key: 'ref_util', label: 'Refinery utilisation', inventory: false },
  { key: 'ref_util_p4', label: 'PADD 4 utilisation', inventory: false },
  { key: 'crude_production', label: 'Crude production', inventory: false },
  { key: 'crude_imports', label: 'Crude imports', inventory: false },
  { key: 'crude_exports', label: 'Crude exports', inventory: false },
  { key: 'crude_net_imports', label: 'Crude net imports', inventory: false },
  { key: 'product_exports', label: 'Product exports', inventory: false },
  { key: 'products_supplied', label: 'Products supplied', inventory: false },
];

const isoWeek = (period) => {
  const d = new Date(`${period}T00:00:00Z`);
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  return 1 + Math.round((d - firstThursday) / (7 * 864e5));
};

const yearOf = (period) => Number.parseInt(String(period).slice(0, 4), 10);
const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

function seasonalAverage(rows, period, years = 5) {
  if (!rows?.length) return null;
  const week = isoWeek(period);
  const year = yearOf(period);
  const values = [];
  for (let targetYear = year - years; targetYear < year; targetYear += 1) {
    const sameYear = rows.filter((row) => yearOf(row.p) === targetYear);
    if (!sameYear.length) continue;
    const nearest = sameYear.reduce((best, row) => Math.abs(isoWeek(row.p) - week) < Math.abs(isoWeek(best.p) - week) ? row : best);
    values.push(nearest.v);
  }
  return mean(values);
}

function yearOnYear(rows) {
  if (!rows?.length) return null;
  const last = rows.at(-1);
  const priorYear = rows.filter((row) => yearOf(row.p) === yearOf(last.p) - 1);
  if (!priorYear.length || last.v === 0) return null;
  const week = isoWeek(last.p);
  const nearest = priorYear.reduce((best, row) => Math.abs(isoWeek(row.p) - week) < Math.abs(isoWeek(best.p) - week) ? row : best);
  return (last.v / nearest.v - 1) * 100;
}

function fourWeekYoY(rows) {
  if (!rows || rows.length < 4) return null;
  const last = rows.at(-1);
  const week = isoWeek(last.p);
  const year = yearOf(last.p);
  const target = rows.findIndex((row) => yearOf(row.p) === year - 1 && isoWeek(row.p) === week);
  if (target < 3) return null;
  const currentAverage = mean(rows.slice(-4).map((row) => row.v));
  const priorAverage = mean(rows.slice(target - 3, target + 1).map((row) => row.v));
  return priorAverage ? (currentAverage / priorAverage - 1) * 100 : null;
}

function rounded(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function addDerivedSeries(input) {
  const series = { ...input };
  for (const [name, formula] of Object.entries(DERIVED_SERIES)) {
    const required = [...formula.add, ...formula.sub];
    if (required.some((key) => !Array.isArray(series[key]) || !series[key].length)) {
      series[name] = [];
      continue;
    }
    const maps = required.map((key) => new Map(series[key].map((row) => [row.p, row.v])));
    const periods = [...maps[0].keys()].filter((period) => maps.every((map) => map.has(period))).sort();
    series[name] = periods.map((p) => ({
      p,
      v: formula.add.reduce((sum, key) => sum + series[key].find((row) => row.p === p).v, 0)
        - formula.sub.reduce((sum, key) => sum + series[key].find((row) => row.p === p).v, 0),
    }));
  }
  return series;
}

export function computeMetrics(series) {
  const metrics = {};
  for (const [key, meta] of Object.entries(SERIES_META)) {
    const rows = series[key] || [];
    if (!rows.length) {
      metrics[key] = { ...meta, period: null, latest: null, change: null, yoyPct: null, seasonalAverage: null, seasonalGap: null, seasonalGapPct: null, fourWeekYoY: null };
      continue;
    }
    const last = rows.at(-1);
    const previous = rows.at(-2);
    const seasonalRaw = seasonalAverage(rows, last.p);
    const scale = meta.scale;
    metrics[key] = {
      ...meta,
      period: last.p,
      latest: rounded(last.v / scale, meta.precision),
      change: previous ? rounded((last.v - previous.v) / scale, meta.precision) : null,
      yoyPct: rounded(yearOnYear(rows), 1),
      seasonalAverage: seasonalRaw === null ? null : rounded(seasonalRaw / scale, meta.precision),
      seasonalGap: seasonalRaw === null ? null : rounded((last.v - seasonalRaw) / scale, meta.precision),
      seasonalGapPct: seasonalRaw && seasonalRaw !== 0 ? rounded((last.v / seasonalRaw - 1) * 100, 1) : null,
      fourWeekYoY: meta.group === 'demand' ? rounded(fourWeekYoY(rows), 1) : null,
    };
  }
  const periods = (series.crude_comm || []).map((row) => row.p);
  const period = periods.at(-1) || null;
  return { period, currentYear: period ? yearOf(period) : null, metrics };
}
