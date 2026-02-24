import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import { debug } from '@sitecore-content-sdk/core';
import { getComponentList } from './../templating';
import { SitecoreConfig } from './../../config';
import crypto from 'crypto';
import { isNodeModuleImportOrAlias, getRelativeImportPath } from './utils';
import { constants } from '@sitecore-content-sdk/core';

const { ERROR_MESSAGES } = constants;

let _getComponentList = getComponentList;
const aliasImport = /^([a-zA-Z0-9]+) as .+$/;

export const unitMocks = ({
  getComponentListStub,
}: {
  getComponentListStub?: typeof getComponentList;
}) => {
  getComponentListStub && (_getComponentList = getComponentListStub);
};

/**
 * Gets a Map object with import modules and their respective exports present throughout the paths specified
 * @param {string} paths paths to files to be processed for import-map
 * @returns {Map<string, ImportModule>} collection of keys and values, where keys refer to modules being processed and values are collections of exports for each module
 */
export let getImportMap = _getImportMap;

/**
 * Builds file contents for component map based on the default template
 * @param {Map<string, ImportModule>} indexedImportMap map to be processed into final component-map.ts file
 * @returns {string} file code for component-map.ts
 * @internal
 */
export let defaultMapTemplate = _defaultMapTemplate;

export const importUnitMocks = {
  set getImportMap(mockImplementation) {
    getImportMap = mockImplementation;
  },
  get getImportMap() {
    return _getImportMap;
  },

  set defaultMapTemplate(
    mockImplementation: (indexedImportMap: Map<string, ModuleExports>) => string
  ) {
    defaultMapTemplate = mockImplementation;
  },
  get defaultMapTemplate() {
    return _defaultMapTemplate;
  },
};

/**
 * Type describing import map entry in final file
 * Represents structure i.e.
 * {module: '/import-path',
 * exports: [{ name: 'myName1', value: myName1 },..]}
 * Note that string name and implementation (value) name would be the same
 */
type ImportMapEntry = {
  module: string;
  namedExports: {
    name: string;
    value: string;
  }[];
  defaultExport: { name: 'default'; value: string | null };
  namespaceExport: { name: '*'; value: string | null };
};

/**
 * Args for import map generation
 * Specifies paths to include and exclude when generating imports
 * @public
 */
export type WriteImportMapArgs = {
  paths: string[];
  /**
   * @deprecated Pass `config` to the `defineCliConfig` function instead. This argument will be removed in the next major version.
   */
  scConfig?: SitecoreConfig;
  exclude?: string[];
};

/**
 * Internal args for import map generation
 * Extends WriteImportMapArgs with additional settings for templates and server/client maps applied within Content SDK
 * @internal
 */
export type WriteImportMapArgsInternal = WriteImportMapArgs & {
  /**
   * generate separate import map for server/client components
   * when true, generates import-map.server.ts and import-map.client.ts
   * @internal
   */
  separateServerClientMaps?: boolean;
  /**
   * Function to return custom template for server import map file.
   * Will be used as default template if separateServerClientMaps is false.
   * @param {Map<string, ModuleExports>} indexedImportMap import map to be processed into final import-map.ts or import-map.server.ts file
   * @returns {string} contents for resulting import map file
   * @internal
   */
  serverTemplate?: (indexedImportMap: Map<string, ModuleExports>) => string;
  /**
   * Function to return custom template for client import map file when separateServerClientMaps is true.
   * @param {Map<string, ModuleExports>} indexedImportMap import map to be processed into final import-map.client.ts file
   * @returns {string} contents for resulting import map file
   * @internal
   */
  clientTemplate?: (indexedImportMap: Map<string, ModuleExports>) => string;
};

/**
 * Import names definition
 * @typedef ImportName
 * @property {string} name - the original name of the import
 * @property {boolean} [isWildcard] - if import is a wildcard import (import * as name from 'module')
 */
export type ImportNames = {
  named: string[];
  namespace: string | null;
  default: string | null;
};

/**
 * Import module definition, specifying all the imports for a given import path
 * @internal
 */
export type ModuleExports = {
  // import { import1, import2 as imp3 }
  namedExports: Map<string, string>;
  // import coolName as coolerName
  defaultExport: string | null;
  // import * as coolName
  namespaceExport: string | null;
};

