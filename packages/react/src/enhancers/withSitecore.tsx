'use client';
import React from 'react';
import { EnhancedOmit } from '@sitecore-content-sdk/core/tools';
import {
  SitecoreProviderState,
  useSitecore,
  UseSitecoreOptions,
} from '../components/SitecoreProvider';
import { Page } from '@sitecore-content-sdk/content/client';

/**
 * The props that HOC will inject.
 * @public
 */
export interface WithSitecoreProps {
  /**
   * The current page context.
   */
  page: Page;
  /**
   * The API configuration defined in the `SitecoreConfig`.
   */
  api?: SitecoreProviderState['api'];
  /**
   * Method to update the page. This is only available if `updatable` is set to true.
   * @param {Page} value New page value.
   * @returns {void}
   */
  setPage?: ((value: Page) => void) | false;
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
export function withSitecore(options?: UseSitecoreOptions) {
  return function withSitecoreProviderHoc<ComponentProps extends WithSitecoreProps>(
    Component: React.ComponentType<ComponentProps>
  ) {
    return function WithSitecoreProvider(props: WithSitecoreHocProps<ComponentProps>) {
      const scContext = useSitecore(options);
      return (
        <Component
          {...(props as ComponentProps)}
          page={scContext.page}
          api={scContext.api}
          setPage={scContext.setPage}
        />
      );
    };
  };
}
