import {
  CdpHelper,
  DEFAULT_VARIANT,
  getGroomedVariantIds,
  PersonalizeInfo,
  PersonalizeService,
} from '@sitecore-content-sdk/content/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/content/client';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsServerAdapter } from '@sitecore-content-sdk/analytics-core';
import { BOT_DETECTION_COOKIE } from '@sitecore-content-sdk/analytics-core/internal';
import {
  personalize,
  personalizeServerPlugin,
  personalizeServerAdapter,
} from '@sitecore-content-sdk/personalize';
import {
  CsdkExpressRequest,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressResponse,
  BaseMiddlewareOptions,
  ExpressRequest,
} from './models';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import { SC_PARAMS_HEADER } from '../../loaders/constants';
import { getMiddlewareRequest, shouldProcessPath, toNodeAdapterPair } from './utils';
import debug from '../../debug';
import { isEditingPreview } from '../utils';

/**
 * Object model of Experience Context data
 * @public
 */
export type ExperienceParams = {
  referrer: string;
  utm: {
    [key: string]: string | undefined;
    campaign: string | undefined;
    source: string | undefined;
    medium: string | undefined;
    content: string | undefined;
  };
};

/**
 * Represents the geolocation data used for personalization
 * @public
 */
export type PersonalizeGeoData = {
  city?: string;
  country?: string;
  region?: string;
};

/**
 * Configuration for the personalize middleware
 * @public
 */
export type PersonalizeMiddlewareOptions = BaseMiddlewareOptions &
  Partial<SitecoreConfig['personalize']> &
  Partial<SitecoreConfig['api']['edge']> & {
    /** Locales used to extract the language from the request path */
    locales?: string[];
    /** Fallback language when the request path has no locale prefix. Default is `'en'` */
    defaultLanguage?: string;
    /** Fallback site name when not resolved by the multisite middleware or site cookie */
    defaultSite?: string;
    /** Override the personalize service instance */
    personalizeService?: PersonalizeService;
    /** Get extra UTM parameters from the request */
    getExtraUtmParams?: (req: ExpressRequest) => Partial<ExperienceParams['utm']>;
    /** Extract geolocation data from the request */
    extractGeoDataCb?: (req: ExpressRequest) => Promise<PersonalizeGeoData> | PersonalizeGeoData;
    /**
     * Skip personalization for bot requests marked by the bot tracking middleware. Default `true`.
     */
    skipForBot?: boolean;
  };

type PersonalizeExecution = {
  friendlyId: string;
  variantIds: string[];
};

const isPrefetch = (req: ExpressRequest): boolean =>
  [req.headers?.purpose, req.headers?.['sec-purpose']].some(
    (header) => typeof header === 'string' && header.includes('prefetch')
  );

