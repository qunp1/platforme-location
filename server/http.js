export const fail = (status, message) => Object.assign(new Error(message), { status });

export async function readJsonBody(req) {
  let body;
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 8192) throw fail(413, 'Formulaire trop volumineux.');
  }
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    throw fail(400, 'Formulaire invalide.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body))
    throw fail(400, 'Formulaire invalide.');
  return body;
}

export function createWriteLimiter() {
  const attempts = new Map();
  return function limitWrites(id) {
    const now = Date.now();
    for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
    const entry = attempts.get(id) || { count: 0, until: now + 60000 };
    if (++entry.count > 30) throw fail(429, 'Trop de tentatives. Réessayez dans une minute.');
    attempts.set(id, entry);
  };
}
