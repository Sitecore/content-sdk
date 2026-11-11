'use client';
import { JSX } from 'react';
import { AppPlaceholder, Page } from '@sitecore-content-sdk/nextjs';
import SitecoreHead from 'src/SitecoreHead';
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
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

  return (
    <>
      <SitecoreHead page={page} />
      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        <header>
          <div id="header">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-header"
                rendering={route}
              />
            )}
          </div>
        </header>
        <main>
          <div id="content">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-main"
                rendering={route}
              />
            )}
          </div>
        </main>
        <footer>
          <div id="footer">
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-footer"
                rendering={route}
              />
            )}
          </div>
        </footer>
      </div>
    </>
  );
};

export default LayoutClient;