type ImportMapDef = {
  map: Map<string, ModuleExports>;
  path: string;
  isClient?: boolean;
};

/**
 * Parses and AST import node and extracts all imported values from it
 * @param {ts.ImportDeclaration} importNode import node to be parsed
 * @returns {ImportNames | null} object with named, default and namespace imported values, or null if import node is not valid
 */
export const getImportedValues = (importNode: ts.ImportDeclaration): ImportNames | null => {
  const importClause = importNode.importClause;
  if (!importClause) {
    console.warn('Cannot parse import string from: %s', importNode.getText());
    return null;
  }
  const result: ImportNames = {
    named: [] as string[],
    default: null,
    namespace: null,
  };
  importClause.getChildren().forEach((child) => {
    if (child.kind === ts.SyntaxKind.NamedImports) {
      // import [...,]{a,b,c}
      child.forEachChild((namedChild) => {
        const importText = namedChild.getText().trim();
        const aliasMatch = aliasImport.exec(importText);
        result.named.push(aliasMatch ? aliasMatch[1] : importText);
      });
    } else if (child.kind === ts.SyntaxKind.NamespaceImport) {
      // * as coolName
      result.namespace = child.getText().replace('* as ', '');
    } else if (child.kind === ts.SyntaxKind.Identifier) {
      // import coolName
      result.default = child.getText();
    }
  });
  return result;
};

// return alias-like name for an import value/variable name
// this helps alleviate duplicate import names in import-map.ts
export const getImportValueAlias = (
  importValue: string,
  moduleName: string,
  importType: 'named' | 'default' | 'namespace'
) => {
  if (process.env.IMPORT_ALIAS_STRATEGY === 'plain') return importValue;
  // Add extra uniqueness since the same alias can be used for different import types
  const importTypeId = importType === 'named' ? 'n' : importType === 'default' ? 'd' : 'ns';

  const suffix = crypto.hash('sha1', `${moduleName}_${importTypeId}`);
  return `${importValue}_${suffix}`;
};

