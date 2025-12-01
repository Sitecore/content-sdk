import * as FEAAS from '@sitecore-feaas/clientside/react';
import {
  BYOCComponentParams,
  BYOCServerProps,
  FEaaSComponentParams,
  FEaaSComponentServerProps,
  isFEaaSComponentParamsComplete,
  RequiredFEaaSParams,
  RevisionType,
} from './models';

/**
 * Fetches server component props required for server rendering, based on rendering params.
 * @param {BYOCComponentParams} params component params
 * @public
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

/**
 * Fetches server component props required for server rendering, based on rendering params.
 * Component endpoint will either be retrieved from params or from endpointOverride
 * @param {FEaaSComponentParams} params component params
 * @param {boolean} [isPageStateNormal] whether page is in normal mode
 * @param {string} [endpointOverride] optional override for component endpoint
 * @public
 */
export async function fetchFEaaSComponentServerProps(
  params: FEaaSComponentParams,
  isPageStateNormal?: boolean,
  endpointOverride?: string
): Promise<FEaaSComponentServerProps | null> {
  const revisionFallback = isPageStateNormal ? 'published' : 'staged';

  if (!isFEaaSComponentParamsComplete(params)) {
    // Missing FEaaS component required props
    return {
      fetchedData: {},
      revisionFallback,
      template: '',
    };
  }

  const src = endpointOverride || composeComponentEndpoint(params, revisionFallback);
  let template = '';
  let fetchedData: FEAAS.DataScopes = {};
  const fetchDataOptions: FEAAS.DataOptions = params.ComponentDataOverride
    ? JSON.parse(params.ComponentDataOverride)
    : {};

  try {
    template = await fetchComponentTemplate(src, params, revisionFallback);

    fetchedData = await fetchData(fetchDataOptions);
  } catch (e) {
    console.error(e);
  }

  return {
    fetchedData,
    revisionFallback,
    template,
  };
}

/**
 * @param {string} src component endpoint
 * @param {FEaaSComponentParams} params rendering parameters for FEAAS component
 * @param {RevisionType} revisionFallback fallback revision to fetch if revision is absent in params
 */
async function fetchComponentTemplate(
  src: string,
  params: FEaaSComponentParams,
  revisionFallback: string
): Promise<string> {
  try {
    const { template } = await FEAAS.fetchComponent(src);
    return template;
  } catch (error) {
    console.error(
      `Fetch FEAAS component from ${src} failed. Ensure the component revision "${
        params.ComponentRevision || revisionFallback
      }" is present`
    );
    throw error;
  }
}

/**
 * Fetches component data based on the provided data options.
 * This function asynchronously fetches data using the FEAAS.DataSettings.fetch method.
 * @param {FEAAS.DataOptions} dataOptions - Options to customize data fetching.
 * @returns {Promise<FEAAS.DataScopes>} A promise that resolves with the fetched data,
 * or rejects with an error if data fetching encounters an issue.
 * @throws {Error} If an error occurs during data fetching, it is propagated as an error.
 */
async function fetchData(dataOptions: FEAAS.DataOptions): Promise<FEAAS.DataScopes> {
  try {
    const fetchedData = await FEAAS.DataSettings.fetch(dataOptions || {});
    return fetchedData;
  } catch (error) {
    console.error('Fetch FEAAS component data settings failed');
    throw error;
  }
}

/**
 * Build component endpoint URL from component's params
 * @param {FEaaSComponentParams} params rendering parameters for FEAAS component
 * @param {RevisionType} revisionFallback fallback revision to fetch if revision is absent in params
 * @returns component endpoint URL
 */
export const composeComponentEndpoint = (
  params: FEaaSComponentParams & RequiredFEaaSParams,
  revisionFallback: RevisionType
) => {
  const revision = params.ComponentRevision || revisionFallback;
  const hostname = params.ComponentHostName.startsWith('https://')
    ? params.ComponentHostName
    : `https://${params.ComponentHostName}`;

  return `${hostname}/components/${params.LibraryId}/${params.ComponentId}/${params.ComponentVersion}/${revision}`;
};
