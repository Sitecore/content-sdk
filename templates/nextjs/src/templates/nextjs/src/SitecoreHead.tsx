import { JSX } from 'react';
import { Page, PageMetaTags, JsonLdSchema } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';

interface SitecoreHeadProps {
  page: Page;
}

/**
 * Groups the scripts, styles, meta tags, and structured data injected alongside the page layout.
 */
const SitecoreHead = ({ page }: SitecoreHeadProps): JSX.Element => {
  const { layout } = page;
  const { route } = layout.sitecore;

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <PageMetaTags route={route} />
      <JsonLdSchema page={page} />
    </>
  );
};

export default SitecoreHead;

