// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Custom domain (GitHub Student Pack, registered at name.com). Keep in sync with public/CNAME.
const SITE = 'https://wilmervasquez.page';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Polling is needed inside Docker on Windows/macOS bind mounts (set in compose.yaml).
    server: { watch: { usePolling: process.env.CHOKIDAR_USEPOLLING === 'true' } },
  },
});