const getExperienceParams = (
  query: Record<string, string | string[] | undefined>,
  referrer: string,
  extraUtmParams: Partial<ExperienceParams['utm']> = {}
): ExperienceParams => {
  const utmParam = (name: string) => {
    const value = query[name];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  return {
    referrer,
    utm: {
      campaign: utmParam('utm_campaign'),
      content: utmParam('utm_content'),
      medium: utmParam('utm_medium'),
      source: utmParam('utm_source'),
      ...extraUtmParams,
    },
  };
};

/**
 * Aggregates personalize executions (friendly id + variant ids) for the route,
 * grouping page-level ("<VariantID>") and component-level ("<ComponentID>_<VariantID>") variants.
 * @param {PersonalizeInfo} personalizeInfo the route personalize information
 * @param {string} language the language
 * @param {string} [scope] optional Sitecore Personalize scope
 * @returns {PersonalizeExecution[]} An array of personalize executions
 */
const getPersonalizeExecutions = (
  personalizeInfo: PersonalizeInfo,
  language: string,
  scope?: string
): PersonalizeExecution[] =>
  personalizeInfo.variantIds.reduce<PersonalizeExecution[]>((results, variantId) => {
    const isComponentVariant = variantId.includes('_');
    const componentId = variantId.split('_')[0];
    const friendlyId = isComponentVariant
      ? CdpHelper.getComponentFriendlyId(personalizeInfo.pageId, componentId, language, scope)
      : CdpHelper.getPageFriendlyId(personalizeInfo.pageId, language, scope);
    const execution = results.find((x) => x.friendlyId === friendlyId);
    if (execution) {
      execution.variantIds.push(variantId);
    } else {
      results.push({
        friendlyId,
        // The default/control variant ("<ComponentID>_default") is also a valid execution result
        variantIds: isComponentVariant
          ? [`${componentId}${DEFAULT_VARIANT}`, variantId]
          : [variantId],
      });
    }
    return results;
  }, []);

/**
 * Middleware to support Sitecore Personalize.
 * Identifies page/component variants for the request via Sitecore CDP and populates
 * `req.scParams.variantId` and `req.scParams.componentVariantIds` for downstream layout personalization.
 * @param {PersonalizeMiddlewareOptions} options personalize middleware options
 * @returns {ExpressMiddleware} Express middleware
 * @public
 */
export function createPersonalizeMiddleware(
  options: PersonalizeMiddlewareOptions
): ExpressMiddleware {
  const personalizeService =
    options.personalizeService ??
    (options.contextId || options.clientContextId
      ? new PersonalizeService({
          clientFactory: createGraphQLClientFactory({
            api: {
              edge: {
                contextId: options.contextId as string,
                clientContextId: options.clientContextId,
                edgeUrl: options.edgeUrl,
              },
            },
          }),
          timeout: options.edgeTimeout,
          scope: options.scope,
          fetch: fetch,
        })
      : null);

  if (!personalizeService) {
    console.warn(
      '[PersonalizeMiddleware] Personalize middleware requires Edge configuration (contextId/clientContextId). ' +
        'Personalize features will be disabled. This is expected in local container development.'
    );
  }

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      // `enabled` defaults to true: omitting it keeps the middleware on (see BaseMiddlewareOptions).
      if (options.enabled === false || !personalizeService) {
        debug.personalize('personalize middleware disabled or not configured');
        return next();
      }
      // For browser loader navigations (/_data) routing data comes from the loader payload, not
      // the request; getMiddlewareRequest normalizes both into path/query/data.
      const { path, query, data } = getMiddlewareRequest(req);

      if (isEditingPreview(data.headers)) {
        debug.personalize('skipped (editing/preview mode)');
        return next();
      }

      if (!shouldProcessPath(path, options.matcher)) {
        debug.personalize('personalize middleware skipped (path does not match)');
        return next();
      }

      if (options.skip?.(req)) {
        debug.personalize('personalize middleware skipped (skip predicate)');
        return next();
      }

      // Skip personalization for bot requests marked by the bot tracking middleware.
      if ((options.skipForBot ?? true) && data.cookies?.[BOT_DETECTION_COOKIE]) {
        debug.personalize('skipped (bot request)');
        return next();
      }

      const startTimestamp = Date.now();
      const { locale, nonLocalePath } = splitLocaleFromPath(path, options.locales ?? []);
      const language = locale || options.defaultLanguage || 'en';
      const siteName =
        (req as CsdkExpressRequest).scParams?.siteName ||
        data.cookies?.[SITE_KEY] ||
        options.defaultSite;
      const hostHeader = data.headers?.['x-forwarded-host'] ?? data.headers?.host;
      const hostname =
        (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)?.split(':')[0] || 'localhost';

      debug.personalize('personalize middleware start: %o', {
        path: nonLocalePath,
        language,
        siteName,
        hostname,
        headers: req.headers,
      });

      if (!siteName) {
        debug.personalize('skipped (site could not be resolved)');
        return next();
      }

      // Get personalization info from Experience Edge
      const personalizeInfo = await personalizeService.getPersonalizeInfo(
        nonLocalePath,
        language,
        siteName
      );
      if (!personalizeInfo) {
        // Likely an invalid route / language
        debug.personalize('skipped (personalize info not found)');
        return next();
      }
      if (personalizeInfo.variantIds.length === 0) {
        debug.personalize('skipped (no personalization configured)');
        return next();
      }

      if (isPrefetch(req)) {
        // Personalized, but this is a prefetch request.
        // Don't execute a personalize request; otherwise, the metrics for component A/B experiments would be inaccurate.
        // Disable caching to force revalidation on navigation (personalization WILL be influenced).
        debug.personalize('skipped (prefetch)');
        res.setHeader?.('x-proxy-cache', 'no-cache');
        res.setHeader?.('Cache-Control', 'no-store, must-revalidate');
        return next();
      }

      // Express req/res are http.IncomingMessage/ServerResponse at runtime; the minimal
      // Express interfaces don't declare that, so cast for the cookie-based server adapters.
      const { req: httpReq, res: httpRes } = toNodeAdapterPair(req as CsdkExpressRequest, res);
      await initContentSdk({
        config: {
          contextId: options.contextId as string,
          edgeUrl: options.edgeUrl,
          siteName,
        },
        plugins: [
          analyticsPlugin({
            options: {
              enableCookie: true,
              cookieDomain: hostname,
            },
            // personalize middleware will only run on server for Angular and we explicitly use server adapters
            adapter: analyticsServerAdapter(httpReq, httpRes),
          }),
          personalizeServerPlugin({
            options: {
              enablePersonalizeCookie: true,
            },
            adapter: personalizeServerAdapter(httpReq, httpRes),
          }),
        ],
      });

      const geo = options.extractGeoDataCb ? await options.extractGeoDataCb(req) : undefined;
      const params = getExperienceParams(
        query,
        (data.referrer as string) || (data.headers?.referer as string) || '',
        options.getExtraUtmParams?.(req)
      );
      const executions = getPersonalizeExecutions(personalizeInfo, language, options.scope);
      const identifiedVariantIds: string[] = [];

      await Promise.all(
        executions.map(async (execution) => {
          debug.personalize('executing experience for %s %o', execution.friendlyId, params);
          const personalization = (await personalize(
            {
              channel: options.channel || 'WEB',
              currency: options.currency ?? 'USD',
              friendlyId: execution.friendlyId,
              params,
              language,
              pageVariantIds: execution.variantIds,
              ...(geo && { geo }),
            },
            { timeout: options.cdpTimeout }
          )) as { variantId?: string } | null;
          const variantId = personalization?.variantId;
          if (!variantId) return;
          if (!execution.variantIds.includes(variantId)) {
            debug.personalize('invalid variant %s', variantId);
          } else {
            identifiedVariantIds.push(variantId);
          }
        })
      );

      if (identifiedVariantIds.length === 0) {
        debug.personalize('skipped (no variant(s) identified)');
        return next();
      }

      const { variantId, componentVariantIds } = getGroomedVariantIds(identifiedVariantIds);
      (req as CsdkExpressRequest).scParams = {
        ...((req as CsdkExpressRequest).scParams || {}),
        variantId,
        componentVariantIds,
      };
      // Also ride the params on a header so they survive Angular's conversion of the
      // Express request to a web Request on the SSR path (same mechanism as editing params).
      req.headers = req.headers ?? {};
      req.headers[SC_PARAMS_HEADER] = JSON.stringify((req as CsdkExpressRequest).scParams);

      debug.personalize('personalize middleware end in %dms: %o', Date.now() - startTimestamp, {
        variantId,
        componentVariantIds,
      });
    } catch (error) {
      console.log('Personalize middleware failed:');
      console.log(error);
    }
    next();
  };
}
