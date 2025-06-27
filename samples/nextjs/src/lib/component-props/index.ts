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
  params: ComponentParams & {
    /**
     * The identifier for the rendering
     */
    RenderingIdentifier?: string;
    /**
     * The styles for the rendering
     * This value is calculated by the Placeholder component
     */
    styles?: string;
    /**
     * The enabled placeholders for the rendering
     */
    EnabledPlaceholders?: string;
  };
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
