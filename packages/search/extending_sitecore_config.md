

Type Augmentation (packages/search/src/config/types.d.ts):

```ts
import '@sitecore-content-sdk/core/config';

declare module '@sitecore-content-sdk/core/config' {
  interface SitecoreConfigInput {
    search?: {
      enabled?: boolean;
      timeout?: number;
    };
  }
}
```

The Search package handles defaults when accessing the config, since config.search may be undefined at runtime:

```ts
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';

export interface SearchConfig {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  timeout: number;
}

export const getSearchDefaults = (): SearchConfig => ({
  enabled: process.env.SEARCH_ENABLED === 'true',
  timeout: parseInt(process.env.SEARCH_TIMEOUT || '5000', 10),
});
```

```ts
// packages/search/src/config/resolver.ts
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { getSearchDefaults, SearchConfig } from './defaults';

/**
 * Resolves search config from SitecoreConfig with defaults applied
 * Handles the case where config.search might be undefined (not in fallback config)
 */
export function resolveSearchConfig(config: SitecoreConfig): SearchConfig {
  const defaults = getSearchDefaults();
  
  // Type assertion needed because DeepRequired makes it required at type level,
  // but at runtime it might be undefined if not provided
  const searchConfig = (config as any).search as Partial<SearchConfig> | undefined;

  if (!searchConfig) {
    return defaults;
  }

  return {
    enabled: searchConfig.enabled ?? defaults.enabled,
    apiUrl: searchConfig.apiUrl || defaults.apiUrl,
    apiKey: searchConfig.apiKey || defaults.apiKey,
    timeout: searchConfig.timeout ?? defaults.timeout,
  };
}
```

Resolve search parameters

```ts
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { resolveSearchConfig } from './resolver';
import { validateSearchConfig } from './validator';
import { SearchConfig } from './defaults';

/**
 * Gets and validates search configuration from SitecoreConfig
 * @param config - The SitecoreConfig object
 * @returns Validated SearchConfig
 * @throws Error if configuration is invalid
 */
export function getSearchConfig(config: SitecoreConfig): SearchConfig {
  const searchConfig = resolveSearchConfig(config);
  validateSearchConfig(searchConfig);
  return searchConfig;
}
```

Usage in service

```ts
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { getSearchConfig } from './config';

export class SearchService {
  private config: ReturnType<typeof getSearchConfig>;

  constructor(sitecoreConfig: SitecoreConfig) {
    // This handles defaults, resolution, and validation
    this.config = getSearchConfig(sitecoreConfig);
    
    if (!this.config.enabled) {
      // Handle disabled state
      return;
    }
    
    // Initialize search client with this.config.apiUrl, etc.
  }
}
```