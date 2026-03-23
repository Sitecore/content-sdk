import { SitecoreClient } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';

let _client: SitecoreClient | null = null;

/**
 * Returns the singleton SitecoreClient instance, creating it on first access.
 * Lazy initialization avoids throwing during Angular's build-time route extraction
 * when API credentials are not yet available.
 */
export function getClient(): SitecoreClient {
  if (!_client) {
    _client = new SitecoreClient({ ...scConfig });
  }
  return _client;
}
