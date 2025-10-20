import React from 'react';
import { BYOCComponentProps } from './models';
import { fetchBYOCComponentServerProps } from './feaas-utils';
import { BYOCWrapper } from './BYOCWrapper';

export const BYOCServerWrapper = async (props: BYOCComponentProps) => {
  const params = props.rendering?.params || {};
  const finalProps = {
    ...(await fetchBYOCComponentServerProps(params)),
    ...props,
  };
  return <BYOCWrapper {...finalProps} />;
};
