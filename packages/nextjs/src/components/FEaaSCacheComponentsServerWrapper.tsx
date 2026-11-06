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
 * Fetches server props for a FEaaS component on a normal (published) page.
 * Receives only the params that identify the component, so the implementation can be
 * wrapped in `'use cache'` and keyed by the component rather than the page.
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
  /**
   * Fetcher used on normal pages instead of the request-time fetch. Typically an app-level
   * `'use cache'` function that calls `fetchFEaaSComponentServerProps(params, true)`.
   * When omitted, FEaaS components always render at request time.
   */
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
 * Creates a FEaaS server component for apps with Next.js Cache Components (`cacheComponents: true`).
 *
 * The component renders behind `<Suspense>`. Without `getCachedServerProps`, or on preview/editing
 * pages, it calls `connection()` before fetching, so the FEaaS template is fetched at request time.
 * With `getCachedServerProps`, normal pages use it, so the component can be part of the static shell.
 *
 * Do not use it without Cache Components: there `connection()` makes the whole route dynamic.
 * Use the built-in `FEaaSServerWrapper` instead.
 * @param {FEaaSCacheComponentsServerWrapperOptions} [options] wrapper options
 * @returns {Function} FEaaS server component to register as `FEaaSWrapper` in the component map
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
 * FEaaS server component for apps with Next.js Cache Components. Renders at request time behind
 * `<Suspense>`, so pages with FEaaS components can be prerendered. Register it as `FEaaSWrapper`
 * in the component map, or use {@link createFEaaSCacheComponentsServerWrapper} to cache published components.
 * @public
 */
export const FEaaSCacheComponentsServerWrapper = createFEaaSCacheComponentsServerWrapper();
