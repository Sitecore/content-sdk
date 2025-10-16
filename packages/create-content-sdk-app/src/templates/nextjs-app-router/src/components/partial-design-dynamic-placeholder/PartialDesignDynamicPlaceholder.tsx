import React, { JSX } from 'react';
import Placeholder from 'components/content-sdk/Placeholder';
import { ComponentWithContextProps } from 'lib/component-props';
import { componentMap } from '.sitecore/component-map';

const PartialDesignDynamicPlaceholder = (props: ComponentWithContextProps): JSX.Element => (
  <Placeholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page}
    componentMap={componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
