import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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
