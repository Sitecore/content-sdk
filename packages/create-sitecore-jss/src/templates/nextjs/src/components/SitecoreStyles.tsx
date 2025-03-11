import Head from 'next/head';
import client from 'lib/sitecore-client';
import { LayoutServiceData, HTMLLink } from '@sitecore-content-sdk/nextjs';

/**
 * SitecoreStyles component
 *
 * Responsible for rendering Sitecore stylesheet and other head links dynamically
 * based on the current page context.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.layoutData - The Sitecore layout data for the current page.
 * @param {boolean} [props.enableStyles=true] - Flag to enable or disable component themes.
 * @returns {JSX.Element | null} The rendered `<Head>` element with styles, or `null` if no styles should be applied.
 */
const SitecoreStyles = ({
  layoutData,
  enableStyles = true,
}: {
  layoutData: LayoutServiceData;
  enableStyles?: boolean;
}) => {
  const headLinks = client.getHeadLinks(layoutData);

  if (!headLinks || headLinks.length === 0 || !enableStyles) {
    return null;
  }

  return (
    <Head>
      {headLinks.map(headLink => (
        <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
      ))}
    </Head>
  );
};

export default SitecoreStyles;
