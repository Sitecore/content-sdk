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
import client from 'lib/sitecore-client';

const ComponentLibrary = ({
  notFound,
  componentProps,
  layout,
  headLinks,
}: SitecorePageProps): JSX.Element => {
  if (notFound) {
    return <NotFound />;
  }
  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory()}
        layoutData={layout}
      >
        <Head>
          <title>Sitecore Component Library</title>
          <link rel="icon" href="/favicon.ico" />
          {headLinks.map((headLink) => (
            <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
          ))}
        </Head>
        <ComponentLibraryLayout {...layout} />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
