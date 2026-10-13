import { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * Renders a dynamic placeholder for partial designs.
 * The placeholder key is provided via the rendering parameter `sig`.
 */
const PartialDesignDynamicPlaceholder = (props: ComponentProps): JSX.Element => (
  <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
