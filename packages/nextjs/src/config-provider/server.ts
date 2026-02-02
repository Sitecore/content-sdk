import 'server-only';
import { cache } from 'react';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';

const serverContext = cache(() => new Map());
const configCacheKey = 'sitecore-config';

const useSitecoreProvider = () => {
  const global = serverContext();

  const runtimeConfig = global.get(configCacheKey);

  const initProvider = (v: SitecoreConfig) => {
    if (runtimeConfig) {
      console.log('Config provider already initialized. No action will be taken.');
    }
    global.set(configCacheKey, v);
  };

  return {
    scConfig: global.get(configCacheKey),
    initProvider,
  };
};

export default useSitecoreProvider;
