import React, { Suspense } from 'react';
import { connection } from 'next/server';
import { FEaaSServerWrapper, FEaaSServerWrapperProps } from '@sitecore-content-sdk/react';

const FEaaSRequestTimeServerWrapper = async (props: FEaaSServerWrapperProps) => {
  await connection();
  return <FEaaSServerWrapper {...props} />;
};

/**
 * FEaaS server component for Cache Components apps. Renders `FEaaSServerWrapper` at request time
 * behind `<Suspense>`, so the rest of the page can be prerendered. Requires `cacheComponents: true`.
 * @param {FEaaSServerWrapperProps} props incoming props
 * @returns {React.JSX.Element} FEaaS component wrapped in Suspense
 * @public
 */
export const FEaaSCacheComponentsServerWrapper = (
  props: FEaaSServerWrapperProps
): React.JSX.Element => (
  <Suspense fallback={null}>
    <FEaaSRequestTimeServerWrapper {...props} />
  </Suspense>
);
