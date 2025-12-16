import { NextResponse, NextRequest } from 'next/server';
import {
  PersonalizeService,
  getPersonalizedRewrite,
  PersonalizeInfo,
  CdpHelper,
  DEFAULT_VARIANT,
} from '@sitecore-content-sdk/core/personalize';
import { debug } from '@sitecore-content-sdk/core';
import { MiddlewareBase, MiddlewareBaseConfig, REWRITE_HEADER_NAME } from './middleware';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { SitecoreConfig } from '../config';

/**
 * Represents the geolocation data used for personalization
 */
export type PersonalizeGeoData = {
  city?: string;
  country?: string;
  region?: string;
};

/**
 * The interface for the PersonalizeMiddleware configuration.
 * @public
 */
export type PersonalizeMiddlewareConfig = MiddlewareBaseConfig &
  SitecoreConfig['api']['edge'] &
  SitecoreConfig['personalize'] & {
    personalizeService?: PersonalizeService;
    getExtraUtmParams?: (req: NextRequest) => Partial<ExperienceParams['utm']>;
    extractGeoDataCb?: (req?: NextRequest) => Promise<PersonalizeGeoData> | PersonalizeGeoData;
  };

/**
 * Object model of Experience Context data
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
 */
type PersonalizeExecution = {
  friendlyId: string;
  variantIds: string[];
};

/**
 * Middleware / handler to support Sitecore Personalize
 * @public
 */
export class PersonalizeMiddleware extends MiddlewareBase {
  protected personalizeService: PersonalizeService | null;

