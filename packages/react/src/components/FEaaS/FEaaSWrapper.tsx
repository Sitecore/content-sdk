'use client';
import React, { JSX } from 'react';
import * as FEAAS from '@sitecore-feaas/clientside/react';
import { getDataFromFields } from '../../utils';
import { FEaaSComponentProps } from './models';

// FEaaSComponent remains for backward compatibility and testing purposes

/**
 * @param {FEaaSComponentProps} props component props
 */
export const FEaaSComponent = (props: FEaaSComponentProps): JSX.Element => {
  const computedRevision = props.params?.ComponentRevision || props.revisionFallback;
  if (
    !props.template &&
    (!props.params ||
      !props.params.LibraryId ||
      !props.params.ComponentId ||
      !props.params.ComponentVersion ||
      !props.params.ComponentHostName ||
      !computedRevision)
  ) {
    // Missing FEaaS component required props
    return null;
  }
  // combine fetchedData from server with datasource data (if present)
  const data = { ...props.fetchedData, _: getDataFromFields(props.fields ?? {}) };

  // FEaaS control would still be hydrated by client
  // we pass all the props as a workaround to avoid hydration error, until we convert all Content SDK components to server side
  // this also allows component to fall back to full client-side rendering when template or src is empty
  // FEAAS should not fetch anything, since Content SDK does the fetching - so we pass empty array into fetch param
  return (
    <FEAAS.Component
      data={data}
      template={props.template}
      cdn={props.params?.ComponentHostName}
      library={props.params?.LibraryId}
      version={props.params?.ComponentVersion}
      component={props.params?.ComponentId}
      instance={props.params?.ComponentInstanceId}
      revision={computedRevision}
      fetch={[]}
    />
  );
};

export const FEaaSWrapper = (props: FEaaSComponentProps): JSX.Element => {
  const styles = `component feaas ${props.params?.styles}`.trimEnd();
  const id = props.params?.RenderingIdentifier;
  return (
    <div className={styles} id={id ? id : undefined}>
      <div className="component-content">
        <FEaaSComponent {...props} />
      </div>
    </div>
  );
};
