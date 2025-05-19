import {
  ComponentParams,
  ComponentRendering,
  SitecoreProviderPageContext,
} from '@sitecore-content-sdk/nextjs';

/**
 * Shared component props
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams;
};

/**
 * Component props with context
 * You can access `pageContext` by withSitecore/useSitecore
 * @example withSitecore()(ContentBlock)
 * @example const { pageContext } = useSitecore()
 */
export type ComponentWithContextProps = ComponentProps & {
  pageContext: SitecoreProviderPageContext;
};
