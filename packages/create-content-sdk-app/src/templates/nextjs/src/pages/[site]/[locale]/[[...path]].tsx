import { useEffect, JSX } from 'react';
<% if (prerender === 'SSG') { -%>
import { GetStaticPaths, GetStaticProps } from 'next';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import { SiteInfo } from '@sitecore-content-sdk/nextjs';
import { routing } from 'src/i18n/routing';
<% } else if (prerender === 'SSR') { -%>
import { GetServerSideProps } from 'next';
<% } -%>
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import { handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import components from '.sitecore/component-map';
import client from 'lib/sitecore-client';
import Providers from 'src/Providers';

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  return (
    <Providers componentProps={componentProps} page={page}>
      <Layout page={page} />
    </Providers>
  );
};

<% if (prerender === 'SSG') { -%>
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
// The route carries explicit `[site]/[locale]` segments (matching the App Router),
// so static paths are generated per site + locale + path.
export const getStaticPaths: GetStaticPaths = async () => {
  // Fallback, along with revalidate in getStaticProps (below),
  // enables Incremental Static Regeneration. This allows us to
  // leave certain (or all) paths empty if desired and static pages
  // will be generated on request (development mode in this example).
  // See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration

  let paths: Array<{ params: { site: string; locale: string; path: string[] } }> = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && scConfig.generateStaticPaths) {
    try {
      // Same params source as the App Router (`generateStaticParams`), producing
      // normalized { site, locale, path } tuples for every localized route.
      const params = await client.getAppRouterStaticParams(
        sites.map((site: SiteInfo) => site.name),
        routing.locales.slice()
      );

      paths = params.map(({ site, locale, path }) => ({
        params: { site, locale, path: path ?? [] },
      }));
    } catch (error) {
      console.log('Error occurred while fetching static paths');
      console.log(error);
    }

    fallback = process.env.EXPORT_MODE ? false : fallback;
  }

  return {
    paths,
    fallback,
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation (or fallback) is enabled and a new request comes in.
export const getStaticProps: GetStaticProps = async (context) => {
<% } else if (prerender === 'SSR') { -%>
// This function gets called at request time on server-side.
export const getServerSideProps: GetServerSideProps = async (context) => {
<% } -%>
  let props = {};
  // Site and locale come from the route segments (not Next.js built-in i18n).
  const { site, locale, path } = (context.params ?? {}) as {
    site: string;
    locale: string;
    path?: string[];
  };
  let page;

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path ?? [], { site, locale });
  }
  if (page) {
    props = {
      page,
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
    }
  }
  return {
    props,
<% if (prerender === 'SSG') { -%>
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5, // In seconds
<% } -%>
    notFound: !page,
  };
};

export default SitecorePage;
