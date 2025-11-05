// netlify/functions/api.js
const { getStore } = require('@netlify/blobs');

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

const ok = (data, status = 200) => json(status, data);
const err = (message, status = 500, detail) => json(status, { error: message, detail });

async function readJSON(store, key, fallback) {
  try {
    const val = await store.get(key, { type: 'json' }); // parses JSON when valid
    return val ?? fallback;
  } catch (e) {
    console.error('readJSON error:', key, e);
    return fallback;
  }
}

async function writeJSON(store, key, value) {
  try {
    await store.set(key, JSON.stringify(value), { contentType: 'application/json' });
  } catch (e) {
    console.error('writeJSON error:', key, e);
    throw e;
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });

    // After redirect: "/.netlify/functions/api/expenses/123"
    const apiRoot = '/.netlify/functions/api';
    const rawPath = event.path || '';
    let subpath = rawPath.startsWith(apiRoot) ? rawPath.slice(apiRoot.length) : rawPath;
    if (subpath.startsWith('/')) subpath = subpath.slice(1); // "expenses/123"
    const [resource, id] = (subpath || '').split('/');

    // Simple health + admin reset helpers
    if (resource === 'health') return ok({ ok: true });

    const incomeStore   = getStore('income');
    const expensesStore = getStore('expenses');

    // Initialize defaults if missing/corrupt (prevents 500s)
    const income = await readJSON(incomeStore, 'current', { amount: 0 });
    await writeJSON(incomeStore, 'current', income);
    let expenses = await readJSON(expensesStore, 'list', []);
    if (!Array.isArray(expenses)) expenses = [];
    await writeJSON(expensesStore, 'list', expenses);

    // Admin reset: GET /api/admin/reset  (useful if data got corrupted)
    if (resource === 'admin' && id === 'reset' && event.httpMethod === 'GET') {
      await writeJSON(incomeStore, 'current', { amount: 0 });
      await writeJSON(expensesStore, 'list', []);
      return ok({ ok: true, reset: true });
    }

    // Routes
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
      let list = await readJSON(expensesStore, 'list', []);
      if (!Array.isArray(list)) list = [];

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

    return err('Unknown endpoint', 404, { path: subpath });
  } catch (e) {
    console.error('Handler crash:', e);
    return err('Server error', 500, String(e && e.message ? e.message : e));
  }
};
