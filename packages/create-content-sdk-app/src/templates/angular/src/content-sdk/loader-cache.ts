/**
 * Singleton loader result cache shared between Express middleware and Angular SSR.
 * Import this in both `server.ts` and `app.config.server.ts` to ensure the same instance is used.
 */
import { LoaderResultCache } from '@sitecore-content-sdk/angular/node';
import scConfig from '../../sitecore.config';

export const loaderResultCache = LoaderResultCache.forConfig(scConfig);
