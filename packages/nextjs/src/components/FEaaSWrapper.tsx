﻿import {
  FEaaSWrapper,
  FEaaSComponentParams,
  fetchFEaaSComponentServerProps,
} from '@sitecore-content-sdk/react';
import {
  GetStaticComponentProps,
  GetServerSideComponentProps,
} from '../sharedTypes/component-props';

/**
 * TODO: remove when framework agnostic forms implemented
 * This is a repackaged version of the React FEaaSWrapper component with support for
 * server rendering in Next.js (using component-level data-fetching feature of JSS).
 */

/**
 * Will be called during SSG
 * @param {ComponentRendering} rendering
 * @param {LayoutServiceData} layoutData
 * @returns {GetStaticPropsContext} context
 */
export const getStaticProps: GetStaticComponentProps = async (rendering, layoutData) => {
  const params: FEaaSComponentParams = rendering.params || {};
  const result = await fetchFEaaSComponentServerProps(
    params,
    layoutData.sitecore.context.pageState
  );
  return result;
};

/**
 * Will be called during SSR
 * @param {ComponentRendering} rendering
 * @param {LayoutServiceData} layoutData
 * @returns {GetStaticPropsContext} context
 */
export const getServerSideProps: GetServerSideComponentProps = async (rendering, layoutData) => {
  const params: FEaaSComponentParams = rendering.params || {};
  const result = await fetchFEaaSComponentServerProps(
    params,
    layoutData.sitecore.context.pageState
  );
  return result;
};

export default FEaaSWrapper;
