import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { Metadata } from 'next';
<% if (prerender === 'SSG') { -%>
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
import { routing } from 'src/i18n/routing';
import scConfig from 'sitecore.config';
<% } -%>
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import Providers from 'src/Providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type PageProps = {
  params: Promise<{ site: string; locale: string; path?: string[]; [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params }: PageProps) {
  const { site, locale, path } = await params;

  // Set site and locale to be available in src/i18n/request.ts for fetching the dictionary
  setRequestLocale(`${site}_${locale}`);

  const draft = await draftMode();

  // Fetch the page data from Sitecore
  let page;
  if (draft.isEnabled) {
    const headers = await nextHeaders();
    const previewData = client.getPreviewData(headers);

    if (isDesignLibraryPreviewData(previewData)) {
      page = await client.getDesignLibraryData(previewData);
    } else {
      page = await client.getPreview(previewData);
    }
  } else {
    page = await client.getPage(path ?? [], { site, locale });
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
    return await client.getAppRouterStaticParams(
      sites.map((site: SiteInfo) => site.name),
      routing.locales.slice()
    );
  }
  return [];
};
<% } -%>
// Open Graph types that define a creation-time field, and which Metadata.openGraph key it maps to
const OG_CREATION_TIME_FIELD: Record<string, 'publishedTime' | 'releaseDate'> = {
  article: 'publishedTime',
  book: 'releaseDate',
  'music.album': 'releaseDate',
  'video.movie': 'releaseDate',
  'video.episode': 'releaseDate',
};

// Metadata fields for the page.
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { path, site, locale } = await params;

  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { site, locale });
  const fields = page?.layout.sitecore.route?.fields as RouteFields;

  const title = fields?.Title?.value?.toString() || 'Page';
  const metaTitle = fields?.baseMetadataTitle?.value;
  const description = fields?.baseMetadataDescription?.value;
  const keywords = fields?.baseMetadataKeywords?.value;
  const author = fields?.baseMetadataAuthor?.value;
  const ogTitle = fields?.baseOgTitle?.value;
  const ogDescription = fields?.baseOgDescription?.value;
  const ogImage = fields?.baseOgImage?.value;
  const ogType = fields?.baseOgType?.value;
  const creationTimeField = ogType ? OG_CREATION_TIME_FIELD[ogType] : undefined;
  const creationTime = creationTimeField ? page?.layout.sitecore.route?.published : undefined;
  // article is the only Open Graph type with a distinct update-time field
  const modifiedTime = ogType === 'article' ? page?.layout.sitecore.route?.updated : undefined;

  return {
    title,
    ...(metaTitle && { other: { title: metaTitle } }),
    ...(description && { description }),
    ...(keywords && { keywords }),
    ...(author && { authors: [{ name: author }] }),
    ...((ogTitle || ogDescription || ogImage?.src || ogType) && {
      openGraph: {
        ...(ogTitle && { title: ogTitle }),
        ...(ogDescription && { description: ogDescription }),
        ...(ogImage?.src && {
          images: [
            {
              url: ogImage.src,
              ...(ogImage.width && { width: ogImage.width }),
              ...(ogImage.height && { height: ogImage.height }),
              ...(ogImage.alt && { alt: ogImage.alt }),
            },
          ],
        }),
        ...(ogType && { type: ogType }),
        ...(creationTimeField && creationTime && { [creationTimeField]: creationTime }),
        ...(modifiedTime && { modifiedTime }),
      } as Metadata['openGraph'],
    }),
  };
};
