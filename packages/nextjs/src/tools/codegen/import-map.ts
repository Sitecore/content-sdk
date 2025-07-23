import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import { debug } from '@sitecore-content-sdk/core';
import { getComponentList } from '@sitecore-content-sdk/core/tools';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import crypto from 'crypto';
import { defaultImportEntries, ImportEntry } from './default-import-map';

let _defaultImportEntries = defaultImportEntries;
let _getComponentList = getComponentList;

export const unitMocks = ({
  mockDefaultImportEntries,
  getComponentListStub,
}: {
  mockDefaultImportEntries?: ImportEntry[];
  getComponentListStub?: typeof getComponentList;
}) => {
  mockDefaultImportEntries && (_defaultImportEntries = mockDefaultImportEntries);
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
  exclude?: string[];
};

/**
 * Import names definition
 * @typedef ImportName
 * @property {string} name - the original name of the import
 * @property {boolean} [isWildcard] - if import is a wildcard import (import * as name from 'module')
 */
export type ImportName = {
  name: string;
  isWildcard?: boolean;
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
 * Gets an import string and outputs import info with aliases, if present
 * @param {ts.ImportDeclaration} importNode import definition node
 * @returns {ImportName[] | ImportName | null} object(s) with definition name
 */
export const getImportedValues = (
  importNode: ts.ImportDeclaration
): ImportName[] | ImportName | null => {
  const importClause = importNode.importClause?.getText();
  const aliasImport = /^([a-zA-Z0-9]+) as .+$/g;
  const namespaceImport = /^\* as (.+)$/g;

  if (!importClause) {
    console.warn('Cannot parse import string from: %s', importNode.getText());
    return null;
  }
  if (/^\{.*\}$/.test(importClause)) {
    // import { a, b, c } from ..
    // could use getChildren().map() but https://github.com/microsoft/TypeScript/issues/62112
    const result: ImportName[] = [];
    importNode.importClause!.namedBindings!.forEachChild((child) => {
      const importText = child.getText();
      const aliasMatch = aliasImport.exec(importText); // importText.match(aliasImport);
      result.push({ name: aliasMatch ? aliasMatch[1] : importText });
    });
    return result;
  } else if (importClause.match(namespaceImport)) {
    // import * as coolName from ..
    return {
      name: namespaceImport.exec(importClause)![1],
      isWildcard: true,
    };
  } else {
    // import coolName from ..
    return {
      name: importClause,
    };
  }
};

/**
 * Returns unique alias name for import value, if value was already encountered
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
  const prefix = crypto.hash('sha1', moduleName);
  return `${prefix}_${importValue}`;
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

          // named imports in import statements have many values, default imports do not
          if (Array.isArray(imports)) {
            imports.forEach((importEntry) => {
              // use unique import value name if we encountered import with same name before, from another module
              const importValue = getComponentMapImportValueName(
                importEntry.name,
                importModuleName,
                importValuesIndex
              );
              importMap.get(importModuleName)!.namedExports.set(importEntry.name, importValue);
              importValuesIndex.set(importEntry.name, importModuleName);
            });
          } else {
            const importValue = getComponentMapImportValueName(
              imports.name,
              importModuleName,
              importValuesIndex
            );
            const importName = imports.isWildcard ? '*' : imports.name;
            importMap.get(importModuleName)!.defaultExports.set(importName, importValue);
            importValuesIndex.set(importValue, importModuleName);
          }
        } else {
          console.warn('[Codegen] Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  // pull values from default import map that weren't added yet
  _defaultImportEntries.forEach((defaultMapEntry) => {
    let maybeModuleExportsList = importMap.get(defaultMapEntry.module);

    if (!maybeModuleExportsList) {
      maybeModuleExportsList = {
        namedExports: new Map(),
        defaultExports: new Map(),
      };
      importMap.set(defaultMapEntry.module, maybeModuleExportsList);
    }
    // if module entry from default map is already present
    defaultMapEntry.exports.forEach((defaultMapExportEntry) => {
      const importModuleName = defaultMapEntry.module;
      const importValue = getComponentMapImportValueName(
        defaultMapExportEntry.name,
        importModuleName,
        importValuesIndex
      );
      // if default export (import React from 'react')
      if (
        defaultMapExportEntry.name.toLowerCase() === importModuleName.toLowerCase() &&
        !maybeModuleExportsList.defaultExports.has(defaultMapExportEntry.name)
      ) {
        maybeModuleExportsList.defaultExports.set(defaultMapExportEntry.name, importValue);
      } else if (!maybeModuleExportsList.namedExports.has(defaultMapExportEntry.name)) {
        maybeModuleExportsList.namedExports.set(defaultMapExportEntry.name, importValue);
      }
      importValuesIndex.set(importValue, importModuleName);
    });
  });

  return importMap;
};

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgs} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration
 * @param {SitecoreConfig} scConfig Sitecore configuration from sitecore.config.ts
 */
export const writeImportMap = (args: WriteImportMapArgs, scConfig: SitecoreConfig) => {
  return async () => {
    if (scConfig.disableCodeGeneration) {
      debug.common('Skipping import map generation. Code generation functionality is disabled.');
      return;
    }
    const paths = _getComponentList(args.paths, args.exclude).map((entry) => entry.filePath);
    const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
    console.log(
      `[Codegen] Generating import map for paths: ${JSON.stringify(
        args
      )}.\n Writing into ${importMapFile} ...`
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
          .join(',\n')
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

  return `${importStatements.join('\n')}
    
export const importMap = [
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
`;
};
