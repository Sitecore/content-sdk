import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
<% if (prerender === 'SSG') { -%>
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
<% } -%>
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import Bootstrap from 'src/Bootstrap';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from 'src/i18n/routing';

type PageProps = {
  params: Promise<{ site?: string; locale?: string; path?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  setRequestLocale(`${site}_${locale}`);

  // Set preview to false until preview mode is integrated
  const preview = { enabled: false, data: {} };

  // Fetch the page data from Sitecore
  let page;
  if (preview.enabled) {
    if (isDesignLibraryPreviewData(preview.data)) {
      page = await client.getDesignLibraryData(preview.data);
    } else {
      page = await client.getPreview(preview.data);
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

<% if (prerender === 'SSG') { -%>
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  return await client.getAppRouterStaticParams(
    sites.map((site: SiteInfo) => site.name),
    routing.locales.map((locale) => locale)
  );
};
<% } -%>
// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps) => {
  const { path } = await params;
  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { locale: 'en' });
  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
