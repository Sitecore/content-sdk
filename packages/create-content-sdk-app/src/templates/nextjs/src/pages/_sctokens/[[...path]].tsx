import { GetServerSideProps } from 'next';
import { getPersonalizeTokens } from '@sitecore-content-sdk/nextjs';
import { extractPath } from '@sitecore-content-sdk/nextjs/utils';
import components from '.sitecore/component-map';
import client from 'lib/sitecore-client';

// PersonalizeProxy rewrites requests that carry dynamic content tokens (visitor values from
// Personalize) to this route, so they render per request. Every other request is served by ../[[...path]].tsx.
export { default } from '../[[...path]]';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = await client.getPage(extractPath(context), {
    locale: context.locale,
    tokens: getPersonalizeTokens(context.req.headers),
  });
  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      page,
      dictionary: await client.getDictionary({ site: page.siteName, locale: page.locale }),
      componentProps: await client.getComponentData(page.layout, context, components),
    },
  };
};
