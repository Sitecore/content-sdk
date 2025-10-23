import React from 'react';
import { BYOCServerWrapperProps } from './models';
import { fetchBYOCComponentServerProps } from './feaas-utils';
import { BYOCWrapper } from './BYOCWrapper';
import { nonSerializedPlaceholderProps } from '../Placeholder/models';

export const BYOCServerWrapper = async (props: BYOCServerWrapperProps) => {
  const params = props.rendering?.params || {};
  // only pass serializable props to the client BYOC component
  const serializableProps = nonSerializedPlaceholderProps.reduce(
    (finalProps, prop) => {
      delete finalProps[prop];
      return finalProps;
    },
    { ...(props as any) }
  );
  const finalProps = {
    ...(await fetchBYOCComponentServerProps(params)),
    ...serializableProps,
  };
  return <BYOCWrapper {...finalProps} />;
};
