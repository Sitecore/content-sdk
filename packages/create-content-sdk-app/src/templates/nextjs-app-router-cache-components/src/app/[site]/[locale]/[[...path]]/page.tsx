import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
<% if (prerender === 'SSG') { -%>
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
<% } -%>
import client from 'src/lib/sitecore-client';
import { getSitecorePage } from 'src/lib/cache/get-sitecore-page';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;

  // Cached fetch first so missing routes can notFound() without dynamic APIs in the ancestor tree.
  const cachedPage = await getSitecorePage({ site, locale, path: path ?? [] });

  if (!cachedPage) {
    notFound();
  }

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();

  // Fetch the page data from Sitecore
  let page;
  try {
    if (draft.isEnabled) {
      const editingParams = await searchParams;
      if (isDesignLibraryPreviewData(editingParams)) {
        page = await client.getDesignLibraryData(editingParams);
      } else {
        page = await client.getPreview(editingParams);
      }
    } else {
      page = cachedPage;
    }
  } catch {
    page = null;
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <Providers page={page}>
        <Layout page={page} />
      </Providers>
    </NextIntlClientProvider>
  );
}

<% if (prerender === 'SSG') { -%>
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    try {
      return await client.getAppRouterStaticParams(
        sites.map((site: SiteInfo) => site.name),
        routing.locales.slice()
      );
    } catch {
      // Edge may be unavailable at build time (e.g. fresh environment).
    }
  }
  return [];
};
<% } -%>
// Metadata fields for the page. Mirrors the Page draft-mode branching so the <title> matches the body.
export const generateMetadata = async ({ params, searchParams }: PageProps) => {
  const { path, site, locale } = await params;

  const draft = await draftMode();

  let page;
  try {
    if (draft.isEnabled) {
      const editingParams = await searchParams;
      if (isDesignLibraryPreviewData(editingParams)) {
        page = await client.getDesignLibraryData(editingParams);
      } else {
        page = await client.getPreview(editingParams);
      }
    } else {
      page = await getSitecorePage({ site, locale, path: path ?? [] });
    }
  } catch {
    page = null;
  }

  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
