import { createApi } from './api.js';
try {
  process.loadEnvFile('.env.local');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const origin = process.env.APP_ORIGIN || 'http://127.0.0.1:5173';
if (process.env.NODE_ENV === 'production' && !origin.startsWith('https://'))
  throw new Error('APP_ORIGIN must use HTTPS in production');
createApi({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY,
  origin,
  secure: origin.startsWith('https://'),
}).listen(Number(process.env.API_PORT || 3001), '127.0.0.1', () =>
  console.log('Nadorly API listening on 127.0.0.1:3001'),
);
