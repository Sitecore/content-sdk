﻿import React from 'react';
import { ComponentFields, ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { getDataFromFields } from '../utils';
import { MissingComponent, MissingComponentProps } from './MissingComponent';
import * as FEAAS from '@sitecore-feaas/clientside/react';

export const BYOC_COMPONENT_RENDERING_NAME = 'BYOCComponent';

/**
 * TODO: remove when framework agnostic forms implemented
 */

/**
 * FEaaS props for server rendering.
 */
type BYOCServerProps = {
  /**
   * Fetched data from server component props for server rendering, based on rendering params.
   */
  fetchedData?: FEAAS.DataScopes;
};

/**
 * Data from rendering params on Sitecore's BYOC rendering
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

export type BYOCComponentProps = BYOCComponentClientProps & BYOCServerProps;

type ErrorComponentProps = {
  [prop: string]: unknown;
  error?: Error;
};

const DefaultErrorComponent = (props: ErrorComponentProps) => (
  <div>A rendering error occurred: {props.error?.message}.</div>
);

/**
 * BYOCComponent facilitate the rendering of external components. It manages potential errors,
 * missing components, and customization of error messages or alternative rendering components.
 * @param {ByocComponentProps} props component props
 * @returns dynamicly rendered component or Missing Component error frame
 */
export class BYOCComponent extends React.Component<BYOCComponentProps> {
  state: Readonly<{ error?: Error }>;

  constructor(props: BYOCComponentProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: error };
  }

  componentDidCatch(error: Error) {
    this.setState({ error });
  }

  render() {
    const props: BYOCComponentProps = this.props;
    if (this.state.error) {
      return this.props.errorComponent ? (
        <this.props.errorComponent error={this.state.error} />
      ) : (
        <DefaultErrorComponent error={this.state.error} />
      );
    }
    const { ComponentName: componentName } = props.params || {};

    if (!componentName) {
      const noNameProps = {
        errorOverride: 'BYOC: The ComponentName for this rendering is missing',
      };
      return props.missingComponentComponent ? (
        <this.props.missingComponentComponent {...noNameProps} />
      ) : (
        <MissingComponent {...noNameProps} />
      );
    }

    const unRegisteredComponentProps = {
      rendering: {
        componentName: componentName,
      },
      errorOverride: 'BYOC: This component was not registered.',
    };

    const fallbackComponent = this.props.missingComponentComponent ? (
      <this.props.missingComponentComponent {...unRegisteredComponentProps} />
    ) : (
      <MissingComponent {...unRegisteredComponentProps} />
    );

    const ErrorComponent = this.props.errorComponent;

    let componentProps: { [key: string]: any } = {};

    if (props.params?.ComponentProps) {
      try {
        componentProps = JSON.parse(props.params.ComponentProps) ?? {};
      } catch (e) {
        console.error(
          `Parsing props for ${componentName} component from rendering params failed. Error: ${e}`
        );
        return ErrorComponent ? (
          <ErrorComponent error={e as Error} />
        ) : (
          <DefaultErrorComponent error={e as Error} />
        );
      }
    }
    // apply props from item datasource
    const dataSourcesData = { ...props.fetchedData, _: getDataFromFields(props.fields ?? {}) };

    // we render fallback on client to avoid problems with client-only components
    return (
      <FEAAS.ExternalComponent
        {...props.rendering}
        componentName={componentName}
        clientFallback={fallbackComponent}
        datasources={dataSourcesData}
        {...componentProps}
      />
    );
  }
}

/**
 * Fetches server component props required for server rendering, based on rendering params.
 * @param {BYOCComponentParams} params component params
 */
export async function fetchBYOCComponentServerProps(
  params: BYOCComponentParams
): Promise<BYOCServerProps> {
  const fetchDataOptions: FEAAS.DataOptions = params.ComponentDataOverride
    ? JSON.parse(params.ComponentDataOverride)
    : {};

  const fetchedData: FEAAS.DataScopes = await FEAAS.DataSettings.fetch(fetchDataOptions || {});

  return {
    fetchedData,
  };
}
