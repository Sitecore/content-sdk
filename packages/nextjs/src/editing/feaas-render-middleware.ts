// nextjs/src/editing/feaas-render-middleware.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  EDITING_FORWARD_ENABLED,
  EDITING_PASS_THROUGH_HEADERS,
} from './constants';
import {
  forwardInternally,
  setCspFrameAncestors,
  scrubOutgoingSetCookie,
} from './internal-forward-helpers';

import { debug } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
  DesignLibraryRenderPreviewData,
} from '@sitecore-content-sdk/core/editing';
import { enforceCors, getAllowedOriginsFromEnv } from '@sitecore-content-sdk/core/utils';
import { getEditingSecret } from '../utils/utils';
import { RenderMiddlewareBase } from './render-middleware';

export class FEAASRenderMiddleware extends RenderMiddlewareBase {
  public getHandler() {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const { query, body, method, headers } = req;

      debug.editing('feaas editing render middleware start: %o', {
        method,
        query,
        headers,
        body,
      });

      // ---- CORS (allowed origins) ----
      if (!enforceCors(req, res, EDITING_ALLOWED_ORIGINS)) {
        debug.editing(
          'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
        );
        return res.status(401).json({
          html: `<html><body>Requests from origin ${req.headers?.origin} not allowed</body></html>`,
        });
      }

      // ---- Secret validation ----
      const secret =
        (query[QUERY_PARAM_EDITING_SECRET] as string | undefined) ??
        (body as any)?.jssEditingSecret;
      if (secret !== getEditingSecret()) {
        debug.editing(
          'invalid editing secret - sent "%s" expected "%s"',
          secret,
          getEditingSecret()
        );
        return res.status(401).json({
          html: '<html><body>Missing or invalid secret</body></html>',
        });
      }

      // ---- Method guards ----
      if (req.method === 'OPTIONS') {
        debug.editing('preflight request');
        return res.status(204).send(null);
      }
      if (req.method !== 'GET') {
        debug.editing('invalid method - sent %s expected GET', req.method);
        res.setHeader('Allow', 'GET');
        return res.status(405).json({
          html: `<html><body>Invalid request method '${req.method}'</body></html>`,
        });
      }

      // ---- Required params for Design Library (component render) ----
      const componentRequiredParams = [
        'sc_site',
        'sc_itemid',
        'sc_renderingId',
        'sc_uid',
        'sc_lang',
        'mode',
      ];
      const missing = componentRequiredParams.filter((p) => !query[p as keyof typeof query]);
      if (missing.length) {
        debug.editing('missing required query parameters: %o', missing);
        return res.status(400).json({
          html: `<html><body>Missing required query parameters: ${missing.join(', ')}</body></html>`,
        });
      }

      // ---- Set Next.js preview data for FEAAS (Design Library component render) ----
      res.setPreviewData(
        {
          itemId: query.sc_itemid as string,
          componentUid: query.sc_uid as string,
          renderingId: query.sc_renderingId as string,
          language: query.sc_lang as string,
          site: query.sc_site as string,
          mode: query.mode as string | undefined,
          dataSourceId: (query as any).dataSourceId as string | undefined,
          version: (query.sc_version as string) || undefined,
        } as DesignLibraryRenderPreviewData,
        { maxAge: 3 }
      );

      // ===== Option 4: Internal forward (feature-flagged) =====
      if (EDITING_FORWARD_ENABLED) {
        try {
          const target = '/feaas/render';

          // Capture the preview cookies just set by setPreviewData
          const previewSetCookies = res.getHeader('Set-Cookie');

          // NEVER leak preview cookies to the browser in Option 4
          scrubOutgoingSetCookie(res);

          // Keep frame-ancestors CSP on the final response
          setCspFrameAncestors(res, [
            ...getAllowedOriginsFromEnv(),
            ...EDITING_ALLOWED_ORIGINS,
          ]);

          // Pass through whitelisted query params (e.g., Vercel bypass tokens)
          const extraQuery =
            typeof this.getQueryParamsForPropagation === 'function'
              ? this.getQueryParamsForPropagation(
                  req.query as Partial<Record<string, string | string[]>>
                )
              : {};

          // Perform internal server-side fetch to render the component page
          const internalResp = await forwardInternally({
            req,
            res,
            routePath: target,
            previewSetCookies,
            passThroughHeaders: EDITING_PASS_THROUGH_HEADERS ?? ['authorization'],
            extraQuery,
          });

          // Mirror selected headers (never Set-Cookie) + mark the response
          const contentType =
            internalResp.headers.get('content-type') || 'text/html; charset=utf-8';
          const cacheControl = internalResp.headers.get('cache-control') || 'no-store';
          const vary = internalResp.headers.get('vary');

          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', cacheControl);
          if (vary) res.setHeader('Vary', vary);
          res.setHeader('x-feaas-editing-forward', '1');

          const html = await internalResp.text();
          return res.status(internalResp.status).send(html);
        } catch (e) {
          // Safe fallback to legacy path
          console.warn('[feaas-editing-forward] fallback to redirect:', (e as Error)?.message);
        }
      }
      // ===== End Option 4 block =====

      // ---- Legacy behavior (feature flag OFF or forward failed): redirect ----
      res.setHeader(
        'Content-Security-Policy',
        `frame-ancestors 'self' ${[
          ...getAllowedOriginsFromEnv(),
          ...EDITING_ALLOWED_ORIGINS,
        ].join(' ')}`
      );

      // Preserve your legacy redirect to SSR page
      return res.redirect(307, '/feaas/render');
    };
  }
}

export default FEAASRenderMiddleware;
