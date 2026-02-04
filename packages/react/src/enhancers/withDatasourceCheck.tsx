import React, { JSX } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';

export const DefaultEditingError = (): JSX.Element => (
  <div className="sc-jss-editing-error" role="alert">
    Datasource is required. Please choose a content item for this component.
  </div>
);
export type PageMode = {
  isNormal: boolean;
  isPreview: boolean;
  isEditing: boolean;
  isDesignLibrary: boolean;
};
export type Page = {
  mode: PageMode;
};
export interface WithDatasourceCheckProps {
  rendering: ComponentRendering;
  page: Page;
}

export interface WithDatasourceCheckOptions {
  /**
   * A component that is rendered when a datasource is missing during editing.
   * If unspecified, a default component with message is displayed.
   */
  editingErrorComponent?: React.ComponentClass<unknown> | React.FC<unknown>;
}

/**
 * Checks whether a Sitecore datasource is present and renders appropriately depending on page mode (normal vs editing).
 * @param {WithDatasourceCheckOptions} [options]
 * @returns
 *  The wrapped component, if a datasource is present.
 *  A null component (in normal mode) or an error component (in editing mode), if a datasource is not present.
 * @public
 */
export function withDatasourceCheck(options?: WithDatasourceCheckOptions) {
  return function withDatasourceCheckHoc<ComponentProps extends WithDatasourceCheckProps>(
    Component: React.ComponentType<ComponentProps>
  ) {
    return function WithDatasourceCheck(props: ComponentProps) {
      const EditingError = options?.editingErrorComponent ?? DefaultEditingError;
      const page = props?.page;
      // If the component is rendered in DesignLibrary, we don't need to check for datasource
      const isDesignLibrary = page?.mode?.isDesignLibrary;
      return isDesignLibrary || props.rendering?.dataSource ? (
        <Component {...props} />
      ) : page?.mode?.isEditing ? (
        <EditingError />
      ) : null;
    };
  };
}
