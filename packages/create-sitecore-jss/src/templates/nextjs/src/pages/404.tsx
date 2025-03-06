import config from 'sitecore.config';
import { SitecoreContext, ErrorPages } from '@sitecore-content-sdk/nextjs';
import NotFound from 'src/NotFound';
import { componentBuilder } from 'temp/componentBuilder';
import Layout from 'src/Layout';
import { GetStaticProps } from 'next';
import client from 'lib/sitecore-client';
import { NextjsPage } from '@sitecore-content-sdk/nextjs/client';

const Custom404 = (props: NextjsPage): JSX.Element => {
  if (!(props && props.layout)) {
    return <NotFound />;
  }

  return (
    <SitecoreContext
      componentFactory={componentBuilder.getComponentFactory()}
      layoutData={props.layout}
    >
      <Layout layoutData={props.layout} headLinks={props.headLinks} />
    </SitecoreContext>
  );
};

export const getStaticProps: GetStaticProps = async context => {
  let resultErrorPages: ErrorPages | null = null;

  if (process.env.DISABLE_SSG_FETCH?.toLowerCase() !== 'true') {
    try {
      resultErrorPages = await client.getErrorPages(
        config.defaultSite,
        context.locale || context.defaultLocale || config.defaultLanguage
      );
    } catch (error) {
      console.log('Error occurred while fetching error pages');
      console.log(error);
    }
  }

  return {
    props: {
      headLinks: [],
      layoutData: resultErrorPages?.serverErrorPage?.rendered || null,
    },
  };
};

export default Custom404;
