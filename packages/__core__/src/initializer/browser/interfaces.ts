export interface BrowserSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
  enableBrowserCookie?: boolean;
  cookieDomain?: string;
  cookieExpiryDays?: number;
  cookiePath?: string;
  sitecoreEdgeUrl?: string;
}

export interface Settings {
  sitecoreEdgeContextId: string;
  siteName: string;
  sitecoreEdgeUrl: string;
  cookieSettings: {
    name: {
      browserId: string;
    };
    domain?: string;
    expiryDays: number;
    path?: string;
    enableBrowserCookie?: boolean;
  };
}

export interface PackageContextDependency {
  name: string;
  method: string;
}

export interface PackageContext {
  sideEffects: () => Promise<void>;
  settings?: unknown;
  dependencies?: PackageContextDependency[];
}

export interface Core {
  getBrowserId: () => string;
  getGuestId: () => Promise<string>;
  settings: {
    siteName: string;
    sitecoreEdgeContextId: string;
    sitecoreEdgeUrl: string;
  };
  version: string;
}
