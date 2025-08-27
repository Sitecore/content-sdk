const path = require('path');
const webpack = require('webpack');
const SassAlias = require('sass-alias');
const fs = require('fs');

/**
 * @type {import('next').NextConfig}
 */
// Determine host role strictly from env for build-time safety
const isEditingHost = !!process.env.SITECORE_EDITING_SECRET;

// For Rendering Host builds, ensure the editing API folder is removed before Next scans pages
if (!isEditingHost) {
  try {
    const editingApiDir = path.join(process.cwd(), 'src', 'pages', 'api', 'editing');
    if (fs.existsSync(editingApiDir)) {
      fs.rmSync(editingApiDir, { recursive: true, force: true });
      console.log('next.config: removed editing API routes for Rendering Host');
    }
  } catch (error) {
    console.warn('Failed to remove editing API routes:', error);
  }
}

const nextConfig = {
  // Default Next.js page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  },

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
    const routes = [
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
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap'
      },
    ];

    // Only add FEAAS editing route for Editing Host builds
    if (isEditingHost) {
      routes.push({
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      });
    }

    return routes;
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        // reference this for the editing host exclusion task
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });

      // Exclude editing-only imports (DesignLibrary, .sitecore/import-map) from client bundle when not Editing Host
      if (!isEditingHost) {
        // Reuse the enhanced component-props loader to strip editing-only code across the app
        config.module.rules.unshift({
          test: /src\\.*\.(ts|tsx)$/,
          use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
        });

        // Client-only aliases and ignore rules for editing-only code
        config.resolve = config.resolve || {};
        config.resolve.alias = {
          ...config.resolve.alias,
          '@sitecore-content-sdk/nextjs/editing': false,
          '@sitecore-content-sdk/nextjs/editing/codegen/import-map': false,
          // Do NOT alias core editing on server; we strip only client usage
          '@sitecore-content-sdk/react/dist/esm/components/DesignLibrary': false,
          '.sitecore/import-map': false,
        };

        config.plugins = config.plugins || [];
        config.plugins.push(
          new webpack.IgnorePlugin({
            resourceRegExp:
              /^(?:\.sitecore\/import-map(?:\.ts|\.js)?|@sitecore-content-sdk\/(?:core|nextjs)\/editing(?:\/.*)?|@sitecore-content-sdk\/react\/dist\/esm\/components\/DesignLibrary(?:\.js)?)$/,
          })
        );
      }
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

    // Note: server bundle remains untouched; client-only handling above

    <%_ if (helper.isDev) { -%>
    // monorepo configuration start
    if (options.isServer) {
      config.externals = ['vertx', ...config.externals];
    }

    config.resolve.alias['@sitecore-cloudsdk/events'] = path.resolve(
      process.cwd(), './node_modules/@sitecore-cloudsdk/events'
    );
    config.resolve.alias['@sitecore-feaas/clientside/react'] = path.resolve(
      process.cwd(), options.isServer ? 
        './node_modules/@sitecore-feaas/clientside/dist/node/react.cjs' :
        './node_modules/@sitecore-feaas/clientside/dist/browser/react.esm.js'
    );
    // monorepo configuration end
    <% } -%>

    return config;
  },

  // Add sass settings for SXA themes and styles
  sassOptions: {
    importer: new SassAlias({
      '@globals': path.join(process.cwd(), './src/assets', 'globals'),
      '@fontawesome': path.join(process.cwd(), './node_modules', 'font-awesome'),
    }).getImporter(),
    // temporary measure until new versions of bootstrap and font-awesome released
    quietDeps: true,    
    silenceDeprecations: ["import", "legacy-js-api"],
  },
};

module.exports = nextConfig;
