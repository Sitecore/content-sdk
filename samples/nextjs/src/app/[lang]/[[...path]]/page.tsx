import client from 'lib/sitecore-client';
import { notFound } from 'next/navigation';
import Layout, { RouteFields } from 'src/Layout';
import components from '.sitecore/component-map';
import { getPreviewData } from 'lib/previewUtils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import Providers from 'lib/Providers';
import CdpPageView from 'components/CdpPageView';
import BYOC from 'src/byoc';

type PageProps = {
  params: Promise<{ path?: string[]; lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { path, lang } = await params;

  const preview = await getPreviewData(searchParams);

  let page;
  if (preview.enabled) {
    if (isDesignLibraryPreviewData(preview.data)) {
      page = await client.getDesignLibraryData(preview.data);
    } else {
      page = await client.getPreview(preview.data);
    }
  } else {
    // If not in preview mode, fetch the page normally
    page = await client.getPage(path ?? [], { locale: lang });
  }

  if (!page) {
    notFound();
  }

  const dictionary = await client.getDictionary({ site: page.site?.name, locale: page.locale });
  console.log('Dictionary:', dictionary);
  const pageContext = {
    route: page.layout.sitecore.route ?? undefined,
    itemId: page.layout.sitecore.route?.itemId,
    ...page.layout.sitecore.context,
  };

  return (
    <Providers layoutData={page.layout}>
      <BYOC />
      <CdpPageView />
      <Layout layoutData={page.layout} componentMap={components} pageContext={pageContext} />
    </Providers>
  );
}

export const generateStaticParams = async () => {
  const paths = await client.getPagePaths(['en']);
  return paths.map((path) => ({
    path: path.params.path,
    lang: path.locale,
  }));
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { path, lang } = await params;
  const page = await client.getPage(path ?? [], { locale: lang });
  return {
    title: (page?.layout.sitecore.route?.fields as RouteFields)?.Title?.value?.toString() || 'Page',
  };
};
