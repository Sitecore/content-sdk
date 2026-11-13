'use client';
import { JSX } from 'react';
import { Page } from '@sitecore-content-sdk/nextjs';
import SitecoreHead from 'src/SitecoreHead';
import LayoutPlaceholders from 'src/LayoutPlaceholders';
import componentMap from '.sitecore/component-map.client';

interface LayoutClientProps {
  page: Page;
}

/**
 * Client-only counterpart of `src/Layout.tsx`.
 *
 * It renders the page using only the client component map (`.sitecore/component-map.client`),
 * so it can be safely imported from Client Components (e.g. `global-error.tsx`) without pulling
 * the server component map - and everything reachable from it - into the client module graph.
 *
 * Only components registered in the client component map are rendered. Server components
 * placed in the page layout are not available in this context.
 */
const LayoutClient = ({ page }: LayoutClientProps): JSX.Element => {
  const mainClassPageEditing = page.mode.isEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <SitecoreHead page={page} />
      <div className={mainClassPageEditing}>
        <LayoutPlaceholders page={page} componentMap={componentMap} />
      </div>
    </>
  );
};

export default LayoutClient;
