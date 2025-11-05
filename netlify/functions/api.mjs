// netlify/functions/api.mjs
import { getStore } from '@netlify/blobs';

/**
 * Data model (simple & json-server-like):
 * - "income": a single object  { amount: number }
 * - "expenses": an array of     [{ id, name, amount, date }]
 */

const incomeStore  = getStore('income');
const expensesStore = getStore('expenses');

const json = (status, data) => ({
  statusCode: status,
  headers: {
    'Content-Type': 'application/json',
    // CORS for dev and prod (tighten origin if you want)
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  },
  body: JSON.stringify(data),
});

const readJSON = async (store, key, fallback) => {
  const val = await store.get(key, { type: 'json' }); // parses JSON
  return val ?? fallback;
};

const writeJSON = async (store, key, value) => {
  // store.set auto-serializes when type=json in get; we store raw JSON
  await store.set(key, JSON.stringify(value), { contentType: 'application/json' });
};

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true });

  const path = (event.path || '').replace('/.netlify/functions/api', '').replace(/^\/+/, '');
  const [resource, id] = path.split('/'); // e.g., "expenses", "123"

  try {
    if (resource === 'income') {
      // GET /api/income
      if (event.httpMethod === 'GET') {
        const income = await readJSON(incomeStore, 'current', { amount: 0 });
        return json(200, income);
      }

      // PATCH /api/income   { amount }
      if (event.httpMethod === 'PATCH') {
        const body = JSON.parse(event.body || '{}');
        const next = { amount: Number(body.amount || 0) };
        await writeJSON(incomeStore, 'current', next);
        return json(200, next);
      }

      return json(405, { error: 'Method not allowed' });
    }

    if (resource === 'expenses') {
      let list = await readJSON(expensesStore, 'list', []);

      // GET /api/expenses or /api/expenses/:id
      if (event.httpMethod === 'GET') {
        if (id) {
          const item = list.find(x => String(x.id) === String(id));
          return item ? json(200, item) : json(404, { error: 'Not found' });
        }
        return json(200, list);
      }

      // POST /api/expenses   { name, amount, date }
      if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body || '{}');
        const newItem = {
          id: list.length ? Math.max(...list.map(x => Number(x.id))) + 1 : 1,
          name: String(body.name || '').trim(),
          amount: Number(body.amount || 0),
          date: String(body.date || ''),
        };
        list = [...list, newItem];
        await writeJSON(expensesStore, 'list', list);
        return json(201, newItem);
      }

      // DELETE /api/expenses/:id
      if (event.httpMethod === 'DELETE') {
        if (!id) return json(400, { error: 'Missing id' });
        const exists = list.some(x => String(x.id) === String(id));
        list = list.filter(x => String(x.id) !== String(id));
        await writeJSON(expensesStore, 'list', list);
        return exists ? json(200, { ok: true }) : json(404, { error: 'Not found' });
      }

      return json(405, { error: 'Method not allowed' });
    }

    // default: 404 for unknown resources
    return json(404, { error: 'Unknown endpoint' });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'Server error', detail: String(e.message || e) });
  }
}
