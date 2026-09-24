import { cache } from 'react';
import { draftMode, headers } from 'next/headers';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import {
  DEFAULT_VARIANT,
  getPersonalizedRewriteData,
  readPersonalizeTokens,
} from '@sitecore-content-sdk/nextjs';
import client from 'src/lib/sitecore-client';

const hasPersonalizedRewrite = (path: string[]): boolean => {
  const data = getPersonalizedRewriteData(`/${path.join('/')}`);
  return data.variantId !== DEFAULT_VARIANT || (data.componentVariantIds?.length ?? 0) > 0;
};

/**
 * Request-scoped published-page fetch. Static paths pass `tokens: {}` without
 * reading headers. Personalized rewrite paths read the trusted token header.
 * Preview and Design Library must not call this helper.
 *
 * Memoized on a primitive path key: React `cache()` compares array and object
 * arguments by identity, so a `string[]` parameter would miss whenever a call
 * site builds a fresh array (for example `path ?? []` on the root route).
 */
const getRequestSitecorePageByKey = cache(
  async (pathKey: string, site: string, locale: string) => {
    const path = pathKey ? pathKey.split('/') : [];
    const tokens = hasPersonalizedRewrite(path)
      ? readPersonalizeTokens(await headers()) ?? {}
      : {};
    return client.getPage(path, { site, locale, tokens });
  }
);

/**
 * Request-scoped published-page fetch.
 * @param {string[]} path Route path segments
 * @param {string} site Site name
 * @param {string} locale Locale
 * @returns {Promise<import('@sitecore-content-sdk/nextjs').Page | null>} Published page
 */
export async function getRequestSitecorePage(path: string[], site: string, locale: string) {
  return getRequestSitecorePageByKey(path.join('/'), site, locale);
}

const getSitecorePageForRequestByKey = cache(
  async (pathKey: string, site: string, locale: string) => {
    const draft = await draftMode();
    if (draft.isEnabled) {
      const previewData = client.getPreviewData(await headers());
      if (isDesignLibraryPreviewData(previewData)) {
        return client.getDesignLibraryData(previewData);
      }
      return client.getPreview(previewData);
    }
    return getRequestSitecorePageByKey(pathKey, site, locale);
  }
);

/**
 * Request-scoped page used by `page.tsx` and `generateMetadata`.
 * Draft mode uses preview / Design Library (tokens omitted). Published renders
 * go through {@link getRequestSitecorePage}.
 * @param {string[]} path Route path segments
 * @param {string} site Site name
 * @param {string} locale Locale
 * @returns {Promise<import('@sitecore-content-sdk/nextjs').Page | null>} Page for this request
 */
export async function getSitecorePageForRequest(path: string[], site: string, locale: string) {
  return getSitecorePageForRequestByKey(path.join('/'), site, locale);
}
