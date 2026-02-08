// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: [
        '@sitecore-content-sdk/astro',
        '@sitecore-content-sdk/content',
        '@sitecore-content-sdk/core',
        '@sitecore-cloudsdk/events',
        '@sitecore-cloudsdk/core',
        '@sitecore-cloudsdk/utils',
      ],
    },
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
});

