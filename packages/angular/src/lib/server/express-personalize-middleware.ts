import {
  PersonalizeService,
  PersonalizeInfo,
  getPersonalizedRewrite,
  CdpHelper,
  DEFAULT_VARIANT,
} from '@sitecore-content-sdk/core/personalize';
import { SiteInfo, SiteResolver, SITE_KEY } from '@sitecore-content-sdk/core/site';
import { createGraphQLClientFactory } from '@sitecore-content-sdk/core/client';
import { debug } from '@sitecore-content-sdk/core';
import { ExpressRequest, ExpressResponse, ExpressNextFunction } from './express-data-handler';
import { DEFAULT_DATA_ENDPOINT } from './config';
import { CookieOptions, DEFAULT_EDITING_RENDER_PATH } from './express-multisite-middleware';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';

/**
 * Extended Express Request interface with personalize support
 * @public
 */
export interface PersonalizeExpressRequest extends ExpressRequest {
  cookies?: Record<string, string>;
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Extended Express Response interface with personalize support
 * @public
 */
export interface PersonalizeExpressResponse extends ExpressResponse {
  cookie(name: string, value: string, options?: CookieOptions): PersonalizeExpressResponse;
  setHeader(name: string, value: string): void;
}

/**
 * Express-compatible middleware type for personalize
 * @public
 */
export type PersonalizeExpressMiddleware = (
  req: PersonalizeExpressRequest,
  res: PersonalizeExpressResponse,
  next: ExpressNextFunction
) => void | Promise<void>;

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
 * Object model of personalize execution data
 * @internal
 */
type PersonalizeExecution = {
  friendlyId: string;
  variantIds: string[];
};

/**
 * Edge API configuration for personalization
 * @public
 */
export interface PersonalizeEdgeConfig {
  /**
   * The Sitecore Edge Context ID
   */
  contextId?: string;
  /**
   * The Sitecore Edge Client Context ID
   */
  clientContextId?: string;
  /**
   * The Sitecore Edge URL
   */
  edgeUrl?: string;
  /**
   * Timeout for Edge requests (ms)
   * @default 400
   */
  edgeTimeout?: number;
}

/**
 * Options for the Express personalize middleware
 * @public
 */
export interface ExpressPersonalizeMiddlewareOptions {
  /**
   * Whether personalization is enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Array of site configurations
   */
  sites: SiteInfo[];
  /**
   * Edge API configuration
   */
  edge: PersonalizeEdgeConfig;
  /**
   * CDP/Personalize scope identifier
   */
  scope?: string;
  /**
   * CDP channel
   * @default 'WEB'
   */
  channel?: string;
  /**
   * Currency for personalization
   * @default 'USD'
   */
  currency?: string;
  /**
   * Timeout for CDP requests (ms)
   */
  cdpTimeout?: number;
  /**
   * Default language
   * @default 'en'
   */
  defaultLanguage?: string;
  /**
   * Fallback hostname in case 'host' header is not present
   * @default 'localhost'
   */
  defaultHostname?: string;
  /**
   * The data endpoint path used by loaders
   * @default '/_data'
   */
  dataEndpoint?: string;
  /**
   * The editing render API prefix path
   * @default '/api/editing/render'
   */
  editingRenderPath?: string;
  /**
   * Custom PersonalizeService instance
   */
  personalizeService?: PersonalizeService;
  /**
   * Function to extract geo data from request
   */
  extractGeoData?: (req: PersonalizeExpressRequest) => Promise<PersonalizeGeoData> | PersonalizeGeoData;
  /**
   * Function to extract extra UTM parameters
   */
  getExtraUtmParams?: (req: PersonalizeExpressRequest) => Partial<ExperienceParams['utm']>;
  /**
   * Function to determine if a request should be skipped by the middleware
   */
  skip?: (req: PersonalizeExpressRequest) => boolean;
}

/**
 * Header name for tracking personalize rewrite path
 */
export const PERSONALIZE_REWRITE_HEADER = 'x-sc-personalize-rewrite';

/**
 * Get the host header from the request
 */
function getHostHeader(req: PersonalizeExpressRequest): string | undefined {
  const headers = req.headers || {};
  const forwardedHost = headers['x-forwarded-host'];
  const host = headers.host;

  const hostValue = forwardedHost || host;
  if (typeof hostValue === 'string') {
    return hostValue.split(':')[0];
  }
  if (Array.isArray(hostValue) && hostValue.length > 0) {
    return hostValue[0].split(':')[0];
  }
  return undefined;
}

/**
 * Parse URL to extract pathname and search params
 */
function parseUrl(url: string): { pathname: string; searchParams: URLSearchParams } {
  try {
    const urlObj = new URL(url, 'http://localhost');
    return {
      pathname: urlObj.pathname,
      searchParams: urlObj.searchParams,
    };
  } catch {
    return {
      pathname: url.split('?')[0],
      searchParams: new URLSearchParams(url.split('?')[1] || ''),
    };
  }
}

/**
 * Check if the request is a file request (has extension)
 */
function isFileRequest(pathname: string): boolean {
  return pathname.includes('.');
}

/**
 * Check if the request should be skipped
 */
function shouldSkipRequest(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_') ||
    pathname.startsWith('/__') ||
    pathname.startsWith('/favicon') ||
    isFileRequest(pathname)
  );
}

