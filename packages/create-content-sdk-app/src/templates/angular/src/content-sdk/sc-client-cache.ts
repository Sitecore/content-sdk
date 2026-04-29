/**
 * Singleton {@link ScClientCache} for Express (`/admin/cache` and any `/_sc-client` middleware).
 * Must match the cache used by `AngularSitecoreClientService` in `content-sdk/client/sitecore-client.ts` on the server.
 */
import { ScClientCache } from '@sitecore-content-sdk/angular/node';
import scConfig from '../../sitecore.config';

export const scClientCache = ScClientCache.forConfig(scConfig);
