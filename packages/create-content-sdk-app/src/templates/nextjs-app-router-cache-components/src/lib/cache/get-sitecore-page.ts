import {
  collectSitecorePageCacheTags,
  DEFAULT_VARIANT,
  getPersonalizedRewriteData,
  Page,
  readPersonalizeTokens,
} from '@sitecore-content-sdk/nextjs';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { cacheTag } from 'next/cache';
import { draftMode, headers } from 'next/headers';
import { cache } from 'react';
import client from 'src/lib/sitecore-client';

type GetSitecorePageParams = {
  site: string;
  locale: string;
  path: string[];
};

type LoadSitecoreRoutePageParams = GetSitecorePageParams & {
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function getRawSitecorePage(params: GetSitecorePageParams): Promise<Page | null> {
  'use cache';

  const { site, locale, path } = params;
  const page = await client.getPage(path, { site, locale, deferFinalization: true });

  const tags = collectSitecorePageCacheTags({
    site,
    locale,
    path: client.parsePath(path),
    route: page?.layout?.sitecore?.route,
  });

  for (const tag of tags) {
    cacheTag(tag);
  }

  return page;
}

/**
 * Request-scoped finalize shared by `page.tsx` and `generateMetadata`.
 * Visitor tokens stay outside `'use cache'` so the persistent cache is not
 * keyed on them.
 *
 * Arguments are primitives on purpose: React `cache()` compares object
 * arguments by identity, so an object parameter would miss on every call and
 * finalize the page once per call site.
 */
const getFinalizedSitecorePage = cache(
  async (site: string, locale: string, pathKey: string): Promise<Page | null> => {
    const path = pathKey ? pathKey.split('/') : [];
    const rawPage = await getRawSitecorePage({ site, locale, path });
    if (!rawPage) {
      return null;
    }

    const rewrite = getPersonalizedRewriteData(`/${pathKey}`);
    const tokens =
      rewrite.variantId !== DEFAULT_VARIANT || (rewrite.componentVariantIds?.length ?? 0) > 0
        ? readPersonalizeTokens(await headers()) ?? {}
        : {};

    return client.finalizePersonalizedPage(rawPage, tokens);
  }
);

/**
 * Request-scoped draft fetch. Keyed on a stable serialization of the editing
 * params so the body and `<title>` share a single Edge request.
 */
const getDraftSitecorePage = cache(async (searchParamsKey: string): Promise<Page | null> => {
  const editingParams = JSON.parse(searchParamsKey) as {
    [key: string]: string | string[] | undefined;
  };
  if (isDesignLibraryPreviewData(editingParams)) {
    return client.getDesignLibraryData(editingParams);
  }
  return client.getPreview(editingParams);
});

function stableSearchParamsKey(searchParams: LoadSitecoreRoutePageParams['searchParams']): string {
  const source = searchParams ?? {};
  const sorted: { [key: string]: string | string[] | undefined } = {};
  for (const key of Object.keys(source).sort()) {
    sorted[key] = source[key];
  }
  return JSON.stringify(sorted);
}

/**
 * Gets page data using Next.js Cache Components and deterministic Sitecore cache tags.
 * The shared `'use cache'` store holds the personalized, pre-token page.
 * Finalize is request-local via React `cache()`.
 */
export async function getSitecorePage(params: GetSitecorePageParams): Promise<Page | null> {
  return getFinalizedSitecorePage(params.site, params.locale, (params.path ?? []).join('/'));
}

/**
 * Draft-aware wrapper so the page body and `<title>` share one request result.
 */
export async function loadSitecoreRoutePage(
  params: LoadSitecoreRoutePageParams
): Promise<Page | null> {
  const draft = await draftMode();
  if (draft.isEnabled) {
    return getDraftSitecorePage(stableSearchParamsKey(params.searchParams));
  }
  return getFinalizedSitecorePage(params.site, params.locale, (params.path ?? []).join('/'));
}
