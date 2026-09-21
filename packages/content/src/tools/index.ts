export { GenerateMapFunction, GenerateMapArgs } from './generate-map';
export { getComponentSpec, getComponentSpecUrl } from './codegen/component-generation';
export {
  ComponentFile,
  ComponentImport,
  ComponentFileWithType,
  ComponentType,
  RouterType,
  filterComponentsByType,
  ComponentMapEntry,
  ComponentMapTemplate,
  EnhancedComponentMapTemplate,
  prepareComponentsForMap,
  buildComponentMapContent,
  toPascalCase,
} from './templating';
// Re-exported for backwards compatibility. Browser bundles should import this from
// `@sitecore-content-sdk/content/codegen-utils` — this barrel is Node/build-time only.
export { combineImportEntries } from '../codegen-utils';
