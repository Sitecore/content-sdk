import { JSX } from 'react';
import { Page, JsonLdSchema } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';

interface SitecoreHeadProps {
  page: Page;
}

/**
 * Groups the scripts, styles, and structured data injected alongside the page layout.
 */
const SitecoreHead = ({ page }: SitecoreHeadProps): JSX.Element => {
  const { layout } = page;

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <JsonLdSchema page={page} />
    </>
  );
};

export default SitecoreHead;

