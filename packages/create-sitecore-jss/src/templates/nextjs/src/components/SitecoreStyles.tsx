import { useSitecoreContext } from '@sitecore-jss/next/site';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import client from 'lib/sitecore-client';
import { HeadLink } from '@sitecore-jss/core';

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
const SitecoreStyles = ({ layoutData, enableStyles = true }) => {
  const [headLinks, setHeadLinks] = useState<HeadLink[]>([]);

  useEffect(() => {
    if (layoutData) {
      const links = client.getHeadLinks(layoutData);
      setHeadLinks(links);
    }
  }, [layoutData]);

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
