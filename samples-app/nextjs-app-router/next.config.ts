import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // @tailwindcss/node ships native Rust binaries via @tailwindcss/oxide that cannot
  // be bundled by Turbopack/webpack. Even though it is a dependency of
  // @sitecore-content-sdk/nextjs, it must be declared external here so Next.js
  // loads it natively from node_modules rather than attempting to bundle it.
  // @sitecore-content-sdk/core must also be external so that the instrumentation
  // context and Server Actions share the same module instance.
  serverExternalPackages: [
    '@tailwindcss/node',
    //  '@sitecore-content-sdk/core'
    ],

  // Enable Turbopack file system caching for faster dev startup (beta)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
    ],
  },
  // use this configuration to serve the sitemap.xml and robots.txt files from the API route handlers
  rewrites: async () => {
    return [
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
        locale: false,
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
        locale: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