/**
 * Get experience parameters from request
 */
function getExperienceParams(
  req: PersonalizeExpressRequest,
  getExtraUtmParams?: (req: PersonalizeExpressRequest) => Partial<ExperienceParams['utm']>
): ExperienceParams {
  const { searchParams } = parseUrl(req.url);
  const extraParams = getExtraUtmParams ? getExtraUtmParams(req) : {};
  const headers = req.headers || {};

  const utm = {
    campaign: searchParams.get('utm_campaign') || undefined,
    content: searchParams.get('utm_content') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    source: searchParams.get('utm_source') || undefined,
    ...extraParams,
  };

  return {
    referrer: (headers.referer as string) || '',
    utm,
  };
}

/**
 * Aggregates personalize executions based on the provided route personalize information
 */
function getPersonalizeExecutions(
  personalizeInfo: PersonalizeInfo,
  language: string,
  scope?: string
): PersonalizeExecution[] {
  if (personalizeInfo.variantIds.length === 0) {
    return [];
  }

  const results: PersonalizeExecution[] = [];

  return personalizeInfo.variantIds.reduce((results, variantId) => {
    if (variantId.includes('_')) {
      // Component-level personalization in format "<ComponentID>_<VariantID>"
      const componentId = variantId.split('_')[0];
      const friendlyId = CdpHelper.getComponentFriendlyId(
        personalizeInfo.pageId,
        componentId,
        language,
        scope
      );
      const execution = results.find((x) => x.friendlyId === friendlyId);
      if (execution) {
        execution.variantIds.push(variantId);
      } else {
        // The default/control variant (format "<ComponentID>_default") is also a valid value
        const defaultVariant = `${componentId}${DEFAULT_VARIANT}`;
        results.push({
          friendlyId,
          variantIds: [defaultVariant, variantId],
        });
      }
    } else {
      // Embedded (page-level) personalization in format "<VariantID>"
      const friendlyId = CdpHelper.getPageFriendlyId(personalizeInfo.pageId, language, scope);
      const execution = results.find((x) => x.friendlyId === friendlyId);
      if (execution) {
        execution.variantIds.push(variantId);
      } else {
        results.push({
          friendlyId,
          variantIds: [variantId],
        });
      }
    }
    return results;
  }, results);
}

/**
 * Create an Express middleware for Sitecore Personalize support.
 * This middleware fetches personalization info and rewrites the request path
 * to include variant information for personalized content delivery.
 *
 * Features:
 * - Fetches personalization info from Sitecore Edge
 * - Executes personalization via CloudSDK
 * - Rewrites request paths to include variant IDs
 * - Supports page-level and component-level personalization
 * - Handles geo-targeting and UTM parameters
 *
 * @param options - Handler options including sites and edge configuration
 * @returns Express middleware that handles personalization
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressPersonalizeMiddleware } from '@sitecore-content-sdk/angular';
 * import sites from './sites.json';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.use(createExpressPersonalizeMiddleware({
 *   sites,
 *   edge: {
 *     contextId: process.env.SITECORE_EDGE_CONTEXT_ID,
 *     edgeUrl: process.env.SITECORE_EDGE_URL,
 *   },
 * }));
 * ```
 * @public
 */
