import client from 'lib/sitecore-client';
import { notFound } from 'next/navigation';
import Layout, { RouteFields } from 'src/Layout';
import components from '.sitecore/component-map';
import { getPreviewData } from 'lib/previewUtils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import Providers from 'lib/Providers';

type PageProps = {
  params: Promise<{ path?: string[]; lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { path, lang } = await params;

  // Utility to detect if in preview mode and get the preview data if it exists
  const preview = await getPreviewData(searchParams);

  // Fetch the page data from Sitecore
  let page;
  if (preview.enabled) {
    if (isDesignLibraryPreviewData(preview.data)) {
      page = await client.getDesignLibraryData(preview.data);
    } else {
      page = await client.getPreview(preview.data);
    }
  } else {
    page = await client.getPage(path ?? [], { locale: lang }, { next: { revalidate: 20 } });
  }

  // If the page is not found, return a 404
  if (!page) {
    notFound();
  }

  // Fetch the component data from Sitecore (Likely will be deprecated)
  const componentProps = await client.getComponentData(page.layout, {}, components);

  // Create the page context
  const pageContext = {
    route: page.layout.sitecore.route ?? undefined,
    itemId: page.layout.sitecore.route?.itemId,
    ...page.layout.sitecore.context,
  };

  return (
    // Consolidate all providers into one
    <Providers layoutData={page.layout} componentProps={componentProps}>
      {/* Passing the layout and componentMap to the server layout component */}
      <Layout layoutData={page.layout} componentMap={components} pageContext={pageContext} />
    </Providers>
  );
}

// list of page parameters to generate static pages for
export const generateStaticParams = async () => {
  const paths = await client.getPagePaths(['en']);
  return paths.map((path) => ({
    path: path.params.path,
    lang: path.locale,
  }));
};

// Metadata fields for the page
export const generateMetadata = async ({ params }: PageProps) => {
  const { path, lang } = await params;
  // The same call as for rendering the page. Should be cached by default react behavior
  const page = await client.getPage(path ?? [], { locale: lang });
  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
