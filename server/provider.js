import { fail } from './http.js';

export function createProvider({ url, key, fetcher }) {
  return async function provider(path, { token, method = 'GET', body } = {}) {
    const response = await fetcher(`${url}${path}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${token || key}`,
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok)
      throw fail(
        response.status === 401 ? 401 : 400,
        path.includes('/auth/')
          ? 'Connexion impossible. Vérifiez vos informations ou le lien reçu.'
          : 'La demande ne peut pas être enregistrée. Vérifiez les dates et réessayez.',
      );
    return data;
  };
}
