import type { AstroComponentMap } from '@sitecore-content-sdk/atro';

/**
 * Component map that maps Sitecore component names to Astro component implementations.
 * Register your Sitecore components here.
 *
 * Example:
 *   import HeroBanner from '../components/HeroBanner.astro';
 *   components.set('HeroBanner', HeroBanner);
 */
const components: AstroComponentMap = new Map();

export default components;
