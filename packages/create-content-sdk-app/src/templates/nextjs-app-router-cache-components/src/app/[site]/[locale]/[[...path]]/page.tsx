import { setCachedPageParams, getPageMetadata } from '@sitecore-content-sdk/nextjs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
<% if (prerender === 'SSG') { -%>
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
import client from 'src/lib/sitecore-client';
<% } -%>
import { loadSitecoreRoutePage } from 'src/lib/cache/get-sitecore-page';
import { BUILD_VALIDATION_SITE, isBuildValidationSite } from 'src/lib/sitecore-build-validation';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;

  if (isBuildValidationSite(site)) {
    setCachedPageParams({ site, locale });
    notFound();
  }

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Draft/preview first so editing is not blocked by locale-dependent cached lookups.
  // Editing often resolves language via query string, while [locale] may fall back to defaultLanguage.
  const page = await loadSitecoreRoutePage({
    site,
    locale,
    path: path ?? [],
    searchParams: await searchParams,
  });

  // If the page is not found, return a 404
  if (!page) {
    setCachedPageParams({ site, locale });
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
    return await client.getAppRouterStaticParams(
      sites.map((site: SiteInfo) => site.name),
      routing.locales.slice()
    );
  }
  return [
    {
      site: BUILD_VALIDATION_SITE,
      locale: routing.defaultLocale || scConfig.defaultLanguage,
      path: [],
    },
  ];
};
<% } -%>
// Metadata fields for the page. Shares loadSitecoreRoutePage with the body so <title> matches.
export const generateMetadata = async ({ params, searchParams }: PageProps): Promise<Metadata> => {
  const { path, site, locale } = await params;

  if (isBuildValidationSite(site)) {
    return { title: 'Page' };
  }

  const page = await loadSitecoreRoutePage({
    site,
    locale,
    path: path ?? [],
    searchParams: await searchParams,
  });

  return getPageMetadata(page?.layout.sitecore.route);
};
