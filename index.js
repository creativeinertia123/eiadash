import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { fetchAllEiaSeries } from './eia.js';
import { addDerivedSeries, computeMetrics } from './metrics.js';
import { generateAnalysis } from './deepseek.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const CACHE_MS = 15 * 60 * 1000;
const PORT = Number(process.env.PORT || 3000);
const state = { cache: null, refresh: null, lastError: null };

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Request limit reached' },
}));

function versionOf(series) {
  return createHash('sha256').update(JSON.stringify(series)).digest('hex').slice(0, 20);
}

async function refreshDashboard({ force = false } = {}) {
  if (!force && state.cache && Date.now() - state.cache.checkedAt < CACHE_MS) return state.cache;
  if (state.refresh) return state.refresh;
  const operation = (async () => {
    try {
      const series = addDerivedSeries(await fetchAllEiaSeries());
      const metrics = computeMetrics(series);
      const next = {
        series,
        metrics,
        version: versionOf(series),
        updatedAt: new Date().toISOString(),
        checkedAt: Date.now(),
      };
      const dataChanged = state.cache?.version !== next.version;
      state.cache = next;
      state.lastError = null;
      if (dataChanged) {
        generateAnalysis(analysisPacket(next)).catch(() => console.warn('DeepSeek analysis unavailable'));
      }
      return next;
    } catch (error) {
      state.lastError = error?.message || 'EIA update unavailable';
      if (state.cache) return state.cache;
      throw new Error('EIA data unavailable');
    }
  })();
  state.refresh = operation;
  try {
    return await operation;
  } finally {
    state.refresh = null;
  }
}

function dashboardResponse(cache) {
  return {
    data: cache.series,
    metrics: cache.metrics.metrics,
    period: cache.metrics.period,
    currentYear: cache.metrics.currentYear,
    version: cache.version,
    updatedAt: cache.updatedAt,
    stale: Boolean(state.lastError),
    updateMessage: state.lastError ? 'EIA update unavailable' : null,
  };
}

function analysisPacket(cache) {
  const metrics = Object.fromEntries(Object.entries(cache.metrics.metrics).map(([key, metric]) => [key, {
    label: metric.label,
    period: metric.period,
    latest: metric.latest,
    change: metric.change,
    yoyPct: metric.yoyPct,
    seasonalAverage: metric.seasonalAverage,
    seasonalGap: metric.seasonalGap,
    seasonalGapPct: metric.seasonalGapPct,
    fourWeekYoY: metric.fourWeekYoY,
    unit: metric.unit,
  }]));
  return { period: cache.metrics.period, currentYear: cache.metrics.currentYear, metrics };
}

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));
app.get('/api/status', (_req, res) => {
  const cache = state.cache;
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    available: Boolean(cache),
    version: cache?.version || null,
    period: cache?.metrics.period || null,
    updatedAt: cache?.updatedAt || null,
    stale: Boolean(cache && state.lastError),
  });
});

app.get('/api/dashboard', async (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const cache = await refreshDashboard();
    res.json(dashboardResponse(cache));
  } catch {
    res.status(503).json({ error: 'EIA data unavailable' });
  }
});

app.get('/api/analysis', async (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const cache = await refreshDashboard();
    const analysis = await generateAnalysis(analysisPacket(cache));
    res.json({ analysis, version: cache.version });
  } catch (error) {
    const message = error?.message?.startsWith('DeepSeek') ? error.message : 'Analysis unavailable';
    res.status(503).json({ error: message });
  }
});

const refreshLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Refresh limit reached' },
});
app.post('/api/refresh', refreshLimiter, async (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const cache = await refreshDashboard({ force: true });
    let analysis = null;
    let analysisError = null;
    try {
      analysis = await generateAnalysis(analysisPacket(cache));
    } catch (error) {
      analysisError = error?.message?.startsWith('DeepSeek') ? error.message : 'Analysis unavailable';
    }
    res.json({ dashboard: dashboardResponse(cache), analysis, analysisError });
  } catch {
    res.status(503).json({ error: 'EIA data unavailable' });
  }
});

app.use(express.static(distDir, {
  index: false,
  fallthrough: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    else res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  },
}));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || path.extname(req.path)) return next();
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(distDir, 'index.html'), (error) => error && next(error));
});
app.use((error, _req, res, _next) => {
  if (res.headersSent) return;
  res.status(500).json({ error: 'Request unavailable' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.info(`CC server ready on ${PORT}`);
  refreshDashboard({ force: true }).catch(() => console.warn('EIA refresh unavailable'));
  const poll = setInterval(() => {
    refreshDashboard({ force: true }).catch(() => console.warn('EIA refresh unavailable'));
  }, CACHE_MS);
  poll.unref();
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
