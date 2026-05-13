import * as fs from 'node:fs';
import * as path from 'path';
import {
  buildComponentMapContent,
  prepareComponentsForMap,
  type EnhancedComponentMapTemplate,
  type GenerateMapArgs,
  type GenerateMapFunction,
} from '@sitecore-content-sdk/content/tools';
import { getComponentList } from '@sitecore-content-sdk/content/node-tools';

export type AngularGenerateMapArgs = Omit<
  GenerateMapArgs,
  'clientComponentMap' | 'clientMapTemplate'
>;

/**
 * True when the file declares an Angular `@Component`.
 * @param {string} filePath - Path to a TypeScript source file
 */
const fileHasAngularComponentDecorator = (filePath: string): boolean => {
  const content = fs.readFileSync(filePath, 'utf8');
  return /@Component\s*\(/m.test(content);
};

const buildAngularComponentMap: EnhancedComponentMapTemplate = (
  components,
  componentImports,
  ctx
) => {
  for (const component of components) {
    console.debug(`Registering Content SDK Angular component ${component.componentName}`);
  }
  const DEFAULT_BUILTIN_IMPORTS = `import { ScFormComponent } from '@sitecore-content-sdk/angular';`;

  const DEFAULT_BUILTIN_MAP_ENTRIES = [`['Form', ScFormComponent]`];

  return buildComponentMapContent(ctx.entries!, componentImports, {
    framework: 'angular',
    builtInImports: DEFAULT_BUILTIN_IMPORTS,
    builtInMapEntries: DEFAULT_BUILTIN_MAP_ENTRIES,
    // Content SDK public types omit `framework`; implementation reads it (see packages/content/src/tools/templating/utils.ts).
  } as never);
};

/**
 * Generates `.sitecore/component-map.ts` for Angular apps from `.ts` sources under configured paths (must declare `@Component`).
 * @param {GenerateMapArgs} params - {@link GenerateMapArgs}
 * @public
 */
export const generateMap: GenerateMapFunction = (params: GenerateMapArgs) => {
  const {
    paths,
    destination = '.sitecore',
    exclude,
    componentImports,
    includeVariants = true,
    mapTemplate,
  } = params;

  const comps = getComponentList(paths, exclude, includeVariants);

  const withComponentDecorator = comps.filter((c) => fileHasAngularComponentDecorator(c.filePath));

  const processedComponents = prepareComponentsForMap(withComponentDecorator, {
    includeVariants: includeVariants,
  });

  const mapTemplateFn = mapTemplate ?? buildAngularComponentMap;

  const content = mapTemplateFn(withComponentDecorator, componentImports, {
    entries: processedComponents,
    includeVariants,
    isClientMap: false,
  });

  const outDir = path.join(process.cwd(), destination);
  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'component-map.ts'), content, 'utf8');
  } catch (error) {
    console.error(
      `Component Map generation failed. Error writing to file ${outDir}/component-map.ts`,
      error
    );
    throw error;
  }
};
