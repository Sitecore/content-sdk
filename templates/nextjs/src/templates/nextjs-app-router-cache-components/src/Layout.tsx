import { JSX } from 'react';
import {
  AppPlaceholder,
  DesignLibraryApp,
  Field,
  PageMetadataFields,
  Page,
} from '@sitecore-content-sdk/nextjs';
import SitecoreHead from 'src/SitecoreHead';
import componentMap from '.sitecore/component-map';

interface LayoutProps {
  page: Page;
}

export interface RouteFields extends PageMetadataFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  return (
    <>
      <SitecoreHead page={page} />
      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          route && (
            <DesignLibraryApp
              page={page}
              rendering={route}
              componentMap={componentMap}
              loadServerImportMap={() => import('.sitecore/import-map.server')}
            />
          )
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
