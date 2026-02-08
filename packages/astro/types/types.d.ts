import type { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';
import type { Page } from '@sitecore-content-sdk/content/client';
/**
 * A map of Sitecore component names to Astro component implementations.
 * Used by the Placeholder component to dynamically render components.
 * The key should match the component name in Sitecore.
 * @public
 */
export type AstroComponentMap = Map<string, any>;
/**
 * Props for the Placeholder component.
 * @public
 */
export interface PlaceholderProps {
    /** Name of the placeholder to render. */
    name: string;
    /** Rendering data (parent component rendering or route data) containing placeholder data. */
    rendering: ComponentRendering | RouteData;
    /** Page data containing mode information for editing detection. */
    page: Page;
    /** Component map that maps Sitecore component names to Astro component implementations. */
    componentMap: AstroComponentMap;
    /** Optional fields to pass to all rendered components. */
    fields?: Record<string, unknown>;
    /** Optional params to pass to all rendered components. */
    params?: Record<string, string>;
}
//# sourceMappingURL=types.d.ts.map