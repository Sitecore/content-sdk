export { generateSites, GenerateSitesConfig } from './generateSites';
export { generateMetadata } from './generateMetadata';
export { scaffoldComponent } from './scaffold';
export { GenerateMapFunction, GenerateMapArgs } from './generate-map';
export { extractFiles } from './codegen/extract-files';
export { writeImportMap } from './codegen/import-map';
export { getComponentVariantSpec, getComponentRegistryUrl } from './codegen/component-variant';
export * from './templating';
export * from './auth/models';
import * as authModule from './auth';

/**
 * Preserve "live binding" semantics similar to ES module imports: production
 * code always sees the current implementation; tests can swap it safely and
 * restore via `sandbox.restore()` with no hidden global state.
 *
 * Public surface consumed by the rest of the codebase.
 */
export const auth: {
  readonly clientCredentialsFlow: typeof authModule.clientCredentialsFlow;
} = {} as any;

/*
 * Define an accessor so reads are dynamic
 *   - Production: returns the real `authModule.clientCredentialsFlow`.
 *   - Tests: can be replaced with a stub via `sinon.replaceGetter` or `sandbox.replaceGetter`
 */
Object.defineProperty(auth, 'clientCredentialsFlow', {
  get: () => authModule.clientCredentialsFlow,
  configurable: true,
  enumerable: true,
});
