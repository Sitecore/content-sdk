import { GetServerSideProps } from 'next';
import Head from 'next/head';
import {
  ComponentLibraryLayout,
  ComponentPropsContext,
  SitecoreContext,
  SitecorePageProps,
} from '@sitecore-content-sdk/nextjs';
import NotFound from 'src/NotFound';
import { componentBuilder } from 'temp/componentBuilder';
import scConfig from 'sitecore.config';
import client from 'lib/sitecore-client';
import SitecoreStyles from 'src/components/SitecoreStyles';

const ComponentLibrary = ({ notFound, componentProps, layout }: SitecorePageProps): JSX.Element => {
  if (notFound) {
    return <NotFound />;
  }
  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreContext
        api={scConfig.api}
        componentFactory={componentBuilder.getComponentFactory()}
        layoutData={layout}
      >
        <Head>
          <title>Sitecore Component Library</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SitecoreStyles layoutData={layout} />
        <ComponentLibraryLayout {...layout} />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  if (context.preview) {
    const page = await client.getPreview(context.previewData);
    return {
      props: page || {},
      notFound: !page,
    };
  } else {
    return {
      // not found when page not requested through editing render api or notFound set in page-props
      notFound: true,
    };
  }
};

export default ComponentLibrary;
