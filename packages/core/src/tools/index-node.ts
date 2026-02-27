// export point for /node-tools submodule, which is not client-side safe and should not be imported in browser bundles
export * from './auth/models';
import * as authModule from './auth';

export * from './metadata';

export { ensurePathExists } from './ensurePath';

/**
 * Preserve "live binding" semantics similar to ES module imports: production
 * code always sees the current implementation; tests can swap it safely and
 * restore via `sandbox.restore()` with no hidden global state.
 * @public
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
