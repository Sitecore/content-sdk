import { SitecoreConfig } from './define-config';
import config from './injected-config';

/**
 *
 */
export function getConfig(): SitecoreConfig {
  if (config) {
    return config;
  }

  throw new Error('Sitecore configuration is not available. Please check your setup.');
}
