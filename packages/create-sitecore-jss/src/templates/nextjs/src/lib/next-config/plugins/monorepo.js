/**
 * @param {import('next').NextConfig} nextConfig
 */
const monorepoPlugin = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      if (options.isServer) {
        config.externals = ['react', 'vertx', ...config.externals];
      }

      config.resolve.alias['@sitecore-cloudsdk/events'] = path.resolve(
        CWD, './node_modules/@sitecore-cloudsdk/events'
      );

      // Overload the Webpack config if it was already overloaded
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = monorepoPlugin;
