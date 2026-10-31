import { createProvider } from './provider.js';
import { createCookieWriter, parseCookies } from './session-cookies.js';
import { fail, readJsonBody, createWriteLimiter } from './http.js';
import {
  validateEmail,
  validatePassword,
  validatePasswordReset,
  validateRequest,
} from './validation.js';
import { createServer } from 'node:http';

export function createApi({
  url = '',
  key = '',
  origin = 'http://127.0.0.1:5173',
  fetcher = fetch,
  secure = false,
} = {}) {
  const limitWrites = createWriteLimiter();
  const provider = createProvider({ url, key, fetcher });
  const cookies = createCookieWriter(secure);
  return createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, data) => {
      res.writeHead(status);
      res.end(JSON.stringify(data));
    };
    try {
      const path = new URL(req.url, 'http://localhost').pathname;
      if (path === '/api/health' && req.method === 'GET')
        return send(200, { configured: Boolean(url && key) });
      if (!url || !key)
        throw fail(
          503,
          'Les comptes et demandes ne sont pas encore connectés. La configuration du service est nécessaire.',
        );
      if (req.method !== 'GET' && req.headers.origin !== origin)
        throw fail(403, 'Origine non autorisée.');
      let body = {};
      if (req.method === 'POST') {
        body = await readJsonBody(req);
        limitWrites(req.socket.remoteAddress);
      }
      if (
        ['/api/auth/sign-in', '/api/auth/sign-up', '/api/auth/recover'].includes(path) &&
        req.method === 'POST'
      ) {
        validateEmail(body);
        if (path.endsWith('recover')) {
          await provider('/auth/v1/recover', { method: 'POST', body: { email: body.email } });
          return send(200, {
            message: 'Si un compte existe, un lien de réinitialisation sera envoyé.',
          });
        }
        validatePassword(body);
        const data = await provider(
          path.endsWith('sign-in') ? '/auth/v1/token?grant_type=password' : '/auth/v1/signup',
          { method: 'POST', body: { email: body.email, password: body.password } },
        );
        if (data.access_token) cookies(res, data);
        return send(200, {
          user: data.access_token ? { id: data.user.id, email: data.user.email } : null,
          message: data.access_token
            ? ''
            : 'Vérifiez votre e-mail pour activer votre compte, puis connectez-vous.',
        });
      }
      const jar = parseCookies(req.headers.cookie);
      if (path === '/api/auth/reset-password' && req.method === 'POST') {
        validatePasswordReset(body);
        const session = await provider('/auth/v1/verify', {
          method: 'POST',
          body: { email: body.email, token: body.code, type: 'recovery' },
        });
        await provider('/auth/v1/user', {
          method: 'PUT',
          token: session.access_token,
          body: { password: body.password },
        });
        await provider('/auth/v1/logout?scope=global', {
          method: 'POST',
          token: session.access_token,
        });
        cookies(res, null);
        return send(200, {
          message: 'Mot de passe modifié. Connectez-vous avec votre nouveau mot de passe.',
        });
      }
      let token = jar.access_token;
      let user;
      try {
        if (token) user = await provider('/auth/v1/user', { token });
      } catch (error) {
        if (error.status !== 401 && error.status !== 400) throw error;
      }
      if (!user && jar.refresh_token) {
        try {
          const session = await provider('/auth/v1/token?grant_type=refresh_token', {
            method: 'POST',
            body: { refresh_token: jar.refresh_token },
          });
          token = session.access_token;
          user = session.user;
          cookies(res, session);
        } catch {
          cookies(res, null);
        }
      }
      if (path === '/api/auth/session' && req.method === 'GET')
        return send(200, { user: user ? { id: user.id, email: user.email } : null });
      if (!user) throw fail(401, 'Connectez-vous pour continuer.');
      if (path === '/api/auth/sign-out' && req.method === 'POST') {
        await provider('/auth/v1/logout?scope=global', { method: 'POST', token });
        cookies(res, null);
        return send(200, { ok: true });
      }
      if (path === '/api/requests' && req.method === 'GET')
        return send(200, {
          requests: await provider('/rest/v1/booking_requests?select=*&order=created_at.desc', {
            token,
          }),
        });
      if (path === '/api/requests' && req.method === 'POST') {
        validateRequest(body);
        const request = await provider('/rest/v1/rpc/create_booking_request', {
          method: 'POST',
          token,
          body: {
            p_vehicle_id: body.vehicleId,
            p_start: body.start,
            p_end: body.end,
            p_location: body.location,
            p_contact_name: body.contactName.trim(),
            p_phone: body.phone,
            p_key: body.idempotencyKey,
            p_expected_total: body.expectedTotal,
          },
        });
        return send(201, { request });
      }
      throw fail(404, 'Route introuvable.');
    } catch (error) {
      send(error.status || 502, {
        error: error.status
          ? error.message
          : 'Service indisponible. Réessayez dans quelques instants.',
      });
    }
  });
}
