import { isDesignLibraryMode } from '@sitecore-content-sdk/nextjs';
import { getJssEditingSecret } from '@sitecore-content-sdk/nextjs/utils';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Parse query string parameters
  const searchParams = request.nextUrl.searchParams;

  const incommingSecret = searchParams.get('QUERY_PARAM_EDITING_SECRET');

  const editingSecret = getJssEditingSecret();

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (!incommingSecret || incommingSecret !== editingSecret) {
    return new Response('Invalid secret', { status: 401 });
  }

  const mode = searchParams.get('mode');
  const defaultRequiredParams = ['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode'];

  const componentRequiredParams = [
    'sc_site',
    'sc_itemid',
    'sc_renderingId',
    'sc_uid',
    'sc_lang',
    'mode',
  ];
  const requiredQueryParams = isDesignLibraryMode(mode)
    ? componentRequiredParams
    : defaultRequiredParams;

  const missingQueryParams = requiredQueryParams.filter((param) => !searchParams.get(param));

  // Validate query parameters
  if (missingQueryParams.length) {
    return new Response(
      `<html><body>Missing required query parameters: ${missingQueryParams.join(', ')}</body></html>`,
      { status: 400 }
    );
  }

  const route = searchParams.get('route') || '/';
  let redirectParams: URLSearchParams;

  if (isDesignLibraryMode(mode)) {
    redirectParams = new URLSearchParams({
      itemId: searchParams.get('sc_itemid') || '',
      componentUid: searchParams.get('sc_uid') || '',
      renderingId: searchParams.get('sc_renderingId') || '',
      language: searchParams.get('sc_lang') || '',
      site: searchParams.get('sc_site') || '',
      mode,
      dataSourceId: searchParams.get('dataSourceId') || '',
      version: searchParams.get('sc_version') || '',
    });
  } else {
    redirectParams = new URLSearchParams({
      site: searchParams.get('sc_site') || '',
      itemId: searchParams.get('sc_itemid') || '',
      language: searchParams.get('sc_lang') || '',
      // for sc_variantId we may employ multiple variants (page-layout + component level)
      variantIds: searchParams.getAll('sc_variant').join(',') || '_default',
      version: searchParams.get('sc_version') || '',
      mode: searchParams.get('mode') || '',
      layoutKind: searchParams.get('sc_layoutKind') || '',
    });
  }

  const redirectUrl = `${route}?${redirectParams.toString()}`;

  // Redirect to the path from the fetched post
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(redirectUrl);
}
