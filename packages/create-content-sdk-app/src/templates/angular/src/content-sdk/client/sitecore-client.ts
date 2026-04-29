import { AngularSitecoreClientService } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { scClientCache } from '../sc-client-cache';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

let _client: AngularSitecoreClientService | null = null;

/**
 * Returns the singleton Sitecore client, creating it on first access.
 * Lazy initialization avoids throwing during Angular's build-time route extraction
 * when API credentials are not yet available.
 */
export function getClient(): AngularSitecoreClientService {
  if (!_client) {
    _client = new AngularSitecoreClientService(scConfig, {
      cache: isBrowser() ? undefined : scClientCache,
      useScClientEndpoint: isBrowser(),
    });
  }
  return _client;
}
