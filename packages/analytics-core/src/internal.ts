export { getDefaultCookieAttributes } from './cookie/get-default-cookie-attributes';

export { language, pageName } from './infer/infer';
export { generateCorrelationId } from './correlation-id/generate-correlation-id';
export { processDebugResponse } from './debug/debug';

export {
  API_VERSION,
  COOKIE_NAME_PREFIX,
  DAILY_SECONDS,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
  SITECORE_EDGE_URL,
  CORRELATION_ID_HEADER,
  CLIENT_ID_COOKIE_NAME,
} from './consts';

// Interfaces
export type { EPResponse, Infer, DebugResponse } from './interfaces';

export { fetchClientIdFromEdgeProxy } from './client-id/fetch-client-id-from-edge-proxy';
export { getAnalyticsPlugin } from './initialization/plugin';
export { ANALYTICS_PLUGIN_NAME } from './initialization/const';
export type { AnalyticsPlugin } from './initialization/types';
export { AnalyticsAdapter, AnalyticsSettings } from './initialization/types';
