import { cars } from './data.js';
// Stable async boundary; replace with a server client in the backend slice.
export const catalog = {
  async list({ signal } = {}) {
    signal?.throwIfAborted();
    const active = cars.filter((car) => car.active);
    if (
      import.meta.env.DEV &&
      ['worst', 'empty', 'one', 'many'].includes(new URLSearchParams(location.search).get('data'))
    ) {
      const { stressCatalog } = await import('./dev/catalogStress.js');
      signal?.throwIfAborted();
      return stressCatalog(active, new URLSearchParams(location.search).get('data'));
    }
    return active;
  },
  async get(id, { signal } = {}) {
    signal?.throwIfAborted();
    return cars.find((car) => car.id === id && car.active) || null;
  },
};
