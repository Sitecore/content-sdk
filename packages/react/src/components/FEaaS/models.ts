import * as FEAAS from '@sitecore-feaas/clientside/react';
import { ComponentFields, ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { Page } from '@sitecore-content-sdk/core/client';
import { MissingComponentProps } from '../MissingComponent';

export const FEAAS_WRAPPER_RENDERING_NAME = 'FEaaSWrapper';
export const FEAAS_COMPONENT_RENDERING_NAME = 'FEaaSComponent';
export const BYOC_WRAPPER_RENDERING_NAME = 'BYOCWrapper';
export const BYOC_COMPONENT_RENDERING_NAME = 'BYOCComponent';
/**
 * FEaaS props for server rendering.
 */
export type BYOCServerProps = {
  /**
   * Fetched data from server component props for server rendering, based on rendering params.
   */
  fetchedData?: FEAAS.DataScopes;
};

/**
 * Data from rendering params on Sitecore's BYOC rendering
 * @public
 */
export type BYOCComponentParams = {
  /**
   * Name of the component to render
   */
  ComponentName?: string;
  /**
   * JSON props to pass into rendered component
   */
  ComponentProps?: string;
  /**
   * A JSON object with data sources to be fetched and passed to the component
   */
  ComponentDataOverride?: string;
  /**
   * A string with classes that can be used to apply themes, via SXA functionality
   */
  styles?: string;
  RenderingIdentifier?: string;
};

/**
 * Props for BYOCComponent. Includes components list to load external components from.
 */
export type BYOCComponentClientProps = {
  /**
   * rendering data
   */
  rendering: ComponentRendering;
  /**
   * rendering params
   */
  params?: BYOCComponentParams;
  /**
   * fields from datasource items to be passed as rendered child component props
   */
  fields?: ComponentFields;
  /**
   * Error component override. To be shown when Renderer or underlying component throws
   */
  errorComponent?: React.ComponentClass<ErrorComponentProps> | React.FC<ErrorComponentProps>;
  /**
   * Override to indicate missing component situations. Would be shown when BYOC component is not registered
   * or ComponentName is missing
   */
  missingComponentComponent?:
    | React.ComponentClass<MissingComponentProps>
    | React.FC<MissingComponentProps>;
};

export type BYOCServerWrapperProps = BYOCComponentProps & {
  rendering: ComponentRendering;
};

/**
 * Props for BYOCComponent.
 * @public
 */
export type BYOCComponentProps = BYOCComponentClientProps & BYOCServerProps;

export type ErrorComponentProps = {
  [prop: string]: unknown;
  error?: Error;
};

/**
 * Params from a Sitecore FEaaS rendering
 * @public
 */
export type FEaaSComponentParams = {
  LibraryId?: string;
  ComponentId?: string;
  ComponentVersion?: string;
  ComponentRevision?: RevisionType;
  ComponentHostName?: string;
  ComponentInstanceId?: string;
  ComponentDataOverride?: string;
  ComponentHTMLOverride?: string;
  styles?: string;
  RenderingIdentifier?: string;
};

export type RevisionType = number | 'staged' | 'published' | 'saved';

export type FEaaSServerWrapperProps = FEaaSComponentProps & {
  rendering?: ComponentRendering;
  page?: Page;
};

/**
 * The FEaaS component props.
 * @public
 */
export type FEaaSComponentProps = FEaaSComponentServerProps & FEaaSComponentClientProps;

/**
 * FEaaS props for server rendering.
 */
export type FEaaSComponentServerProps = {
  /**
   * HTML template for presentation rendered inside the component
   */
  template?: string;
  /**
   * Default revision to be fetched. Should be 'staged' for editing/preview. Can be overriden by params.ComponentRevision
   */
  revisionFallback?: RevisionType;
  /**
   * Fetched data from server component props for server rendering, based on rendering params.
   */
  fetchedData?: FEAAS.DataScopes;
};

/**
 * FEaaS props for client side component. Should be used as fallback when server props are not provided.
 * Would also be passed on server to avoid hydration issues
 */
export type FEaaSComponentClientProps = {
  /**
   * parameters from Sitecore's FEAAS component
   */
  params?: FEaaSComponentParams;
  /**
   * field data from component's datasource
   */
  fields?: ComponentFields;
};

/**
 * Interface representing the required parameters for a FEaaS component.
 */
export type RequiredFEaaSParams = {
  LibraryId: string;
  ComponentId: string;
  ComponentVersion: string;
  ComponentHostName: string;
};

export type ValidatedFEaaSComponentParams = FEaaSComponentParams & RequiredFEaaSParams;

/**
 * Type guard to check if FEaaSComponentParams has the required fields for component rendering.
 * @param { FEaaSComponentParams } params the params to check
 * @returns true if params has LibraryId, ComponentId, ComponentVersion, and ComponentHostName defined
 */
export function isFEaaSComponentParamsComplete(
  params?: FEaaSComponentParams
): params is ValidatedFEaaSComponentParams {
  if (!params) return false;

  return !!(
    params.LibraryId &&
    params.ComponentId &&
    params.ComponentVersion &&
    params.ComponentHostName
  );
}
