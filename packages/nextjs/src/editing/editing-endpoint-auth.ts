import { IncomingHttpHeaders } from 'http';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import debug from '../debug';
import { getEditingSecret } from '../utils/utils';

type HeaderBag =
  | Headers
  | IncomingHttpHeaders
  | Record<string, string | string[] | undefined>;

export type EditingEndpointAuthSuccess = {
  ok: true;
  corsHeaders: Record<string, string>;
};

export type EditingEndpointAuthFailure = {
  ok: false;
  status: 401;
  body: { message: string };
  corsHeaders?: Record<string, string>;
};

export type EditingEndpointAuthResult = EditingEndpointAuthSuccess | EditingEndpointAuthFailure;

/**
 * Shared CORS + editing-secret authorization used by Pages Router middleware and
 * App Router route handlers for editing endpoints.
 * @param {object} params - Request authorization inputs.
 * @param {string | undefined} params.method - HTTP method.
 * @param {HeaderBag} params.headers - Request headers.
 * @param {string | string[] | null | undefined} params.secret - Editing secret from query/search params.
 * @param {string | undefined} [params.presetCorsHeader] - Existing Access-Control-Allow-Origin header if any.
 * @param {boolean} [params.requireSecret=true] - When false, only CORS is validated (e.g. OPTIONS may still check secret depending on caller).
 * @returns {EditingEndpointAuthResult} Authorization result.
 * @internal
 */
export const authorizeEditingEndpointRequest = (params: {
  method?: string;
  headers: HeaderBag;
  secret?: string | string[] | null;
  presetCorsHeader?: string;
  requireSecret?: boolean;
}): EditingEndpointAuthResult => {
  const { method, headers, secret, presetCorsHeader, requireSecret = true } = params;

  const corsHeaders = getEnforcedCorsHeaders({
    requestMethod: method,
    headers: headers as never,
    presetCorsHeader,
    allowedOrigins: EDITING_ALLOWED_ORIGINS,
  });

  if (!corsHeaders) {
    debug.editing(
      'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
    );
    return {
      ok: false,
      status: 401,
      body: { message: 'Invalid origin' },
    };
  }

  if (requireSecret) {
    const secretValue = Array.isArray(secret) ? secret[0] : secret ?? undefined;
    const expectedSecret = getEditingSecret();

    if (secretValue !== expectedSecret) {
      debug.editing(
        'invalid editing secret - sent "%s" expected "%s"',
        secretValue,
        expectedSecret
      );
      return {
        ok: false,
        status: 401,
        body: { message: 'Missing or invalid editing secret' },
        corsHeaders,
      };
    }
  }

  return { ok: true, corsHeaders };
};

/**
 * Reads the editing secret query param name used by editing endpoints.
 * @returns {string} Query parameter name for the editing secret.
 * @internal
 */
export const getEditingSecretQueryParamName = (): string => QUERY_PARAM_EDITING_SECRET;
