import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { ComponentRendering, LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import {
  ExtendedComponentType,
  ReactJssModule,
  ReactJssComponent,
} from '@sitecore-content-sdk/react';

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
 * Shape of getServerSideProps function on component level
 */
export type GetServerSideComponentProps = ComponentPropsFetchFunction<GetServerSidePropsContext>;

/**
 * Shape of getStaticProps function on component level
 */
export type GetStaticComponentProps = ComponentPropsFetchFunction<GetStaticPropsContext>;

/**
 * Represents a module (file)
 */
export type NextjsModule = ReactJssModule & {
  /**
   * function for component level data fetching in SSR mode
   */
  getServerSideProps?: GetServerSideComponentProps;
  /**
   * function for component level data fetching in SSG mode
   */
  getStaticProps?: GetStaticComponentProps;
};

/**
 * Represents a component that can be imported dynamically
 */
export type LazyModule = {
  module: () => Promise<NextjsModule>;
  element: (isEditing?: boolean) => ExtendedComponentType;
};

/**
 * Component is a module or a nextjs lazy module
 */
export type NextjsComponent = ReactJssComponent<NextjsModule>;
