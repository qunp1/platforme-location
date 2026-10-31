import { categories, defaultFilters, initialSearch, locations, rentalDays } from './domain.js';
// Older shared links may contain local times; only their calendar dates matter.
const dateOnly = (value) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value || '') ? value.slice(0, 10) : value;
export const staticSite = import.meta.env?.VITE_STATIC_SITE === 'true';
const deploymentBase = import.meta.env?.BASE_URL || '/';

// Hash routes keep shared links and refreshes on GitHub Pages' index.html.
export function browserUrl(path, base = deploymentBase, useHash = staticSite) {
  return useHash && path.startsWith('/') && !path.startsWith('//') ? `${base}#${path}` : path;
}
export function routeLocation(input, useHash = staticSite) {
  const url = new URL(input, 'http://nadorly.local');
  return useHash && url.hash.startsWith('#/')
    ? new URL(url.hash.slice(1), url.origin)
    : useHash && url.pathname === deploymentBase
      ? new URL(`/${url.search}`, url.origin)
      : url;
}
export function parseRoute(input) {
  const url = routeLocation(input);
  const aliases = {
    '/voitures': '/cars',
    '/compte': '/account/bookings',
    '/aide': '/help',
    '/agences': '/agency',
    '/comment-ca-marche': '/how-it-works',
  };
  const pathname = url.pathname.replace(/\/$/, '') || '/';
  const path =
    aliases[pathname] ||
    (pathname.startsWith('/voitures/') ? pathname.replace('/voitures/', '/cars/') : pathname);
  const params = url.searchParams;
  const fallback = initialSearch();
  const candidate = {
    location: params.get('location') || (url.pathname === '/' ? 'office' : fallback.location),
    start: dateOnly(params.get('start')) || fallback.start,
    end: dateOnly(params.get('end')) || fallback.end,
  };
  const validTrip =
    Object.hasOwn(locations, candidate.location) && rentalDays(candidate.start, candidate.end) > 0;
  const max = Number(params.get('max'));
  const filters = {
    fuel: ['diesel', 'essence'].includes(params.get('fuel')) ? params.get('fuel') : 'all',
    seats: ['5', '7'].includes(params.get('seats')) ? params.get('seats') : 'all',
    gear: ['manual', 'auto'].includes(params.get('gear')) ? params.get('gear') : 'all',
    category: Object.hasOwn(categories, params.get('category')) ? params.get('category') : 'all',
    max:
      params.has('max') && Number.isFinite(max)
        ? Math.min(700, Math.max(200, max))
        : defaultFilters.max,
    sort: params.get('sort') === 'price-desc' ? 'price-desc' : 'price',
  };
  const hasDates = params.has('start') && params.has('end') && validTrip;
  return {
    path,
    search: validTrip ? candidate : fallback,
    filters,
    hasDates,
    invalidTrip: !validTrip,
  };
}
export function makeUrl(path, search, filters = defaultFilters) {
  const params = new URLSearchParams(search);
  for (const key of ['start', 'end'])
    if (params.has(key)) params.set(key, dateOnly(params.get(key)));
  for (const [key, value] of Object.entries(filters))
    if (value !== defaultFilters[key]) params.set(key, String(value));
  return `${path}?${params}`;
}
