'use client';
import {
  BYOCWrapper,
  BYOCComponentParams,
  fetchBYOCComponentServerProps,
} from '@sitecore-content-sdk/react';
import { GetComponentServerProps } from '../sharedTypes/component-props';

/**
 * TODO: remove when framework agnostic forms implemented
 * This is a repackaged version of the React BYOCWrapper component with support for
 * server rendering in Next.js (using component-level data-fetching feature of Content SDK).
 */

/**
 * Will be called during SSG or SSR
 * @param {ComponentRendering} rendering
 * @returns {GetStaticPropsContext | GetStaticPropsContext} context with type depending on SSR or SSG mode
 */
export const getComponentServerProps: GetComponentServerProps = async (rendering) => {
  const params: BYOCComponentParams = rendering.params || {};
  const result = await fetchBYOCComponentServerProps(params);
  return result;
};

export default BYOCWrapper;
