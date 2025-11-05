import { getStore } from '@netlify/blobs';

// Small helpers
const ok = (data, status = 200) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
  body: JSON.stringify(data),
});
const err = (message, status = 500, detail) =>
  ok({ error: message, detail }, status);

const readJSON = async (store, key, fallback) => {
  try {
    const val = await store.get(key, { type: 'json' }); // parses JSON for us
    return val ?? fallback;
  } catch (e) {
    console.error('readJSON error', key, e);
    return fallback;
  }
};
const writeJSON = async (store, key, value) => {
  try {
    await store.set(key, JSON.stringify(value), { contentType: 'application/json' });
  } catch (e) {
    console.error('writeJSON error', key, e);
    throw e;
  }
};

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });

    // After Netlify redirect, paths look like: "/.netlify/functions/api/expenses/123"
    const rawPath = event.path || '';
    const apiRoot = '/.netlify/functions/api';
    let subpath = rawPath.startsWith(apiRoot) ? rawPath.slice(apiRoot.length) : rawPath;
    if (subpath.startsWith('/')) subpath = subpath.slice(1); // e.g., "expenses/123" or ""

    // Health check: GET /api/health
    if (subpath === 'health') return ok({ ok: true });

    const [resource, id] = subpath.split('/');
    const incomeStore = getStore('income');
    const expensesStore = getStore('expenses');

    // Initialize defaults once (no-ops if already set)
    const incomeDefault = await readJSON(incomeStore, 'current', { amount: 0 });
    await writeJSON(incomeStore, 'current', incomeDefault);
    const expensesDefault = await readJSON(expensesStore, 'list', []);
    await writeJSON(expensesStore, 'list', expensesDefault);

    // Routes
    if (resource === 'income') {
      if (event.httpMethod === 'GET') {
        const income = await readJSON(incomeStore, 'current', { amount: 0 });
        return ok(income);
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
      let list = await readJSON(expensesStore, 'list', []);

      if (event.httpMethod === 'GET') {
        if (id) {
          const item = list.find(x => String(x.id) === String(id));
          return item ? ok(item) : err('Not found', 404);
        }
        return ok(list);
      }

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

      if (event.httpMethod === 'DELETE') {
        if (!id) return err('Missing id', 400);
        const exists = list.some(x => String(x.id) === String(id));
        list = list.filter(x => String(x.id) !== String(id));
        await writeJSON(expensesStore, 'list', list);
        return exists ? ok({ ok: true }) : err('Not found', 404);
      }

      return err('Method not allowed', 405);
    }

    // Unknown route
    return err('Unknown endpoint', 404, { path: subpath });
  } catch (e) {
    console.error('Handler crash', e);
    return err('Server error', 500, String(e && e.message ? e.message : e));
  }
}
