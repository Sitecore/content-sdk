import { createSiteResolver } from '@sitecore-content-sdk/angular';
import sites from '../sites.json';
import config from '../sitecore.config';

/**
 * Site resolver instance for the application.
 * Use this to resolve the current site from request context in loaders.
 *
 * @example
 * ```typescript
 * import { resolveSite } from './site-resolver';
 *
 * export const pageLoader: LoaderFn = async (ctx) => {
 *   const { site } = resolveSite(ctx.siteContext);
 *   return client.getPage(ctx.url, { site: site.name });
 * };
 * ```
 */
export const resolveSite = createSiteResolver({
  sites,
  defaultSite: config.defaultSite,
});
