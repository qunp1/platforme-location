export const locations = {
  airport: 'Aéroport de Nador',
  port: 'Port de Beni Ensar',
  office: 'Nador centre · en agence',
};
export const categories = {
  economy: 'Citadines',
  compact: 'Compactes',
  family: 'Familiales',
  suv: 'SUV',
};
export const defaultFilters = {
  gear: 'all',
  category: 'all',
  fuel: 'all',
  seats: 'all',
  max: 700,
  sort: 'price',
};
export const money = (value) =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value / 100);

// Calendar dates use UTC only for arithmetic, never as pickup timestamps.
export function calendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const date = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === value ? date : NaN;
}
export function rentalDays(start, end) {
  const duration = calendarDate(end) - calendarDate(start);
  return Number.isFinite(duration) && duration > 0 ? duration / 86400000 : 0;
}
export function quote(car, search) {
  const days = rentalDays(search.start, search.end);
  if (!days || !Object.hasOwn(car.pickup, search.location)) return null;
  const rental = days * car.daily;
  const delivery = car.pickup[search.location];
  return { days, rental, delivery, total: rental + delivery };
}
export function searchCars(cars, search, filters) {
  return cars
    .filter(
      (car) =>
        quote(car, search) &&
        (filters.gear === 'all' || car.gear === filters.gear) &&
        (!filters.category || filters.category === 'all' || car.category === filters.category) &&
        (!filters.fuel || filters.fuel === 'all' || car.fuel.toLowerCase() === filters.fuel) &&
        (!filters.seats || filters.seats === 'all' || car.seats === Number(filters.seats)) &&
        car.daily <= filters.max * 100,
    )
    .sort((a, b) =>
      filters.sort === 'price-desc'
        ? quote(b, search).total - quote(a, search).total
        : quote(a, search).total - quote(b, search).total,
    );
}
export function validateSearch(search, now = Date.now()) {
  if (!Object.hasOwn(locations, search.location)) return 'Choisissez un lieu de prise en charge.';
  if (!Number.isFinite(calendarDate(search.start)) || !Number.isFinite(calendarDate(search.end)))
    return 'Vérifiez les dates sélectionnées.';
  if (!rentalDays(search.start, search.end)) return 'Le retour doit être après le départ.';
  if (
    search.start < new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Casablanca' }).format(now)
  )
    return 'Choisissez une date de départ à venir.';
  return '';
}
export function prettyDate(value, includeYear = false) {
  const date = calendarDate(value);
  return Number.isFinite(date)
    ? new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'short',
        ...(includeYear ? { year: 'numeric' } : {}),
      }).format(date)
    : 'Date à choisir';
}
export function initialSearch() {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Africa/Casablanca' }).format(
    new Date(),
  );
  const d = new Date(today + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 7);
  const start = d.toISOString().slice(0, 10);
  d.setUTCDate(d.getUTCDate() + 7);
  return { location: 'airport', start, end: d.toISOString().slice(0, 10) };
}