  /**
   * @param {PersonalizeMiddlewareConfig} [config] Personalize middleware config
   */
  constructor(protected config: PersonalizeMiddlewareConfig) {
    super(config);

    // Validate edge config is present - personalize requires Edge platform
    if (!this.config.contextId && !this.config.clientContextId) {
      console.warn(
        '[PersonalizeMiddleware] Personalize middleware requires Edge configuration (contextId/clientContextId). ' +
          'Personalize features will be disabled. This is expected in local container development.'
      );
      // Set to null to indicate service is disabled
      this.personalizeService = null;
      return;
    }

    const graphQLOptions = {
      api: {
        edge: {
          contextId: this.config.contextId,
          clientContextId: this.config.clientContextId,
          edgeUrl: this.config.edgeUrl,
        },
      },
    };
    // NOTE: we provide native fetch for compatibility on Next.js Edge Runtime
    // (underlying default 'cross-fetch' is not currently compatible: https://github.com/lquixada/cross-fetch/issues/78)
    this.personalizeService =
      this.config.personalizeService ??
      new PersonalizeService({
        clientFactory: this.getClientFactory(graphQLOptions),
        timeout: this.config.edgeTimeout,
        scope: this.config.scope,
        fetch: fetch,
      });
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    if (!this.config.enabled) {
      debug.personalize('skipped (personalize middleware is disabled globally)');
      return res;
    }
    try {
      const pathname = req.nextUrl.pathname;
      const language = this.getLanguage(req, res);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      const startTimestamp = Date.now();
      const cdpTimeout = this.config.cdpTimeout;
      const geo = this.config.extractGeoDataCb
        ? await this.config.extractGeoDataCb(req)
        : undefined;

      debug.personalize('personalize middleware start: %o', {
        pathname,
        language,
        hostname,
        ...(geo && { geo }),
        headers: this.extractDebugHeaders(req.headers),
      });

      if (this.disabled(req, res)) {
        debug.personalize('skipped (personalize middleware is disabled)');
        return res;
      }

      if (
        res.redirected || // Don't attempt to personalize a redirect
        this.isPreview(req) // No need to personalize for preview (layout data is already prepared for preview)
      ) {
        debug.personalize('skipped (%s)', res.redirected ? 'redirected' : 'preview');
        return res;
      }

      const site = this.getSite(req, res);

      // Get personalization info from Experience Edge
      // personalizeService is guaranteed to be non-null here because disabled() check passed
      if (!this.personalizeService) {
        return res;
      }
      const personalizeInfo = await this.personalizeService.getPersonalizeInfo(
        pathname,
        language,
        site.name
      );
      if (!personalizeInfo) {
        // Likely an invalid route / language
        debug.personalize('skipped (personalize info not found)');
        return res;
      }

      if (personalizeInfo.variantIds.length === 0) {
        debug.personalize('skipped (no personalization configured)');
        return res;
      }

      if (this.isPrefetch(req)) {
        debug.personalize('skipped (prefetch)');
        // Personalized, but this is a prefetch request.
        // In this case, don't execute a personalize request; otherwise, the metrics for component A/B experiments would be inaccurate.
        // Disable preflight caching to force revalidation on client-side navigation (personalization WILL be influenced).
        // Note the reason we don't move this any earlier in the middleware is that we would then be sacrificing performance for non-personalized pages.
        res.headers.set('x-middleware-cache', 'no-cache');
        res.headers.set('Cache-Control', 'no-store, must-revalidate');
        return res;
      }

      await this.initPersonalizeServer({
        hostname,
        siteName: site.name,
        request: req,
        response: res,
      });

      const params = this.getExperienceParams(req);
      const executions = this.getPersonalizeExecutions(personalizeInfo, language);
      const identifiedVariantIds: string[] = [];

      await Promise.all(
        executions.map((execution) =>
          this.personalize(
            {
              friendlyId: execution.friendlyId,
              variantIds: execution.variantIds,
              params,
              language,
              timeout: cdpTimeout,
              ...(geo && { geo }),
            },
            req
          ).then((personalization) => {
            const variantId = personalization.variantId;
            if (variantId) {
              if (!execution.variantIds.includes(variantId)) {
                debug.personalize('invalid variant %s', variantId);
              } else {
                identifiedVariantIds.push(variantId);
              }
            }
          })
        )
      );

      if (identifiedVariantIds.length === 0) {
        debug.personalize('skipped (no variant(s) identified)');
        return res;
      }

      // Path can be rewritten by previously executed middleware
      const basePath = res?.headers.get(REWRITE_HEADER_NAME) || pathname;

      // Rewrite to persononalized path
      const rewritePath = getPersonalizedRewrite(basePath, identifiedVariantIds);
      const response = this.rewrite(rewritePath, req, res);

      // Disable preflight caching to force revalidation on client-side navigation (personalization MAY be influenced).
      // See https://github.com/vercel/next.js/pull/32767
      response.headers.set('x-middleware-cache', 'no-cache');

      debug.personalize('personalize middleware end in %dms: %o', Date.now() - startTimestamp, {
        rewritePath,
        headers: this.extractDebugHeaders(response.headers),
      });

      return response;
    } catch (error) {
      console.log('Personalize middleware failed:');
      console.log(error);
      return res;
    }
  };

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // Check if API config is missing - if so, disable the middleware
    if (!this.personalizeService) {
      debug.personalize('skipped (personalize service not configured - edge config required)');
      return true;
    }
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
  }

  protected getExperienceParams(req: NextRequest): ExperienceParams {
    const extraParams = this.config.getExtraUtmParams ? this.config.getExtraUtmParams(req) : {};
    const utm = {
      campaign: req.nextUrl.searchParams.get('utm_campaign') || undefined,
      content: req.nextUrl.searchParams.get('utm_content') || undefined,
      medium: req.nextUrl.searchParams.get('utm_medium') || undefined,
      source: req.nextUrl.searchParams.get('utm_source') || undefined,
      ...extraParams,
    };
    return {
      // It's expected that the header name "referer" is actually a misspelling of the word "referrer"
      // req.referrer is used during fetching to determine the value of the Referer header of the request being made,
      // used as a fallback
      referrer: req.headers.get('referer') || req.referrer,
      utm,
    };
  }

  protected async initPersonalizeServer({
    hostname,
    siteName,
    request,
    response,
  }: {
    hostname: string;
    siteName: string;
    request: NextRequest;
    response: NextResponse;
  }): Promise<void> {
    await CloudSDK(request, response, {
      sitecoreEdgeUrl: this.config.edgeUrl,
      sitecoreEdgeContextId: this.config.contextId,
      siteName,
      cookieDomain: hostname,
      enableServerCookie: true,
    })
      .addPersonalize({ enablePersonalizeCookie: true })
      .initialize();
  }

  protected async personalize(
    {
      params,
      friendlyId,
      language,
      timeout,
      variantIds,
      geo,
    }: {
      params: ExperienceParams;
      friendlyId: string;
      language: string;
      timeout?: number;
      variantIds?: string[];
      geo?: PersonalizeGeoData;
    },
    request: NextRequest
  ) {
    debug.personalize('executing experience for %s %o', friendlyId, params);

    return (await personalize(
      request,
      {
        channel: this.config.channel || 'WEB',
        currency: this.config.currency ?? 'USD',
        friendlyId,
        params,
        language,
        pageVariantIds: variantIds,
        ...(geo && { geo }),
      },
      { timeout }
    )) as {
      variantId: string;
    };
  }

  /**
   * Aggregates personalize executions based on the provided route personalize information and language
   * @param {PersonalizeInfo} personalizeInfo the route personalize information
   * @param {string} language the language
   * @returns An array of personalize executions
   */
  protected getPersonalizeExecutions(
    personalizeInfo: PersonalizeInfo,
    language: string
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
          this.config.scope
        );
        const execution = results.find((x) => x.friendlyId === friendlyId);
        if (execution) {
          execution.variantIds.push(variantId);
        } else {
          // The default/control variant (format "<ComponentID>_default") is also a valid value returned by the execution
          const defaultVariant = `${componentId}${DEFAULT_VARIANT}`;
          results.push({
            friendlyId,
            variantIds: [defaultVariant, variantId],
          });
        }
      } else {
        // Embedded (page-level) personalization in format "<VariantID>"
        const friendlyId = CdpHelper.getPageFriendlyId(
          personalizeInfo.pageId,
          language,
          this.config.scope
        );
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
}
