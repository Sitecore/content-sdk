import { Page, DesignLibraryServer } from '@sitecore-content-sdk/nextjs';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/nextjs/editing';
import { DesignLibraryClientLayout } from './DesignLibraryClientLayout';
import componentMap from '.sitecore/component-map';

type DesignLibraryLayoutProps = {
  /**
   * Page data.
   * This data is passed by the SitecoreProvider.
   */
  page: Page;
};

export const DesignLibraryLayout = ({ page }: DesignLibraryLayoutProps) => {
  const { route } = page.layout.sitecore;
  if (!route) return;

  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const component = componentMap.get(rendering?.componentName || '');
  const isClient = component && component.componentType === 'client';

  return (
    <>
      {isClient ? (
        <DesignLibraryClientLayout />
      ) : (
        <DesignLibraryServer
          page={page}
          componentMap={componentMap}
          loadImportMap={() => import('.sitecore/import-map.server')}
          rendering={route}
        />
      )}
    </>
  );
};
