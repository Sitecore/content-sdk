const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Enable Turbopack file system caching for faster dev startup (beta)
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  // NOTE: The Next.js built-in `i18n` routing block has been removed.
  // Locale (and site) are now expressed as explicit route segments
  // `/[site]/[locale]/...` and resolved by `LocaleProxy` + `MultisiteRewriteProxy`
  // in `src/proxy.ts` (matching the App Router). Supported locales are defined in
  // `src/i18n/routing.ts`.

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

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

  async rewrites() {
    return [
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // robots route
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // llms.txt route
      {
        source: '/llms.txt',
        destination: '/api/llms-txt',
      },
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap',
      },
      // feaas api route
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }
    <%_ if (helper.isDev) { -%>
    // monorepo configuration start
    if (options.isServer) {
      config.externals = ['vertx', ...config.externals];
    }

    config.resolve.alias['@sitecore-feaas/clientside/react'] = path.resolve(
      process.cwd(), options.isServer ? 
        './node_modules/@sitecore-feaas/clientside/dist/node/react.cjs' :
        './node_modules/@sitecore-feaas/clientside/dist/browser/react.esm.js'
    );
    // monorepo configuration end
    <% } -%>

    return config;
  },
};

module.exports = nextConfig;
