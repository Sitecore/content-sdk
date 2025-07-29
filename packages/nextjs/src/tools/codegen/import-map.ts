import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import { debug } from '@sitecore-content-sdk/core';
import { getComponentList } from '@sitecore-content-sdk/core/tools';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { ImportEntry } from '@sitecore-content-sdk/core/codegen';
import crypto from 'crypto';

let _getComponentList = getComponentList;
const aliasImport = /^([a-zA-Z0-9]+) as .+$/;

export const unitMocks = ({
  getComponentListStub,
}: {
  getComponentListStub?: typeof getComponentList;
}) => {
  getComponentListStub && (_getComponentList = getComponentListStub);
};

type ExportDefinition = {
  name: string;
  value: string;
};

/**
 * Type describing import map entry in final file
 * Represents structure i.e.
 * {module: '/import-path',
 * exports: [{ name: 'myName1', value: myName1 },..]}
 * Note that string name and implementation (value) name would be the same
 */
export type ImportMapEntry = {
  module: string;
  namedExports: ExportDefinition[];
  defaultExports: ExportDefinition[];
};

/**
 * Args for import map generation
 * Specifies paths to include and exclude when generating imports
 */
export type WriteImportMapArgs = {
  paths: string[];
  scConfig: SitecoreConfig;
  exclude?: string[];
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
 */
export type ModuleExports = {
  // import { import1, import2 as imp3 }
  namedExports: Map<string, string>;
  // import coolName or import * as coolName or import coolName as coolerName
  defaultExports: Map<string, string>;
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

/**
 * Returns unique alias name for import value, if value was already encountered while generating import map
 * @param {string} importName - import value name, i.e. 'myComponent'
 * @param {string} moduleName - import module name, i.e. 'my-module'
 * @param {Map<string, string>} importValuesIndex - Map of import values indexed by their names and modules
 * @returns {string} unique name
 */
const getComponentMapImportValueName = (
  importName: string,
  moduleName: string,
  importValuesIndex: Map<string, string>
) => {
  return importValuesIndex.has(importName) && importValuesIndex.get(importName) !== moduleName
    ? getImportValueAlias(importName, moduleName)
    : importName;
};

// return alias-like name for an import value/variable name
// this helps alleviate duplicate import names in import-map.ts
const getImportValueAlias = (importValue: string, moduleName: string) => {
  const suffix = crypto.hash('sha1', moduleName);
  return `${importValue}_${suffix}`;
};

/**
 * Gets a Map object with import modules and their respective exports present throughout the paths specified
 * @param {string} paths paths to files to be processed for import-map
 * @returns {Map<string, ImportModule>} collection of keys and values, where keys refer to modules being processed and values are collections of exports for each module
 */
export const getImportMap = (paths: string[]) => {
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
  // key = imported value name, value = imported module name
  const importValuesIndex = new Map<string, string>();

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
        if (resolvedImportPath && imports) {
          // if import path points to a file in local app - process import path to the file (i.e. ./myComponent)
          // if it points to node_modules or a file in monorepo - parse import path as dependency module name (i.e. React)
          const importModuleName =
            resolvedImportPath.indexOf('node_modules') > -1 || resolvedImportPath.endsWith('.d.ts')
              ? moduleName
              : resolvedImportPath;
          // Set module import info in the map. If module import exists - add entries to existing entry
          // Otherwise, add new entry
          if (!importMap.has(importModuleName)) {
            importMap.set(importModuleName, {
              namedExports: new Map(),
              defaultExports: new Map(),
            });
          }

          imports.named.forEach((importEntry) => {
            const importValue = getComponentMapImportValueName(
              importEntry,
              importModuleName,
              importValuesIndex
            );
            importMap.get(importModuleName)!.namedExports.set(importEntry, importValue);
            importValuesIndex.set(importEntry, importModuleName);
          });
          if (imports.namespace) {
            const importValue = getComponentMapImportValueName(
              imports.namespace,
              importModuleName,
              importValuesIndex
            );
            importMap.get(importModuleName)!.defaultExports.set('*', importValue);
            importValuesIndex.set(importValue, importModuleName);
          }
          if (imports.default) {
            const importValue = getComponentMapImportValueName(
              imports.default,
              importModuleName,
              importValuesIndex
            );
            importMap.get(importModuleName)!.defaultExports.set(imports.default, importValue);
            importValuesIndex.set(importValue, importModuleName);
          }
        } else {
          console.warn('[Codegen] Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  return importMap;
};

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgs} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration
 * @param {SitecoreConfig} scConfig Sitecore configuration from sitecore.config.ts
 */
export const writeImportMap = (args: WriteImportMapArgs) => {
  return async () => {
    const scConfig = args.scConfig;
    if (scConfig.disableCodeGeneration) {
      debug.common('Skipping import map generation. Code generation functionality is disabled.');
      return;
    }
    const paths = _getComponentList(args.paths, args.exclude).map((entry) => entry.filePath);
    const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
    console.log(
      `[Codegen] Generating import map: ${JSON.stringify({
        paths: args.paths,
        exclude: args.exclude,
      })}.\n Writing into ${importMapFile} ...`
    );
    // get generated map and combine with default one
    const importMap = getImportMap(paths);

    const importMapContent = nextJsMapTemplate(importMap);
    try {
      fs.writeFileSync(importMapFile, importMapContent, {
        encoding: 'utf8',
      });
    } catch (error) {
      console.error(
        `[Codegen] Import Map generation failed. Error writing to file ${importMapFile}:`,
        error
      );
      throw error;
    }
  };
};

/**
 * Builds file contents for component map based on the default template
 * @param {Map<string, ImportModule>} indexedImportMap map to be processed into final component-map.ts file
 * @returns {string} file code for component-map.ts
 */
export const nextJsMapTemplate = (indexedImportMap: Map<string, ModuleExports>) => {
  const getSingleImport = (originalName: string, aliasName: string) => {
    return originalName !== aliasName ? `${originalName} as ${aliasName}` : originalName;
  };

  const convertNamedImports = (namedImports: ExportDefinition[]) => {
    return namedImports
      .map((entry) => {
        return getSingleImport(entry.name, entry.value);
      })
      .join(', ');
  };

  const outputExportEntries = (exports: ExportDefinition[]) => {
    return exports.length
      ? exports
          .map(
            (namedExport) => `      { name: '${namedExport.name}', value: ${namedExport.value} }`
          )
          .join(',\n') + ','
      : '';
  };

  const importStatements: string[] = [];
  const importMapArray = Array.from(indexedImportMap);

  // get import map entries after
  const finalImportMap: ImportMapEntry[] = importMapArray.map(([modulePath, imports]) => {
    const defaultExports = Array.from(imports.defaultExports).map(([name, value]) => {
      return {
        name,
        value,
      };
    });
    const namedExports = Array.from(imports.namedExports).map(([name, value]) => {
      return {
        name,
        value,
      };
    });
    return {
      module: modulePath,
      defaultExports,
      namedExports,
    };
  });

  finalImportMap.forEach((entry) => {
    if (entry.namedExports.length > 0) {
      importStatements.push(
        `import { ${convertNamedImports(entry.namedExports)} } from '${entry.module}';`
      );
    }
    if (entry.defaultExports.length > 0) {
      Array.from(entry.defaultExports).forEach((defaultExportEntry) => {
        importStatements.push(
          `import ${getSingleImport(defaultExportEntry.name, defaultExportEntry.value)} from '${
            entry.module
          }';`
        );
      });
    }
  });

  return `// This file is auto-generated by the Sitecore Content SDK.
// Below are built-in Content SDK imports neccessary for the import map
import { combineImportEntries, defaultImportEntries } from '@sitecore-content-sdk/nextjs/tools';
// end of built-in imports
  
${importStatements.join('\n')}
    
const importMap = [
${finalImportMap
  .map((entry) =>
    [
      '  {',
      `    module: '${entry.module}',`,
      '    exports: [',
      outputExportEntries(entry.namedExports),
      outputExportEntries(entry.defaultExports),
      '    ]',
      '  }',
    ].join('\n')
  )
  .join(',\n')}
];

export default combineImportEntries(defaultImportEntries, importMap);
`;
};

export const combineImportEntries = (
  defaultImportEntries: ImportEntry[],
  generatedImportEntries: ImportEntry[]
): ImportEntry[] => {
  const combinedEntries: ImportEntry[] = [];
  const importMap = new Map<string, ImportEntry>();

  // add generated entries to the map, overwriting existing ones
  generatedImportEntries.forEach((entry) => {
    importMap.set(entry.module, entry);
  });

  // add default entries to the map, if not present
  defaultImportEntries.forEach((defaultEntry) => {
    const mapEntry = importMap.get(defaultEntry.module);
    if (mapEntry) {
      defaultEntry.exports.forEach((defaultExportsEntry) => {
        if (!mapEntry.exports.some((e) => e.name === defaultExportsEntry.name)) {
          mapEntry.exports.push(defaultExportsEntry);
        }
      });
    } else {
      importMap.set(defaultEntry.module, defaultEntry);
    }
  });

  // convert map back to array
  importMap.forEach((value) => {
    combinedEntries.push(value);
  });

  return combinedEntries;
};
