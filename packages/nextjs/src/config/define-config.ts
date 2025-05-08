import {
  SitecoreConfigInput,
  defineConfig as defineConfigCore,
} from '@sitecore-content-sdk/core/config';

export const getNextFallbackConfig = (config: SitecoreConfigInput): SitecoreConfigInput => {
  return {
    ...config,
    api: {
      ...config.api,
      edge: {
        ...config.api?.edge,
        contextId:
          config?.api?.edge?.contextId ||
          process.env.SITECORE_EDGE_CONTEXT_ID ||
          process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ||
          '',
        clientContextId:
          config?.api?.edge?.clientContextId || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
        edgeUrl:
          process.env.NEXT_PUBLIC_SITECORE_EDGE_URL ||
          process.env.SITECORE_EDGE_URL ||
          config?.api?.edge?.edgeUrl,
      },
      local: {
        ...config.api?.local,
        apiKey: config?.api?.local?.apiKey || process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
        apiHost: config?.api?.local?.apiHost || process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
      },
    },
    defaultSite: config?.defaultSite || process.env.NEXT_PUBLIC_SITECORE_SITE_NAME,
    defaultLanguage: config?.defaultLanguage || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    editingSecret: process.env.JSS_EDITING_SECRET,
    redirects: config?.redirects ?? {},
    multisite: {
      ...config.multisite,
      enabled: config?.multisite?.enabled ?? true,
      useCookieResolution:
        config?.multisite?.useCookieResolution ?? (() => process.env.VERCEL_ENV === 'preview'),
    },
    personalize: {
      ...config.personalize,
      scope: config.personalize?.scope || process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
      edgeTimeout:
        config?.personalize?.edgeTimeout ??
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT!, 10),
      cdpTimeout:
        config?.personalize?.cdpTimeout ??
        parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT!, 10),
    },
  };
};

export const defineConfig = (config: SitecoreConfigInput) => {
  return defineConfigCore(getNextFallbackConfig(config));
};
