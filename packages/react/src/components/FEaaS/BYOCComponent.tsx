'use client';
import React from 'react';
import { getDataFromFields } from '../../utils';
import { MissingComponent } from '../MissingComponent';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import { BYOCComponentProps, ErrorComponentProps } from './models';

export const BYOC_COMPONENT_RENDERING_NAME = 'BYOCComponent';

/**
 * TODO: remove when framework agnostic forms implemented
 */

const DefaultErrorComponent = (props: ErrorComponentProps) => (
  <div>A rendering error occurred: {props.error?.message}.</div>
);

/**
 * BYOCComponent facilitate the rendering of external components. It manages potential errors,
 * missing components, and customization of error messages or alternative rendering components.
 * @param {ByocComponentProps} props component props
 * @returns dynamically rendered component or Missing Component error frame
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
