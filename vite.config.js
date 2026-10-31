import { defineConfig } from 'vite';
const proxy = { '/api': 'http://127.0.0.1:3001' };
export default defineConfig({
  server: {
    proxy,
    // Local skills and tool snapshots are not application source files.
    watch: {
      ignored: ['**/.agents/**', '**/.tools/**', '**/.taste-skill/**', '**/.hallmark/**'],
    },
  },
  preview: { proxy },
});
