import {
  FEaaSWrapper,
  FEaaSComponentParams,
  fetchFEaaSComponentServerProps,
  LayoutServicePageState,
} from '@sitecore-content-sdk/react';
import { GetComponentServerProps } from '../sharedTypes/component-props';

/**
 * TODO: remove when framework agnostic forms implemented
 * This is a repackaged version of the React FEaaSWrapper component with support for
 * server rendering in Next.js (using component-level data-fetching feature of Content SDK).
 */

/**
 * Will be called during SSG or SSR
 * @param {ComponentRendering} rendering
 * @param {LayoutServiceData} layoutData
 * @returns {GetStaticPropsContext | GetServerSideProps} context
 */
export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  const params: FEaaSComponentParams = rendering.params || {};
  const isPageStateNormal =
    !layoutData.sitecore.context.pageState ||
    layoutData.sitecore.context.pageState === LayoutServicePageState.Normal;
  return await fetchFEaaSComponentServerProps(params, isPageStateNormal);
};

export default FEaaSWrapper;
