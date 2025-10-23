import React from 'react';
import { fetchFEaaSComponentServerProps } from './feaas-utils';
import { FEaaSWrapper } from './FEaaSWrapper';
import { FEaaSServerWrapperProps } from './models';
import { nonSerializedPlaceholderProps } from '../Placeholder/models';

/**
 * Server component for FEaaS. Retrieves server props and renders client FEaaSWrapper.
 * @param {FEaaSComponentProps} props incoming props
 * @returns {Promise<JSX.Element>} rendered FEaaSWrapper component
 */
export const FEaaSServerWrapper = async (props: FEaaSServerWrapperProps) => {
  const params = props.rendering?.params || {};
  const isPageStateNormal = props.page?.mode.isNormal;
  // only pass serializable props to the client FEaaS component
  const serializableProps = nonSerializedPlaceholderProps.reduce(
    (finalProps, prop) => {
      delete finalProps[prop];
      return finalProps;
    },
    { ...(props as any) }
  );
  const finalProps = {
    ...(await fetchFEaaSComponentServerProps(params, isPageStateNormal)),
    ...serializableProps,
  };
  return <FEaaSWrapper {...finalProps} />;
};
