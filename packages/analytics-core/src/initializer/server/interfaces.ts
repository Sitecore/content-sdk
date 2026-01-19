export interface ServerSettings {
  sitecoreEdgeContextId: string;
  siteName: string;
  enableServerCookie?: boolean;
  cookieDomain?: string;
  cookieExpiryDays?: number;
  cookiePath?: string;
  sitecoreEdgeUrl?: string;
  timeout?: number;
}

export interface Settings {
  sitecoreEdgeContextId: string;
  siteName: string;
  sitecoreEdgeUrl: string;
  timeout?: number;
  cookieSettings: {
    name: {
      browserId: string;
    };
    domain?: string;
    expiryDays: number;
    path?: string;
    enableServerCookie?: boolean;
  };
}

export interface PackageContextDependencyServer {
  name: string;
  method: string;
}

export interface PackageContext {
  sideEffects: () => Promise<void>;
  settings?: unknown;
  dependencies?: PackageContextDependencyServer[];
}
