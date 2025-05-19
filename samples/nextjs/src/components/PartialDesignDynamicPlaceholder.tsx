import React, { JSX } from 'react';
import { Placeholder, ComponentRendering } from '@sitecore-content-sdk/nextjs';

type DynamicPlaceholderProps = {
  rendering: ComponentRendering;
};

const PartialDesignDynamicPlaceholder = (props: DynamicPlaceholderProps): JSX.Element => (
  <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
