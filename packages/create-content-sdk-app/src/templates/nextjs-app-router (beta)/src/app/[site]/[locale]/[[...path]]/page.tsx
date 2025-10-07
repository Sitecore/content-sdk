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
import Layout from 'src/Layout';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import Bootstrap from 'src/Bootstrap';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{
    site: string;
    locale: string;
    path?: string[];
    [key: string]: string | string[] | undefined;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { site, locale, path } = await params;
  const draft = await draftMode();

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  // Fetch the component data from Sitecore (Likely will be deprecated)
  const componentProps = await client.getComponentData(page.layout, {}, components);

  return (
    <>
      <Bootstrap page={page} />
      <NextIntlClientProvider>
        <Providers page={page} componentProps={componentProps}>
          <Layout page={page} />
        </Providers>
      </NextIntlClientProvider>
    </>
  );
}

<% if (prerender === 'SSR') { -%>
export const dynamic = 'force-dynamic';
<% } -%>
// Metadata fields for the page.
export const generateMetadata = async () => ({
  title: 'Page',
});

<% if (prerender === 'SSG') { -%>
// Generate static params only when explicitly enabled and sites/locales exist
export const generateStaticParams = async () => {
  if (!scConfig?.generateStaticPaths) {
    return [];
  }
  const siteNames = Array.isArray(sites) ? sites.map((s: SiteInfo) => s.name).filter(Boolean) : [];
  const locales = Array.isArray(routing.locales) ? routing.locales.slice() : [];
  if (!siteNames.length || !locales.length) {
    return [];
  }
  return await client.getAppRouterStaticParams(siteNames, locales);
};
<% } -%>