export function createExpressPersonalizeMiddleware(
  options: ExpressPersonalizeMiddlewareOptions
): PersonalizeExpressMiddleware {
  const {
    enabled = true,
    sites,
    edge,
    scope,
    channel = 'WEB',
    currency = 'USD',
    cdpTimeout,
    defaultLanguage = 'en',
    defaultHostname = 'localhost',
    dataEndpoint = DEFAULT_DATA_ENDPOINT,
    editingRenderPath = DEFAULT_EDITING_RENDER_PATH,
    extractGeoData,
    getExtraUtmParams,
    skip,
  } = options;

  // Validate edge config is present
  if (!edge.contextId && !edge.clientContextId) {
    console.warn(
      '[PersonalizeMiddleware] Personalize middleware requires Edge configuration (contextId/clientContextId). ' +
      'Personalize features will be disabled.'
    );
  }

  const siteResolver = new SiteResolver(sites);

  // Create personalize service
  let personalizeService: PersonalizeService | null = null;

  if (edge.contextId || edge.clientContextId) {
    const graphQLOptions = {
      api: {
        edge: {
          contextId: edge.contextId!,
          clientContextId: edge.clientContextId,
          edgeUrl: edge.edgeUrl,
        },
      },
    };

    personalizeService =
      options.personalizeService ??
      new PersonalizeService({
        clientFactory: createGraphQLClientFactory(graphQLOptions),
        timeout: edge.edgeTimeout,
        scope,
        fetch: fetch,
      });
  }

  return async (
    req: PersonalizeExpressRequest,
    res: PersonalizeExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    // Check if globally disabled
    if (!enabled) {
      debug.personalize('skipped (personalize middleware is disabled globally)');
      next();
      return;
    }

    // Check if properly configured
    if (!personalizeService) {
      debug.personalize('skipped (personalize not properly configured)');
      next();
      return;
    }

    const startTimestamp = Date.now();
    const { pathname, searchParams } = parseUrl(req.url);

    try {
      // Check if middleware should be skipped via custom skip function
      if (skip && skip(req)) {
        debug.personalize('skipped (custom skip function)');
        next();
        return;
      }

      // Skip static files, API routes, and internal paths
      if (shouldSkipRequest(pathname)) {
        debug.personalize('skipped (static file or internal path)');
        next();
        return;
      }

      // Skip data endpoint requests
      if (pathname === dataEndpoint) {
        debug.personalize('skipped (data endpoint)');
        next();
        return;
      }

      // Skip editing render requests
      if (pathname.startsWith(editingRenderPath)) {
        debug.personalize('skipped (editing render request)');
        next();
        return;
      }

      const hostname = getHostHeader(req) || defaultHostname;
      const geo = extractGeoData ? await extractGeoData(req) : undefined;

      debug.personalize('personalize middleware start: %o', {
        pathname,
        hostname,
        ...(geo && { geo }),
      });

      // Resolve site
      let siteName: string;
      let siteLanguage: string;

      // Check SITE_KEY cookie first
      if (req.cookies && req.cookies[SITE_KEY]) {
        const site = siteResolver.getByName(req.cookies[SITE_KEY]);
        if (site) {
          siteName = site.name;
          siteLanguage = site.language;
        } else {
          siteName = req.cookies[SITE_KEY];
          siteLanguage = defaultLanguage;
        }
      } else {
        try {
          const site = siteResolver.getByHost(hostname);
          siteName = site.name;
          siteLanguage = site.language;
        } catch {
          debug.personalize('could not resolve site for hostname %s, skipping', hostname);
          next();
          return;
        }
      }

      // Get language from query params or use site default
      const language = searchParams.get('sc_lang') || siteLanguage || defaultLanguage;

      // Get personalization info from Experience Edge
      const personalizeInfo = await personalizeService.getPersonalizeInfo(
        pathname,
        language,
        siteName
      );

      if (!personalizeInfo) {
        debug.personalize('skipped (personalize info not found)');
        next();
        return;
      }

      if (personalizeInfo.variantIds.length === 0) {
        debug.personalize('skipped (no personalization configured)');
        next();
        return;
      }

      // Initialize CloudSDK for personalization
      // Note: CloudSDK expects Next.js-like request/response, we cast for Express compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      await CloudSDK(req as any, res as any, {
        sitecoreEdgeUrl: edge.edgeUrl,
        sitecoreEdgeContextId: edge.contextId || '',
        siteName,
        cookieDomain: hostname,
        enableServerCookie: true,
      })
        .addPersonalize({ enablePersonalizeCookie: true })
        .initialize();

      const params = getExperienceParams(req, getExtraUtmParams);
      const executions = getPersonalizeExecutions(personalizeInfo, language, scope);
      const identifiedVariantIds: string[] = [];

      // Execute personalization for all variants
      await Promise.all(
        executions.map(async (execution) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const result = (await personalize(
            req as any,
            {
              channel,
              currency,
              friendlyId: execution.friendlyId,
              params,
              language,
              pageVariantIds: execution.variantIds,
              ...(geo && { geo }),
            },
            { timeout: cdpTimeout }
          )) as { variantId?: string };

          const variantId = result.variantId;
          if (variantId) {
            if (!execution.variantIds.includes(variantId)) {
              debug.personalize('invalid variant %s', variantId);
            } else {
              identifiedVariantIds.push(variantId);
            }
          }
        })
      );

      if (identifiedVariantIds.length === 0) {
        debug.personalize('skipped (no variant(s) identified)');
        next();
        return;
      }

      // Rewrite to personalized path
      const rewritePath = getPersonalizedRewrite(pathname, identifiedVariantIds);

      // Update the request URL with the rewritten path
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      req.url = rewritePath + queryString;

      // Set header for downstream middleware to know personalization was applied
      if (res.setHeader) {
        res.setHeader(PERSONALIZE_REWRITE_HEADER, rewritePath);
        // Disable caching for personalized content
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
      }

      debug.personalize('personalize middleware end in %dms: %o', Date.now() - startTimestamp, {
        rewritePath,
        identifiedVariantIds,
        siteName,
      });

      next();
    } catch (error) {
      console.log('Personalize middleware failed:');
      console.log(error);
      next();
    }
  };
}
