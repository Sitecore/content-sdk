export * from './auth/models';
import * as authModule from './auth';

export * from './metadata';

export { default as isServer } from './is-server';
export { ensurePathExists } from './ensurePath';
export { normalizeUrl } from './normalize-url';
export {
  resolveEdgeUrl,
  resolveEdgeUrlForStaticFiles,
  hasCustomEdgeHostname,
  getCustomEdgeUrl,
  SITECORE_EDGE_HOSTNAME_ENV,
  SITECORE_EDGE_HOSTNAME_PUBLIC_ENV,
  SITECORE_EDGE_URL_ENV,
  SITECORE_EDGE_URL_PUBLIC_ENV,
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
export { hasCache, getCache, getCacheAndClean, setCache } from './globalCache';

/**
 * Preserve "live binding" semantics similar to ES module imports: production
 * code always sees the current implementation; tests can swap it safely and
 * restore via `sandbox.restore()` with no hidden global state.
 *
 * Public surface consumed by the rest of the codebase.
 * @public
 */
export const auth: {
  readonly clientCredentialsFlow: typeof authModule.clientCredentialsFlow;
} = {} as any;

/*
 * Define an accessor so reads are dynamic
 *   - Production: returns the real `authModule.clientCredentialsFlow`.
 *   - Tests: can be replaced with a stub via `sinon.replaceGetter` or `sandbox.replaceGetter`
 */
Object.defineProperty(auth, 'clientCredentialsFlow', {
  get: () => authModule.clientCredentialsFlow,
  configurable: true,
  enumerable: true,
});
