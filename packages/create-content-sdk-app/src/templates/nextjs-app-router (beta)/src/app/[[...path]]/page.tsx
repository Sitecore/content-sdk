import { isDesignLibraryPreviewData, isCSDKPreview } from '@sitecore-content-sdk/nextjs/editing';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
<% if (prerender === 'SSG') { -%>
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import sites from '.sitecore/sites.json';
<% } -%>
import client from 'src/lib/sitecore-client';
import Layout, { RouteFields } from 'src/Layout';
import components from '.sitecore/component-map';
import Providers from 'src/Providers';
import Bootstrap from 'src/Bootstrap';

type PageProps = {
  params: Promise<{ path?: string[]; [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { path } = await params;

  // Set preview to false until preview mode is integrated
  // const preview = { enabled: false, data: {} };

  // Fetch the page data from Sitecore
  let page;
if (isCSDKPreview(await headers())) {
    const editingParams = await searchParams;
    if (isDesignLibraryPreviewData(editingParams)) {
      page = await client.getDesignLibraryData(editingParams);
    } else {
      page = await client.getPreview(editingParams);
    }
  } else {
    page = await client.getPage(path ?? [], { locale: 'en' });
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
      <Providers page={page} componentProps={componentProps}>
        <Layout page={page} />
      </Providers>
    </>
  );
}

<% if (prerender === 'SSG') { -%>
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const generateStaticParams = async () => {
  const paths = await client.getPagePaths(
    sites.map((site: SiteInfo) => site.name),
    ['en']
  );
  return paths.map((path) => ({
    path: path.params.path,
    lang: path.locale,
  }));
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
