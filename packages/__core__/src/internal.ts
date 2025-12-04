export { getCookieValueFromMiddlewareRequest } from './cookie/get-cookie-value-from-middleware-request';
export { getDefaultCookieAttributes } from './cookie/get-default-cookie-attributes';

export { language, pageName } from './infer/infer';
export { getCookieValueFromRequest } from './cookie/get-cookie-value-from-request';
export { generateCorrelationId } from './correlation-id/generate-correlation-id';
export { debug, processDebugResponse } from './debug/debug';

export {
  API_VERSION,
  COOKIE_NAME_PREFIX,
  DAILY_SECONDS,
  DEFAULT_COOKIE_EXPIRY_DAYS,
  LIBRARY_VERSION,
  SITECORE_EDGE_URL,
  CORRELATION_ID_HEADER,
} from './consts';

// Interfaces
export type { EPResponse, Infer, DebugResponse } from './interfaces';
export type { Settings, BrowserSettings } from './initializer/browser/interfaces';

// Browser
export { getCloudSDKSettings as getCloudSDKSettingsBrowser } from './initializer/browser/initializer';
export { getEnabledPackage as getEnabledPackageBrowser } from './initializer/browser/initializer';
export { enabledPackages as enabledPackagesBrowser } from './initializer/browser/initializer';
export { builderInstance as builderInstanceBrowser } from './initializer/browser/initializer';
export type { PackageContextDependency as PackageContextDependencyBrowser } from './initializer/browser/interfaces';
export { fetchBrowserIdFromEdgeProxy } from './browser-id/fetch-browser-id-from-edge-proxy';
export { PackageInitializer } from './initializer/browser/package-initializer';
export { initCoreState } from './initializer/browser/initializer';
export { getCookiesValuesFromEdge as getCookiesValuesFromEdgeBrowser } from './initializer/browser/initializer';

// Server
export { getCloudSDKSettings as getCloudSDKSettingsServer } from './initializer/server/initializer';
export { getEnabledPackage as getEnabledPackageServer } from './initializer/server/initializer';
export { enabledPackages as enabledPackagesServer } from './initializer/server/initializer';
export { builderInstance as builderInstanceServer } from './initializer/server/initializer';
export { PackageInitializerServer } from './initializer/server/package-initializer';
export { getCloudSDKRequest, getCloudSDKResponse } from './initializer/server/initializer';
export { getCookiesValuesFromEdge as getCookiesValuesFromEdgeServer } from './initializer/server/initializer';
export { getGuestIdServer } from './guest-id/get-guest-id-server';
