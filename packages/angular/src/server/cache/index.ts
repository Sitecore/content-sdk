export type { GlobalLoaderCacheConfig } from './models';
export { createLoaderCache } from './loader-cache';

// Sitecore cache-tag public surface. Lower-level tag builders remain internal
// so callers don't hand-build Sitecore cache tag strings.
// buildSitecoreItemCacheTag is added as an exception, since it is common to
// perform GraphQL for additional Sitecore data and wanting it to expire on
// publish.
export { buildSitecoreItemCacheTag, type BuildSitecoreItemCacheTagParams } from './cache-tags';
