import React, { Suspense } from 'react';
import { connection } from 'next/server';
import {
  FEaaSWrapper,
  FEaaSComponentParams,
  FEaaSComponentServerProps,
  FEaaSServerWrapperProps,
  fetchFEaaSComponentServerProps,
} from '@sitecore-content-sdk/react';

/**
 * Fetches published FEaaS server props from the component params, so it can use `'use cache'`.
 * @public
 */
export type FEaaSCachedServerPropsFetcher = (
  params: FEaaSComponentParams
) => Promise<FEaaSComponentServerProps | null>;

/**
 * Options for {@link createFEaaSCacheComponentsServerWrapper}.
 * @public
 */
export type FEaaSCacheComponentsServerWrapperOptions = {
  /** Cached fetcher for normal pages. When omitted, FEaaS renders at request time. */
  getCachedServerProps?: FEaaSCachedServerPropsFetcher;
};

const FETCH_PARAM_KEYS = [
  'LibraryId',
  'ComponentId',
  'ComponentVersion',
  'ComponentRevision',
  'ComponentHostName',
  'ComponentDataOverride',
] as const satisfies (keyof FEaaSComponentParams)[];

const pickFetchParams = (params: FEaaSComponentParams): FEaaSComponentParams =>
  Object.fromEntries(
    FETCH_PARAM_KEYS.filter((key) => params[key] !== undefined).map((key) => [key, params[key]])
  );

/**
 * FEaaS server component for Cache Components apps. Renders behind `<Suspense>` and fetches
 * at request time, unless `getCachedServerProps` handles normal pages. Requires `cacheComponents: true`.
 * @param {FEaaSCacheComponentsServerWrapperOptions} [options] wrapper options
 * @returns {Function} component to register as `FEaaSWrapper`
 * @public
 */
export function createFEaaSCacheComponentsServerWrapper(
  options: FEaaSCacheComponentsServerWrapperOptions = {}
) {
  const { getCachedServerProps } = options;

  const FEaaSServerBody = async (props: FEaaSServerWrapperProps) => {
    const params = props.rendering?.params || {};
    const isPageStateNormal = props.page?.mode.isNormal;

    let serverProps: FEaaSComponentServerProps | null;
    if (getCachedServerProps && isPageStateNormal) {
      serverProps = await getCachedServerProps(pickFetchParams(params));
    } else {
      await connection();
      serverProps = await fetchFEaaSComponentServerProps(params, isPageStateNormal);
    }

    return <FEaaSWrapper {...serverProps} params={props.params} fields={props.fields} />;
  };

  const FEaaSCacheComponentsServerWrapper = (props: FEaaSServerWrapperProps): React.JSX.Element => (
    <Suspense fallback={null}>
      <FEaaSServerBody {...props} />
    </Suspense>
  );

  return FEaaSCacheComponentsServerWrapper;
}

/**
 * Request-time FEaaS server component for Cache Components apps.
 * @public
 */
export const FEaaSCacheComponentsServerWrapper = createFEaaSCacheComponentsServerWrapper();
