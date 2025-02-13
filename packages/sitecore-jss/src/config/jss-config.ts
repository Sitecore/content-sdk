// import { RetryStrategy } from '../graphql-request-client';
// import { cwd } from 'process';
// import path from 'path';
// import fs from 'fs';

export type JssConfigInput = {
  api:
    | {
        contextId: string;
        edgeUrl?: string;
        path?: string;
      }
    | {
        apiKey: string;
        apiHost: string;
        path?: string;
      };
  defaultSite: string;
  defaultLanguage: string;
  editingSecret: string;
  retries?: {
    count?: number;
  };
  layout?: {
    formatLayoutQuery?: (siteName: string, itemPath: string, locale?: string) => string;
  };
  dictionary?: {
    cahing?: {
      enabled?: boolean;
      timeout?: number;
    };
  };
  multisite?: {
    // Enabled has a top priority, if it is disalbed - feature disabled completely
    enabled: boolean;
    defaultHostname?: string;
    useCookieResolution?: () => boolean;
  };
  personalize?: {
    enabled: boolean;
    scope?: string;
    channel?: string;
    currency?: string;
    edgeTimeout?: number;
    cdpTimeout?: number;
  };
  redirects?: {
    enabled: boolean;
    locales: string[];
  };
};
/* JssConfigInput + default values */

export const defaultConfig: JssConfigInput = {
  api: {
    contextId: '',
    edgeUrl: undefined,
    path: undefined,
  },
  defaultSite: 'jss',
  defaultLanguage: 'en',
  editingSecret: '',
  redirects: {
    enabled: process.env.NODE_ENV !== 'development',
    locales: ['en'],
  },
  multisite: {
    enabled: true,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
};

export const loadConfig = () => {
  /* TODO: adjust this logic to work in edge runtime without path, fs modules
  const configBaseName = 'sitecore.config';
  const supportedConfigNames = [`${configBaseName}.mjs`, `${configBaseName}.js`];
  const configPath = findConfig(supportedConfigNames);
  if (!configPath) {
    throw new Error(
      `Config not found. Please ensure ${configBaseName} is present with mjs or js extension`
    );
  }
  */
  // TODO: switch to imports and transpiling ts when switching to ESM
  const configImport = require('sitecore.config');
  const config = configImport.default || configImport;
  return { ...defaultConfig, ...config };
};

export const runtimeConfig = loadConfig();
