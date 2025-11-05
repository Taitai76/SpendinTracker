// netlify/functions/api.js
const { getStore } = require('@netlify/blobs');

// --- helpers ---
const json = (status, data) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
  body: JSON.stringify(data),
});
const ok  = (data, status = 200) => json(status, data);
const err = (message, status = 500, detail) => json(status, { error: message, detail });

// in-memory fallback so the API never 500s (NOT persistent)
const _mem = {};
const memStore = (bucket) => ({
  async get(key) {
    const v = _mem[`${bucket}:${key}`];
    try { return v ? JSON.parse(v) : null; } catch { return null; }
  },
  async set(key, value) {
    _mem[`${bucket}:${key}`] = typeof value === 'string' ? value : JSON.stringify(value);
  }
});

// Try to create a Blobs store; if not configured, fall back to memory.
// manual env config (BLOBS_SITE_ID + BLOBS_TOKEN).
function safeGetStore(bucket) {
  const opts = {};
  if (process.env.BLOBS_SITE_ID && process.env.BLOBS_TOKEN) {
    opts.siteID = process.env.BLOBS_SITE_ID;
    opts.token  = process.env.BLOBS_TOKEN;
  }
  try {
    // Will throw MissingBlobsEnvironmentError if Blobs isn't enabled and no opts provided
    return Object.keys(opts).length ? getStore(bucket, opts) : getStore(bucket);
  } catch (e) {
    console.warn(`Blobs not configured, using in-memory store for "${bucket}"`, e.message || e);
    return memStore(bucket);
  }
}

async function readJSON(store, key, fallback) {
  try {
    const val = await store.get(key, { type: 'json' }); // auto-parses JSON (when supported)
    return val ?? fallback;
  } catch (e) {
    // memory store's get() above returns raw string; handle both
    try {
      const raw = await store.get(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
}

async function writeJSON(store, key, value) {
  try {
    await store.set(key, JSON.stringify(value), { contentType: 'application/json' });
  } catch {
    // memory store's set() can take object directly
    await store.set(key, value);
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });

    const rawPath = event.path || '';
    let subpath = rawPath;


    if (resource === 'health') return ok({ ok: true });

    const incomeStore    = safeGetStore('income');
    const expensesStore  = safeGetStore('expenses');

    // initialize defaults once
    const currIncome = await readJSON(incomeStore, 'current', { amount: 0 });
    await writeJSON(incomeStore, 'current', currIncome);
    let list = await readJSON(expensesStore, 'list', []);
    if (!Array.isArray(list)) list = [];
    await writeJSON(expensesStore, 'list', list);

    // admin reset
    if (resource === 'admin' && id === 'reset' && event.httpMethod === 'GET') {
      await writeJSON(incomeStore, 'current', { amount: 0 });
      await writeJSON(expensesStore, 'list', []);
      return ok({ ok: true, reset: true });
    }

    // routes
    if (resource === 'income') {
      if (event.httpMethod === 'GET') {
        const val = await readJSON(incomeStore, 'current', { amount: 0 });
        return ok(val);
      }
      if (event.httpMethod === 'PATCH') {
        let body = {};
        try { body = JSON.parse(event.body || '{}'); } catch {}
        const next = { amount: Number(body.amount ?? 0) };
        await writeJSON(incomeStore, 'current', next);
        return ok(next);
      }
      return err('Method not allowed', 405);
    }

    if (resource === 'expenses') {
      // GET
      if (event.httpMethod === 'GET') {
        if (id) {
          const item = list.find(x => String(x.id) === String(id));
          return item ? ok(item) : err('Not found', 404);
        }
        return ok(list);
      }
      // POST
      if (event.httpMethod === 'POST') {
        let body = {};
        try { body = JSON.parse(event.body || '{}'); } catch {}
        const newItem = {
          id: list.length ? Math.max(...list.map(x => Number(x.id))) + 1 : 1,
          name: String(body.name || '').trim(),
          amount: Number(body.amount || 0),
          date: String(body.date || ''),
        };
        list = [...list, newItem];
        await writeJSON(expensesStore, 'list', list);
        return ok(newItem, 201);
      }
      // DELETE
      if (event.httpMethod === 'DELETE') {
        if (!id) return err('Missing id', 400);
        const exists = list.some(x => String(x.id) === String(id));
        list = list.filter(x => String(x.id) !== String(id));
        await writeJSON(expensesStore, 'list', list);
        return exists ? ok({ ok: true }) : err('Not found', 404);
      }
      return err('Method not allowed', 405);
    }

    return err('Unknown endpoint', 404, { path: subpath });
  } catch (e) {
    console.error('Handler crash:', e);
    return err('Server error', 500, String(e && e.message ? e.message : e));
  }
};
