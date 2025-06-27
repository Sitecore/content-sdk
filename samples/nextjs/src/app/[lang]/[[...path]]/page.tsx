import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';
import { notFound } from 'next/navigation';
import Layout from 'src/Layout';
import components from '.sitecore/component-map';
import scConfig from 'sitecore.config';
import { getPreviewData } from 'lib/previewUtils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';

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

  return (
    <SitecoreProvider componentMap={components} layoutData={page.layout} api={scConfig.api}>
      <Layout layoutData={page.layout} componentMap={components} />
    </SitecoreProvider>
  );
}