// eslint-disable-next-line jsdoc/require-jsdoc
function _getImportMap(paths: string[]) {
  // make preparations for handling ts/js files
  const appPath = process.cwd();
  let cliCompilerOptions = {
    baseUrl: appPath,
    allowJs: true,
    target: ts.ScriptTarget.ESNext,
  };
  const tsConfig = ts.readConfigFile(path.resolve(appPath, 'tsconfig.json'), ts.sys.readFile);
  if (tsConfig.error) {
    console.warn(
      `[Codegen] Error reading tsconfig.json from app root: ${tsConfig.error.messageText}`
    );
  } else {
    cliCompilerOptions = {
      ...tsConfig.config.compilerOptions,
      ...cliCompilerOptions,
    };
  }

  const tsHost = ts.createCompilerHost(cliCompilerOptions, true);

  // indexed version of import map - we will store and aggregate unique import paths and their imports here
  const importMap: Map<string, ModuleExports> = new Map();

  // index to keep track of unique import values imported from different modules
  // helps avoid duplicate import names in the final import-map.ts file
  const importsList: string[] = [];

  paths.forEach((codeFilePath) => {
    const codeFileFullPath = path.isAbsolute(codeFilePath)
      ? codeFilePath
      : path.resolve(appPath, codeFilePath);

    // attempt to parse current file to extract imports from
    const tsCodeSource = tsHost.getSourceFile(codeFileFullPath, ts.ScriptTarget.Latest, (msg) => {
      throw new Error(`[Codegen] Failed to parse ${codeFileFullPath}: ${msg}`);
    });

    if (!tsCodeSource) throw ReferenceError(`[Codegen] Failed to find file ${codeFileFullPath}`);

    // By transpiling the code from current file to JS we get rid of unused imports and the type imports
    const jsCode = ts.transpileModule(tsCodeSource.getFullText(), {
      compilerOptions: cliCompilerOptions,
    });
    // despite the name, ts.createSourceFile only creates SourceFile instance in runtime. Go figure ¯\_(ツ)_/¯
    const jsCodeSource = ts.createSourceFile(
      'code.js',
      jsCode.outputText,
      ts.ScriptTarget.ESNext,
      true
    );

    // finally, we parse the final, trasformed js code and process import statements
    ts.forEachChild(jsCodeSource, (childNode) => {
      if (ts.isImportDeclaration(childNode) && childNode.importClause) {
        const imports = getImportedValues(childNode);

        if (!imports) {
          return;
        }

        // import path is extracted
        const moduleName = childNode.moduleSpecifier.getText().replace(/['"]/g, '');
        const resolvedModule = ts.nodeModuleNameResolver(
          moduleName,
          codeFileFullPath,
          cliCompilerOptions,
          tsHost
        );

        // get import path and check if its import target exists
        const resolvedImportPath = resolvedModule?.resolvedModule?.resolvedFileName;

        if (!resolvedImportPath) {
          console.warn('[Codegen] Could not resolve a file for import %s', moduleName);
          return;
        }

        let importModuleName: string;

        // if module path points to local app - get relative import path to the file (i.e. ./myComponent)
        // if it points to node_modules, file or an alias - keep as-is
        importModuleName = isNodeModuleImportOrAlias(moduleName)
          ? moduleName
          : getRelativeImportPath(resolvedImportPath, appPath);

        // Set module import info in the map. If module import exists - add entries to existing entry
        // Otherwise, add new entry
        if (!importMap.has(importModuleName)) {
          importMap.set(importModuleName, {
            namedExports: new Map(),
            defaultExport: null,
            namespaceExport: null,
          });
        }

        const moduleEntry = importMap.get(importModuleName);

        imports.named.forEach((importEntry) => {
          const sameModuleNamedAlready = moduleEntry!.namedExports.has(importEntry);

          if (sameModuleNamedAlready) {
            return;
          }

          const nameTaken = importsList.includes(importEntry);

          const importValue = nameTaken
            ? getImportValueAlias(importEntry, importModuleName, 'named')
            : importEntry;

          moduleEntry!.namedExports.set(importEntry, importValue);
          importsList.push(importEntry);
        });
        if (imports.namespace) {
          const sameModuleNamedAlready = moduleEntry!.namespaceExport;

          if (sameModuleNamedAlready) {
            return;
          }

          const nameTaken = importsList.includes(imports.namespace);
          const importValue = nameTaken
            ? getImportValueAlias(imports.namespace, importModuleName, 'namespace')
            : imports.namespace;

          moduleEntry!.namespaceExport = importValue;
          importsList.push(importValue);
        }
        if (imports.default) {
          const sameModuleNamedAlready = moduleEntry!.defaultExport;

          if (sameModuleNamedAlready) {
            return;
          }

          const nameTaken = importsList.includes(imports.default);
          const importValue = nameTaken
            ? getImportValueAlias(imports.default, importModuleName, 'default')
            : imports.default;

          moduleEntry!.defaultExport = importValue;
          importsList.push(importValue);
        }
      }
    });
  });

  return importMap;
}

const prepImportMaps = async (paths: string[], separateMaps?: boolean): Promise<ImportMapDef[]> => {
  const importMapFileDefault = path.join(process.cwd(), '.sitecore', 'import-map.ts');
  if (!separateMaps) {
    return [{ map: getImportMap(paths), path: importMapFileDefault }];
  }
  const appPath = process.cwd();
  const serverPaths: string[] = [];
  const clientPaths: string[] = [];
  const importMapFileClient = path.join(process.cwd(), '.sitecore', 'import-map.client.ts');
  const importMapFileServer = path.join(process.cwd(), '.sitecore', 'import-map.server.ts');
  for (const componentPath of paths) {
    const fullPath = path.isAbsolute(componentPath)
      ? componentPath
      : path.resolve(appPath, componentPath);
    // read the start of the file that may be 'use client'
    const firstLine = await new Promise<string>((resolve) => {
      let readBuffer = '';
      const stream = fs.createReadStream(fullPath, { end: 12 });
      stream
        .on('data', async (chunk) => {
          readBuffer += chunk.toString();
        })
        .on('close', () => resolve(readBuffer))
        .on('error', () => resolve(''));
    });

    if (!firstLine) continue;
    if (firstLine.match(/['"]use client['"]/)) {
      clientPaths.push(fullPath);
    } else {
      serverPaths.push(fullPath);
    }
  }
  return [
    { map: getImportMap(serverPaths), path: importMapFileServer },
    { map: getImportMap(clientPaths), path: importMapFileClient, isClient: true },
  ];
};

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgsInternal} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration.
 * @public
 */
export const writeImportMap = (args: WriteImportMapArgsInternal) => {
  return async ({ scConfig }: { scConfig?: SitecoreConfig } = {}) => {
    const config = args.scConfig ?? scConfig;

    const defaultTemplate = args.serverTemplate || defaultMapTemplate;
    const clientTemplate = args.clientTemplate || defaultMapTemplate;

    if (!config) {
      throw new Error(ERROR_MESSAGES.MV_008);
    }

    if (config.disableCodeGeneration) {
      debug.common('Skipping import map generation. Code generation functionality is disabled.');
      return;
    }
    const paths = _getComponentList(args.paths, args.exclude).map((entry) => entry.filePath);
    // TODO: don't run in pages router
    const importMaps = await prepImportMaps(paths, args.separateServerClientMaps);
    for (const importMap of importMaps) {
      console.log(
        `[Codegen] Generating import map: ${JSON.stringify({
          paths: args.paths,
          exclude: args.exclude,
        })}.\n Writing into ${importMap.path} ...`
      );
      // get generated map and combine with default one
      // can be expanded when adding support for non-react frameworks
      const importMapContent = importMap.isClient
        ? clientTemplate(importMap.map)
        : defaultTemplate(importMap.map);
      try {
        fs.writeFileSync(importMap.path, importMapContent, {
          encoding: 'utf8',
        });
      } catch (error) {
        console.error(
          `[Codegen] Import Map generation failed. Error writing to file ${importMap.path}:`,
          error
        );
        throw error;
      }
    }
  };
};

// eslint-disable-next-line jsdoc/require-jsdoc
function _defaultMapTemplate(indexedImportMap: Map<string, ModuleExports>, framework = 'core') {
  const importStatements: string[] = [];
  const importMapArray = Array.from(indexedImportMap);
  // get import map entries after
  const finalImportMap: ImportMapEntry[] = importMapArray.map(([modulePath, imports]) => {
    const defaultExport = {
      name: 'default' as const,
      value: imports.defaultExport,
    };
    const namedExports = Array.from(imports.namedExports).map(([name, value]) => {
      return {
        name,
        value,
      };
    });
    const namespaceExport = {
      name: '*' as const,
      value: imports.namespaceExport,
    };
    return {
      module: modulePath,
      defaultExport,
      namedExports,
      namespaceExport,
    };
  });

  finalImportMap.forEach((entry) => {
    if (entry.namedExports.length > 0) {
      const namedExports = entry.namedExports
        .map((entry) => {
          return entry.name !== entry.value ? `${entry.name} as ${entry.value}` : entry.name;
        })
        .join(', ');

      importStatements.push(`import { ${namedExports} } from '${entry.module}';`);
    }

    if (entry.defaultExport.value) {
      importStatements.push(`import ${entry.defaultExport.value} from '${entry.module}';`);
    }

    if (entry.namespaceExport.value) {
      importStatements.push(`import * as ${entry.namespaceExport.value} from '${entry.module}';`);
    }
  });

  const outputExportEntries = (entry: ImportMapEntry) => {
    return (
      [...entry.namedExports, entry.defaultExport, entry.namespaceExport]
        .filter((entry) => entry.value !== null)
        .map((namedExport) => `      { name: '${namedExport.name}', value: ${namedExport.value} }`)
        .join(',\n') + ','
    );
  };

  return `// This file is auto-generated by the Sitecore Content SDK.
// Below are built-in Content SDK imports neccessary for the import map
import {
  combineImportEntries,
  defaultImportEntries,
  ImportEntry,
} from '@sitecore-content-sdk/${framework}/codegen';
// end of built-in imports

${importStatements.join('\n')}

const importMap = [
${finalImportMap
  .map((entry) =>
    [
      '  {',
      `    module: '${entry.module}',`,
      '    exports: [',
      outputExportEntries(entry),
      '    ]',
      '  }',
    ]
      .filter(Boolean)
      .join('\n')
  )
  .join(',\n')}
] as ImportEntry[];

export default combineImportEntries(defaultImportEntries, importMap);
`;
}
