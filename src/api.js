import { staticSite } from './navigation.js';

export async function api(path, body) {
  if (staticSite) {
    if (path === '/health') return { configured: false };
    throw new Error('Les comptes et demandes ne sont pas encore connectés.');
  }
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error('Le service est indisponible. Réessayez dans quelques instants.');
  }
  const data = await response
    .json()
    .catch(() => ({ error: 'Le service est indisponible. Réessayez dans quelques instants.' }));
  if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.');
  return data;
}
