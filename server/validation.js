import { fail } from './http.js';

export function validateEmail(body) {
  if (
    typeof body.email !== 'string' ||
    body.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
  )
    throw fail(400, 'Vérifiez votre adresse e-mail.');
}

export function validatePassword(body) {
  if (typeof body.password !== 'string' || body.password.length < 12 || body.password.length > 128)
    throw fail(400, 'Utilisez un mot de passe de 12 à 128 caractères.');
}

export function validatePasswordReset(body) {
  if (
    typeof body.email !== 'string' ||
    body.email.length > 254 ||
    typeof body.code !== 'string' ||
    !/^\d{6,10}$/.test(body.code) ||
    typeof body.password !== 'string' ||
    body.password.length < 12 ||
    body.password.length > 128
  )
    throw fail(400, 'Vérifiez le code et utilisez un mot de passe de 12 à 128 caractères.');
}

export function validateRequest(body) {
  if (
    !/^[a-z0-9-]{1,60}$/.test(body.vehicleId || '') ||
    !/^[0-9a-f-]{36}$/i.test(body.idempotencyKey || '') ||
    typeof body.contactName !== 'string' ||
    body.contactName.trim().length < 2 ||
    body.contactName.length > 100 ||
    typeof body.phone !== 'string' ||
    !/^[+\d ()-]{6,30}$/.test(body.phone) ||
    body.termsAccepted !== true ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.start || '') ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.end || '') ||
    !['office', 'airport', 'port'].includes(body.location) ||
    !Number.isSafeInteger(body.expectedTotal)
  )
    throw fail(400, 'Vérifiez les coordonnées, dates et conditions.');
}
