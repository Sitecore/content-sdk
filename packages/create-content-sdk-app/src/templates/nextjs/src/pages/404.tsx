import { JSX } from 'react';
import { GetStaticProps } from 'next';
import { SitecorePageProps, ErrorPage } from '@sitecore-content-sdk/nextjs';
import client from 'lib/sitecore-client';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import Providers from 'src/Providers';
import scConfig from 'sitecore.config';
import components from '.sitecore/component-map';

const Custom404 = (props: SitecorePageProps): JSX.Element => {
  if (!(props && props.page)) {
    return <NotFound />;
  }

  return (
    <Providers componentProps={props.componentProps} page={props.page}>
      <Layout page={props.page} />
    </Providers>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const props: SitecorePageProps = {
    page: null,
  };

  if (scConfig.generateStaticPaths) {
    try {
      props.page = await client.getErrorPage(ErrorPage.NotFound, {
        site: scConfig.defaultSite,
        locale: context.locale || context.defaultLocale || scConfig.defaultLanguage,
      });
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  if (props.page) {
    props.componentProps = await client.getComponentData(props.page.layout, context, components);
  }

  return {
    props,
  };
};

export default Custom404;
