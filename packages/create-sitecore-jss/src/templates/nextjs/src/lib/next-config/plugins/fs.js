/**
 * @param {import('next').NextConfig} nextConfig
 */
const componentPropsPlugin = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack: (config) => {
        
        config.resolve.fallback = { ...config.resolve.fallback, fs: false };
  
        return config;
      },
    });
  };
  
  module.exports = componentPropsPlugin;
  