import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import { ComponentWithContextProps } from 'lib/component-props';

/**
 * Renders a dynamic placeholder for partial designs.
 * The placeholder key is provided via the rendering parameter `sig`.
 */
const PartialDesignDynamicPlaceholder = (props: ComponentWithContextProps): JSX.Element => (
  <AppPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page}
    componentMap={componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
