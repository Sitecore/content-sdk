import React from 'react';
import { fetchFEaaSComponentServerProps } from './feaas-utils';
import { FEaaSWrapper } from './FEaaSWrapper';
import { FEaaSComponentProps, FEaaSServerWrapperProps } from './models';
import { nonSerializedPlaceholderProps } from '../Placeholder/models';

/**
 * Server component for FEaaS. Retrieves server props and renders client FEaaSWrapper.
 * @param {FEaaSComponentProps} props incoming props
 * @returns rendered FEaaSWrapper component
 * @public
 */
export const FEaaSServerWrapper = async (props: FEaaSServerWrapperProps) => {
  const params = props.rendering?.params || {};
  const isPageStateNormal = props.page?.mode.isNormal;
  // only pass serializable props to the client FEaaS component
  const serializableProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !nonSerializedPlaceholderProps.includes(key as any))
  ) as FEaaSComponentProps;
  const finalProps = {
    ...(await fetchFEaaSComponentServerProps(params, isPageStateNormal)),
    ...serializableProps,
  };
  return <FEaaSWrapper {...finalProps} />;
};
