import { JSX } from 'react';
import { AppPlaceholder, ComponentMap, Page } from '@sitecore-content-sdk/nextjs';

interface LayoutPlaceholdersProps {
  page: Page;
  /** Server map from `src/Layout.tsx`, client map from `src/Layout.client.tsx`. */
  componentMap: ComponentMap;
}

/**
 * Shared header, main, and footer placeholders.
 *
 * The component map is passed in so this module does not import `.sitecore/component-map`
 * or `.sitecore/component-map.client`. Both layouts can render the same markup.
 */
const LayoutPlaceholders = ({
  page,
  componentMap,
}: LayoutPlaceholdersProps): JSX.Element | null => {
  const { route } = page.layout.sitecore;

  if (!route) {
    return null;
  }

  return (
    <>
      {/* root placeholder for the app, which we add components to using route data */}
      <header>
        <div id="header">
          <AppPlaceholder
            page={page}
            componentMap={componentMap}
            name="headless-header"
            rendering={route}
          />
        </div>
      </header>
      <main>
        <div id="content">
          <AppPlaceholder
            page={page}
            componentMap={componentMap}
            name="headless-main"
            rendering={route}
          />
        </div>
      </main>
      <footer>
        <div id="footer">
          <AppPlaceholder
            page={page}
            componentMap={componentMap}
            name="headless-footer"
            rendering={route}
          />
        </div>
      </footer>
    </>
  );
};

export default LayoutPlaceholders;
