import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { ComponentRendering, LayoutServiceData } from '@sitecore-content-sdk/content/layout';
import { ReactContentSdkComponent } from '@sitecore-content-sdk/react';

/**
 * The interface for the component props error.
 * @public
 */
export type ComponentPropsError = { error: string; componentName: string };

/**
 * Shape of component props storage
 * @public
 */
export type ComponentPropsCollection = {
  [componentUid: string]: unknown | ComponentPropsError;
};

export type NextContext = GetServerSidePropsContext | GetStaticPropsContext;

/**
 * Type of side effect function which could be invoked on component level (getComponentServerProps)
 */
export type ComponentPropsFetchFunction<FetchedProps = unknown> = {
  (
    rendering: ComponentRendering,
    layoutData: LayoutServiceData,
    context: NextContext
  ): Promise<FetchedProps>;
};

/**
 * Defines the shape of a data-fetching function used at the component level.
 *
 * This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
 * It enables component-specific data loading that integrates with Next.js rendering flows.
 *
 * The returned props are passed directly to the component at render time.
 * @public
 */
export type GetComponentServerProps = ComponentPropsFetchFunction;

/**
 * Represents a nextjs component import
 * @public
 */
export type NextjsContentSdkComponent = ReactContentSdkComponent & {
  /**
   * Defines the shape of a data-fetching function used at the component level.
   *
   * This function can be used in both **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** contexts.
   * It enables component-specific data loading that integrates with Next.js rendering flows.
   *
   * The returned props are passed directly to the component at render time.
   */
  getComponentServerProps?: GetComponentServerProps;
  /**
   * Optional dynamic import for lazy components - allows component props retrieval
   */
  dynamicModule?: () => Promise<ReactContentSdkComponent>;
  /**
   * Indicates the type of the component in a Next.js app router context.
   * - 'client': The component contains client only api's and will be rendered on the client side.
   * - 'server': The component contains server only api's and will be rendered on the server side.
   * - 'universal': The component is isomorphic and can be rendered on both server and client.
   */
  componentType?: 'client' | 'server' | 'universal';
};
