import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { ComponentRendering, LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { ReactJssComponent } from '@sitecore-content-sdk/react';

export type ComponentPropsError = { error: string; componentName: string };

/**
 * Shape of component props storage
 */
export type ComponentPropsCollection = {
  [componentUid: string]: unknown | ComponentPropsError;
};

/**
 * Type of side effect function which could be invoked on component level (getStaticProps/getServerSideProps)
 */
export type ComponentPropsFetchFunction<NextContext, FetchedProps = unknown> = {
  (rendering: ComponentRendering, layoutData: LayoutServiceData, context: NextContext): Promise<
    FetchedProps
  >;
};

/**
 * Defines the shape of a data-fetching function used at the component level.
 *
 * This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
 * It enables component-specific data loading that integrates with Next.js rendering flows.
 *
 * The returned props are passed directly to the component at render time.
 */
export type GetComponentServerProps = ComponentPropsFetchFunction<
  GetServerSidePropsContext | GetStaticPropsContext
>;

/**
 * Represents a nextjs component import
 */
export type NextjsJssComponent = ReactJssComponent & {
  /**
   * function for component level data fetching in both SSR and SSG
   */
  getComponentServerProps?: GetComponentServerProps;
  /**
   * Optional dynamic import for lazy components - allows component props retrieval
   */
  dynamicModule?: () => Promise<ReactJssComponent>;
};
