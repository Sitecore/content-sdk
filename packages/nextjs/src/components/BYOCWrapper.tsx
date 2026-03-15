import {
  BYOCWrapper,
  BYOCComponentParams,
  fetchBYOCComponentServerProps,
} from '@sitecore-content-sdk/react';
import { GetComponentServerProps } from '../sharedTypes/component-props';

/**
 * Will be called during SSG or SSR
 * @param {ComponentRendering} rendering
 * @returns {GetStaticPropsContext | GetStaticPropsContext} context with type depending on SSR or SSG mode
 * @internal
 */
export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const params: BYOCComponentParams = rendering.params || {};
  const result = await fetchBYOCComponentServerProps(params);
  return result;
};

export default BYOCWrapper;
