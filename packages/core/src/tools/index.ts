export { hasCache, getCache, getCacheAndClean, setCache } from './globalCache';
export { tryCatch } from './try-catch';
// decoupling client-safe logic from /tools submodule which is not client-side safe
export { normalizeUrl } from './normalize-url';
export { default as isServer } from './is-server';
export {
  resolveEdgeUrl,
  resolveEdgeUrlForStaticFiles,
  resolveExperienceEdgeUrl,
  SITECORE_EDGE_PLATFORM_HOSTNAME_ENV,
  SITECORE_EXPERIENCE_EDGE_HOSTNAME_ENV,
} from './resolve-edge-url';
export {
  resolveUrl,
  isTimeoutError,
  getEnforcedCorsHeaders,
  EnhancedOmit,
  getAllowedOriginsFromEnv,
  isRegexOrUrl,
  areURLSearchParamsEqual,
  escapeNonSpecialQuestionMarks,
  mergeURLSearchParams,
} from './utils';
