import { ComponentRendering, RouteData } from '@sitecore-content-sdk/core/layout';
/**
 * Hidden rendering name constant
 * @internal
 */
export declare const HIDDEN_RENDERING_NAME = "Hidden Rendering";
/**
 * Get the renderings for the specified placeholder from the rendering data.
 * @param {ComponentRendering | RouteData} rendering rendering data
 * @param {string} name placeholder name
 * @param {boolean} isEditing whether components should be rendered in editing mode
 * @returns {ComponentRendering[]} array of component renderings
 */
export declare function getPlaceholderRenderings(rendering: ComponentRendering | RouteData, name: string, isEditing: boolean): ComponentRendering[];
/**
 * Get SXA specific params from Sitecore rendering params
 * @param {ComponentRendering} rendering rendering object
 * @returns {object} converted SXA params
 */
export declare function getSXAParams(rendering: ComponentRendering): {
    styles: string;
};
/**
 * Props to be passed to rendered components
 * @public
 */
export interface ComponentProps {
    fields: {
        [name: string]: unknown;
    };
    params: {
        [name: string]: string;
    };
    rendering: ComponentRendering;
}
/**
 * Get component props to be passed to the rendered component.
 * Merges placeholder-level and component-level fields/params with SXA params.
 * @param {ComponentRendering} componentRendering rendering to be rendered
 * @param {Record<string, unknown>} placeholderFields fields from placeholder
 * @param {Record<string, string>} placeholderParams params from placeholder
 * @returns {ComponentProps} props to be passed to the rendered component
 */
export declare function getComponentProps(componentRendering: ComponentRendering, placeholderFields?: Record<string, unknown>, placeholderParams?: Record<string, string>): ComponentProps;
//# sourceMappingURL=placeholder-utils.d.ts.map