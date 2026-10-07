const API_BASE = 'https://api.eia.gov/v2/petroleum';
const HISTORY_YEARS = 12;
const PAGE_SIZE = 5000;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const SERIES_MAP = {
  'stoc/wstk': {
    crude_comm: 'WCESTUS1', spr: 'WCSSTUS1', cushing: 'W_EPC0_SAX_YCUOK_MBBL',
    crude_p1: 'WCESTP11', crude_p2: 'WCESTP21', crude_p3: 'WCESTP31', crude_p4: 'WCESTP41', crude_p5: 'WCESTP51',
    crude_total: 'WCRSTUS1', gasoline: 'WGTSTUS1', distillate: 'WDISTUS1', jet: 'WKJSTUS1',
    total_oil: 'WTTSTUS1',
  },
  'pnp/wiup': {
    ref_util: 'WPULEUS3', ref_util_p1: 'W_NA_YUP_R10_PER', ref_util_p2: 'W_NA_YUP_R20_PER',
    ref_util_p3: 'W_NA_YUP_R30_PER', ref_util_p4: 'W_NA_YUP_R40_PER', ref_util_p5: 'W_NA_YUP_R50_PER',
    ref_inputs: 'WCRRIUS2', ref_inputs_p3: 'WCRRIP32',
  },
  'cons/wpsup': {
    gasoline_supplied: 'WGFUPUS2', distillate_supplied: 'WDIUPUS2',
    jet_supplied: 'WKJUPUS2', products_supplied: 'WRPUPUS2',
  },
  'sum/sndw': {
    crude_production: 'WCRFPUS2', alaska_production: 'W_EPC0_FPF_SAK_MBBLD',
    gasoline_production: 'WGFRPUS2',
  },
  'pnp/wprodr': {
    distillate_production: 'W_EPD0_YPY_NUS_MBBLD', jet_production: 'W_EPJK_YPY_NUS_MBBLD',
  },
  'move/wkly': {
    crude_imports: 'WCRIMUS2', crude_exports: 'WCREXUS2', crude_net_imports: 'WCRNTUS2',
    product_imports: 'WRPIMUS2', product_exports: 'WRPEXUS2',
    distillate_exports: 'WDIEXUS2', total_exports: 'WTTEXUS2',
  },
};

async function fetchBatch(route, ids, start, apiKey) {
  const rows = [];
  for (let i = 0; i < ids.length; i += 8) {
    const chunk = ids.slice(i, i + 8);
    let offset = 0;
    while (true) {
      const query = new URLSearchParams({
        api_key: apiKey,
        frequency: 'weekly',
        'data[0]': 'value',
        start,
        'sort[0][column]': 'period',
        'sort[0][direction]': 'asc',
        length: String(PAGE_SIZE),
        offset: String(offset),
      });
      chunk.forEach((seriesId) => query.append('facets[series][]', seriesId));
      let response;
      try {
        response = await fetch(`${API_BASE}/${route}/data/?${query.toString()}`, { signal: AbortSignal.timeout(35000) });
      } catch {
        throw new Error('EIA connection failed');
      }
      if (!response.ok) throw new Error(`EIA response ${response.status}`);
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error('EIA response invalid');
      }
      if (payload.error || !Array.isArray(payload.response?.data)) throw new Error('EIA response invalid');
      const page = payload.response.data;
      rows.push(...page);
      if (page.length < PAGE_SIZE) break;
      offset += page.length;
      await delay(120);
    }
    await delay(150);
  }
  return rows;
}

export async function fetchAllEiaSeries() {
  const apiKey = process.env.EIA_API_KEY?.trim();
  if (!apiKey) throw new Error('EIA key missing');
  const startDate = new Date(Date.now() - HISTORY_YEARS * 365.25 * 86400000);
  const start = startDate.toISOString().slice(0, 10);
  const result = Object.fromEntries(Object.values(SERIES_MAP).flatMap((mapping) => Object.keys(mapping).map((label) => [label, []])));

  for (const [route, mapping] of Object.entries(SERIES_MAP)) {
    const rows = await fetchBatch(route, Object.values(mapping), start, apiKey);
    const byId = new Map();
    for (const row of rows) {
      if (row.value === null || row.value === undefined) continue;
      const value = Number(row.value);
      if (!Number.isFinite(value) || !row.period) continue;
      if (!byId.has(row.series)) byId.set(row.series, []);
      byId.get(row.series).push({ p: row.period, v: value });
    }
    for (const [label, seriesId] of Object.entries(mapping)) {
      result[label] = (byId.get(seriesId) || []).sort((a, b) => a.p.localeCompare(b.p));
    }
  }
  if (Object.values(result).some((rows) => !rows.length)) throw new Error('EIA series unavailable');
  if (!result.crude_comm?.length) throw new Error('EIA data unavailable');
  return result;
}
