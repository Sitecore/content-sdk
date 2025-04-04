﻿import { NextResponse, NextRequest } from 'next/server';
import {
  GraphQLPersonalizeService,
  getPersonalizedRewrite,
  PersonalizeInfo,
  CdpHelper,
  DEFAULT_VARIANT,
} from '@sitecore-content-sdk/core/personalize';
import { debug, GraphQLRequestClientFactory } from '@sitecore-content-sdk/core';
import { MiddlewareBase, MiddlewareBaseConfig, REWRITE_HEADER_NAME } from './middleware';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';
import { SitecoreConfig } from '../config';

export type CdpServiceConfig = {
  /**
   * Your Sitecore Edge Platform endpoint
   * Default is https://edge-platform.sitecorecloud.io
   */
  sitecoreEdgeUrl?: string;
  /**
   * Your unified Sitecore Edge Context Id
   */
  sitecoreEdgeContextId: string;
  /**
   * The Sitecore CDP channel to use for events. Uses 'WEB' by default.
   */
  channel?: string;
  /**
   * Currency for CDP request. Uses 'USA' as default.
   */
  currency?: string;
  /**
   * Timeout (ms) for CDP request. Default is 400.
   */
  timeout?: number;
};

export type PersonalizeMiddlewareConfig = MiddlewareBaseConfig &
  SitecoreConfig['api']['edge'] &
  SitecoreConfig['personalize'] & {
    clientFactory: GraphQLRequestClientFactory;
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
 */
export class PersonalizeMiddleware extends MiddlewareBase {
  private personalizeService: GraphQLPersonalizeService;

  /**
   * @param {PersonalizeMiddlewareConfig} [config] Personalize middleware config
   */
  constructor(protected config: PersonalizeMiddlewareConfig) {
    super(config);
    // NOTE: we provide native fetch for compatibility on Next.js Edge Runtime
    // (underlying default 'cross-fetch' is not currently compatible: https://github.com/lquixada/cross-fetch/issues/78)
    this.personalizeService = new GraphQLPersonalizeService({
      clientFactory: this.config.clientFactory,
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
      const language = this.getLanguage(req);
      const hostname = this.getHostHeader(req) || this.defaultHostname;
      const startTimestamp = Date.now();
      const cdpTimeout = this.config.cdpTimeout;

      debug.personalize('personalize middleware start: %o', {
        pathname,
        language,
        hostname,
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
    }: {
      params: ExperienceParams;
      friendlyId: string;
      language: string;
      timeout?: number;
      variantIds?: string[];
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
      },
      { timeout }
    )) as {
      variantId: string;
    };
  }

  protected getExperienceParams(req: NextRequest): ExperienceParams {
    const utm = {
      campaign: req.nextUrl.searchParams.get('utm_campaign') || undefined,
      content: req.nextUrl.searchParams.get('utm_content') || undefined,
      medium: req.nextUrl.searchParams.get('utm_medium') || undefined,
      source: req.nextUrl.searchParams.get('utm_source') || undefined,
    };

    return {
      // It's expected that the header name "referer" is actually a misspelling of the word "referrer"
      // req.referrer is used during fetching to determine the value of the Referer header of the request being made,
      // used as a fallback
      referrer: req.headers.get('referer') || req.referrer,
      utm: utm,
    };
  }

  protected disabled(req: NextRequest, res: NextResponse): boolean | undefined {
    // ignore files
    return req.nextUrl.pathname.includes('.') || super.disabled(req, res);
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
