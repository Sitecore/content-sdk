import { FEaaSCacheComponentsServerWrapper } from '@sitecore-content-sdk/nextjs';

// Replaces the built-in FEaaSWrapper so FEaaS components render at request time behind Suspense,
// which Cache Components requires. To cache published FEaaS components, see the
// content-sdk-cache-components-and-osr skill.
export default FEaaSCacheComponentsServerWrapper;
