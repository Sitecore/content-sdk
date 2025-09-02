import {
  EditingRenderQueryParams,
  isDesignLibraryMode,
  PREVIEW_KEY,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/core/editing';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/core/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/core/site';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';

export const getEditingSecret = (req: NextApiRequest | NextRequest) => {
  const reqQuery = (req as NextApiRequest).query;
  const reqUrl = (req as NextRequest).url;

  let secret = undefined;

  if (reqQuery) {
    // pages router
    secret = reqQuery[QUERY_PARAM_EDITING_SECRET];
  } else if (reqUrl) {
    // app router
    const url = new URL(reqUrl);
    secret = url.searchParams.get(QUERY_PARAM_EDITING_SECRET);
  }

  return secret;
};

export const getEditingParams = (query: { [key: string]: string | undefined }) => {
  const params = isDesignLibraryMode(query.mode)
    ? {
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode: query.mode,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
      }
    : {
        site: query.sc_site,
        itemId: query.sc_itemid,
        language: query.sc_lang,
        // for sc_variantId we may employ multiple variants (page-layout + component level)
        variantIds: query.sc_variant?.split(',') || [DEFAULT_VARIANT],
        version: query.sc_version,
        mode: query.mode,
        layoutKind: query.sc_layoutKind,
      };
  return params;
};

export const getFilteredCookies = (cookies: string | string[] | null) => {
  if (!cookies) {
    return null;
  }
  if (!Array.isArray(cookies)) {
    cookies = cookies.split(',');
  }
  // Filter out Next.js preview cookies
  const filteredCookies = cookies.filter(
    (cookie: string) =>
      !/^__next_preview_data=/.test(cookie) && !/^__prerender_bypass=/.test(cookie)
  );
  return filteredCookies;
};

export const getPreviewCookies = (site: string) => {
  const previewSite = `${SITE_KEY}=${site}; Path=/; HttpOnly; SameSite=None; Secure`;
  const previewCookie = `${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`;
  return [previewSite, previewCookie];
};

export const getRequiredQueryParams = (mode: EditingRenderQueryParams['mode']) => {
  const editingRequiredParams = ['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode'];

  const componentRequiredParams = [
    'sc_site',
    'sc_itemid',
    'sc_renderingId',
    'sc_uid',
    'sc_lang',
    'mode',
  ];
  return isDesignLibraryMode(mode) ? componentRequiredParams : editingRequiredParams;
};
