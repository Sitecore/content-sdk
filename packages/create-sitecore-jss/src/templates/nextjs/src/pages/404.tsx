import config from 'sitecore.config';
import { SitecoreContext, ErrorPages, SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { GetStaticProps } from 'next';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';
import components from 'lib/component-map';
import { JSX } from 'react';

const Custom404 = (props: SitecorePageProps): JSX.Element => {
  if (!(props && props.layout)) {
    return <NotFound />;
  }

  return (
    <SitecoreContext api={scConfig.api} componentMap={components} layoutData={props.layout}>
      <Layout layoutData={props.layout} />
    </SitecoreContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  let resultErrorPages: ErrorPages | null = null;

  if (!scConfig.disableStaticPaths) {
    try {
      resultErrorPages = await client.getErrorPages({
        site: config.defaultSite,
        locale: context.locale || context.defaultLocale || config.defaultLanguage,
      });
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  return {
    props: {
      layout: resultErrorPages?.notFoundPage?.rendered || null,
    },
  };
};

export default Custom404;
