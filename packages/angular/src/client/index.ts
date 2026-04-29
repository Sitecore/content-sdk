// Cache interface (browser-safe)
export type {
  ScClientCacheResponse,
  ScClientCacheRequest,
  ScClientCacheStore,
} from './sc-client-cache.interface';
export {
  NullScClientCache,
  NULL_SC_CLIENT_CACHE,
  buildPageCacheKey,
  buildDictionaryCacheKey,
} from './sc-client-cache.interface';

// Angular Sitecore client (extends content SitecoreClient; construct in app `getClient()`)
export {
  AngularSitecoreClientService,
  type AngularSitecoreClientServiceOptions,
  SC_CLIENT_DATA_ENDPOINT,
} from './angular-sitecore-client.service';
