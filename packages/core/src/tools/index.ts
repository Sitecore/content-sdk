export { generateSites, GenerateSitesConfig } from './generateSites';
export { generateMetadata } from './generateMetadata';
export { scaffoldComponent } from './scaffold';
export { GenerateMapFunction, GenerateMapArgs } from './generate-map';
export { extractFiles } from './codegen/extract-files';
export { writeImportMap } from './codegen/import-map';
export * from './templating';
export * from './auth/models';
import * as authModule from './auth';

export const auth: {
  readonly clientCredentialsFlow: typeof authModule.clientCredentialsFlow;
} = {} as any;

Object.defineProperty(auth, 'clientCredentialsFlow', {
  get: () => authModule.clientCredentialsFlow,
  configurable: true,
  enumerable: true,
});
