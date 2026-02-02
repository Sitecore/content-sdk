'use client';
import React from 'react';
import { EnhancedOmit } from '@sitecore-content-sdk/core/tools';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';

/**
 * The options for the withSitecore HOC.
 * @public
 */
export interface WithSitecoreOptions {
  /**
   * If set to true, the `updateContext` method will be injected into the component props.
   */
  updatable?: boolean;
}

/**
 * The props that HOC will inject.
 * @public
 */
export interface WithSitecoreProps {
  /**
   * The current page context.
   */
  page: Page;
  /** TODO: make non optional */
  scConfig?: SitecoreConfig;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderState['api'];
  /**
   * Method to update the page. This is only available if `updatable` is set to true.
   * @param {Page} value New page value.
   * @returns {void}
   */
  updatePage?: ((value: Page) => void) | false;
}

/**
 * The type of the props that HOC will receive.
 * @public
 */
export type WithSitecoreHocProps<ComponentProps> = EnhancedOmit<
  ComponentProps,
  keyof WithSitecoreProps
>;

/**
 * @param {WithSitecoreProviderOptions} [options]
 * @public
 */
export function withSitecore(options?: WithSitecoreOptions) {
  return function withSitecoreProviderHoc<ComponentProps extends WithSitecoreProps>(
    Component: React.ComponentType<ComponentProps>
  ) {
    return function WithSitecoreProvider(props: WithSitecoreHocProps<ComponentProps>) {
      return (
        <SitecoreProviderReactContext.Consumer>
          {(value) => (
            <Component
              {...(props as ComponentProps)}
              page={value.page}
              api={value.api}
              updatePage={options && options.updatable && value.setPage}
            />
          )}
        </SitecoreProviderReactContext.Consumer>
      );
    };
  };
}

/**
 * This hook grants acсess to the current Sitecore page and api.
 * @param {WithSitecoreOptions} [options] hook options
 * @example
 * const EditMode = () => {
 *    const { page } = useSitecore();
 *    return <span>Edit Mode is {page.mode.isEditing ? 'active' : 'inactive'}</span>
 * }
 * @example
 * const EditMode = () => {
 *    const { page, updatePage } = useSitecore({ updatable: true });
 *    const onClick = () => updatePage({ itemId: '123' });
 *    return <span onClick={onClick}>Item id is {page.itemId}</span>
 * }
 * @returns {object} { api, page, updatePage }
 * @public
 */
export function useSitecore(options?: WithSitecoreOptions): WithSitecoreProps {
  const reactContext = React.useContext(SitecoreProviderReactContext);
  const updatable = options?.updatable;

  return {
    api: reactContext.api,
    page: reactContext.page,
    scConfig: reactContext.scConfig,
    updatePage: updatable ? reactContext.setPage : undefined,
  };
}
