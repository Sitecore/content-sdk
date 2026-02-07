import type { APIRoute } from 'astro';
import {
  EditMode,
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
  getEnforcedCorsHeaders,
} from '@sitecore-content-sdk/astro';
import scConfig from '../../../sitecore.config';

// This endpoint must be server-rendered (not prerendered at build time)
export const prerender = false;

/**
 * This Astro API route is used by Sitecore Editor in XM Cloud
 * to determine feature compatibility and configuration.
 */

// Component list — add your registered component names here
const components: string[] = [];

// Application metadata
const metadata = {
  packages: {},
};

function handleRequest(request: Request): Response {
  const url = new URL(request.url);
  const secret = url.searchParams.get(QUERY_PARAM_EDITING_SECRET);

  const corsHeaders = getEnforcedCorsHeaders({
    requestMethod: request.method,
    headers: request.headers,
    allowedOrigins: [...EDITING_ALLOWED_ORIGINS, 'https://pages-staging.sitecore-staging.cloud'],
  });

  if (!corsHeaders) {
    return new Response(JSON.stringify({ message: 'Invalid origin' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const responseHeaders = new Headers(corsHeaders as Record<string, string>);
  responseHeaders.set('Content-Type', 'application/json');

  if (secret !== scConfig.editingSecret) {
    return new Response(JSON.stringify({ message: 'Missing or invalid editing secret' }), {
      status: 401,
      headers: responseHeaders,
    });
  }

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    });
  }

  return new Response(
    JSON.stringify({
      components,
      packages: metadata.packages,
      editMode: EditMode.Metadata,
    }),
    {
      status: 200,
      headers: responseHeaders,
    }
  );
}

export const GET: APIRoute = ({ request }) => {
  return handleRequest(request);
};

export const OPTIONS: APIRoute = ({ request }) => {
  return handleRequest(request);
};
