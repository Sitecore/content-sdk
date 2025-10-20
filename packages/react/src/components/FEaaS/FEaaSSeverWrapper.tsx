import React from 'react';
import { fetchFEaaSComponentServerProps } from './feaas-utils';
import { FEaaSWrapper } from './FEaaSWrapper';
import { FEaaSComponentProps } from './models';

/**
 * Server component for FEaaS. Retrieves server props and renders client FEaaSWrapper.
 * @param {FEaaSComponentProps} props incoming props
 * @returns {Promise<JSX.Element>} rendered FEaaSWrapper component
 */
export const FEaaSServerWrapper = async (props: FEaaSComponentProps) => {
  const params = props.rendering?.params || {};
  const isPageStateNormal = props.page?.mode.isNormal;
  const finalProps = {
    ...(await fetchFEaaSComponentServerProps(params, isPageStateNormal)),
    ...props,
  };
  return <FEaaSWrapper {...finalProps} />;
};
