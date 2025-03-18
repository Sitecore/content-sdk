import { useEffect } from 'react';
<% if (prerender === 'SSG') { -%>
import { GetStaticPaths, GetStaticProps } from 'next';
<% } else if (prerender === 'SSR') { -%>
import { GetServerSideProps } from 'next';
<% } -%>
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import {
  SitecoreContext,
  ComponentPropsContext,
  SitecorePageProps,
  <% if (prerender === 'SSG') { -%>
  StaticPath
  <% } -%>
} from '@sitecore-content-sdk/nextjs';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import client from 'lib/sitecore-client';
import { componentBuilder } from 'temp/componentBuilder';
import scConfig from 'sitecore.config';
<% if (prerender === 'SSG') { -%>


const SitecorePage = ({ notFound, componentProps, layout }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !layout.sitecore.route) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  const isEditing = layout.sitecore.context.pageEditing;

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({ isEditing })}
        layoutData={layout}
        api={scConfig.api}
      >
        <Layout layoutData={layout} />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

<% if (prerender === 'SSG') { -%>
// This function gets called at build and export time to determine
// pages for SSG ("paths", as tokenized array).
export const getStaticPaths: GetStaticPaths = async (context) => {
  // Fallback, along with revalidate in getStaticProps (below),
  // enables Incremental Static Regeneration. This allows us to
  // leave certain (or all) paths empty if desired and static pages
  // will be generated on request (development mode in this example).
  // Alternatively, the entire sitemap could be pre-rendered
  // ahead of time (non-development mode in this example).
  // See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration

  let paths: StaticPath[] = [];
  let fallback: boolean | 'blocking' = 'blocking';

  if (process.env.NODE_ENV !== 'development' && process.env.DISABLE_SSG_FETCH?.toLowerCase() !== 'true') {
    try {
      paths = await client.getPagePaths(context?.locales || []);
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
const path = extractPath(context);
  const page = context.preview
    ? await client.getPreview(context.previewData)
    : await client.getPage(path, { locale: context.locale });
  if (page) {
    props = {
      ...page,
      dictionary: await client.getDictionary({ site: page.site?.name, locale: page.locale }),
      componentProps: await client.getComponentData(
        page.layout,
        context,
        componentBuilder.getModuleFactory()
      ),
    }
  }
  return {
    props,
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
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
