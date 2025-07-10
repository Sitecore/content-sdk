import * as ts from 'typescript';
import path from 'path';
import fs from 'fs';
import { debug } from '@sitecore-content-sdk/core';
import { getComponentList } from '@sitecore-content-sdk/core/tools';
import { SitecoreConfig } from '@sitecore-content-sdk/core/config';
import { xmCloudDeploy } from './utils';
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
  originalName: string;
  exportAlias: string;
  importMapValue: string;
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
 * @typedef ImportWithAlias
 * @property {string} importName - the original name of the import
 * @property {string} [alias] - alias for the import
 */
export type ImportWithAlias = {
  importName: string;
  alias?: string;
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
 * @param {string} importString import definition string
 * @returns {Set<string,string>[]} object(s) with definition name (alias or import) and actual import
 */
export const parseImportString = (
  importString: string
): ImportWithAlias | ImportWithAlias[] | null => {
  const namedImport = /\{.*\}/g;
  const aliasImport = /^\s*([a-zA-Z0-9]+|\*) as (.+)\s*$/g;
  const regularImport = /^\s*[a-zA-Z0-9]+\s*$/g;

  if (namedImport.test(importString)) {
    // import { import1, import2, import3 as imp ...}
    return importString
      .replace(/[import]*\s*\{/, '')
      .replace(/\}/, '')
      .split(',')
      .reduce<ImportWithAlias[]>((acc, value) => {
        const maybeAlias = aliasImport.exec(value);
        if (maybeAlias) {
          acc.push({
            importName: maybeAlias[1].trim(),
            alias: maybeAlias[2].trim(),
          });
        } else {
          acc.push({
            importName: value.trim(),
          });
        }
        return acc;
      }, []);
  } else if (importString.match(aliasImport)) {
    // import * as coolName or import coolName as coolerName
    const importNames = aliasImport.exec(importString);
    return {
      importName: importNames![1].trim(),
      alias: importNames![2].trim(),
    };
  } else if (regularImport.test(importString)) {
    // import coolName
    return {
      importName: importString.trim(),
    };
  }
  console.warn('Cannot parse import string: %s', importString);
  return null;
};

/**
 * Converts a module import path from an import statement to a path relative to .sitecore folder, where import-map will be
 * @param {string} fullModulePath absolute path to imported module
 * @param {string} appPath absolute path to app root
 * @returns {string} path relative to {approot}/.sitecore
 */
export const resolveLocalModulePath = (fullModulePath: string, appPath?: string) => {
  appPath = appPath || process.cwd();
  // account for imports being done from .sitecore folder
  return `../${path.relative(appPath, fullModulePath).replace(/\\/g, '/')}`;
};

/**
 * Gets a Map object with import modules and their respective exports present throughout the paths specified
 * @param {string} paths paths to files to be processed for import-map
 * @returns {Map<string, ImportModule>} collection of keys and values, where keys refer to modules being processed and values are collections of exports for each module
 */
export const getImportMap = (paths: string[]) => {
  // make preparations for handling ts/js files
  const appPath = process.cwd();
  const tsConfig = ts.readConfigFile(path.resolve(appPath, 'tsconfig.json'), ts.sys.readFile);
  const cliCompilerOptions = {
    ...tsConfig.config.compilerOptions,
    baseUrl: appPath,
    allowJs: true,
    target: ts.ScriptTarget.ESNext,
  };
  const tsHost = ts.createCompilerHost(cliCompilerOptions, true);

  if (tsConfig.error) {
    throw new Error(`Error reading tsconfig.json from JSS app root: ${tsConfig.error.messageText}`);
  }

  // we are parsing import statements (import { imports } frim 'import path')
  // we will store and aggregate unique import paths and their imports here
  const importMapRecord: Map<string, ModuleExports> = new Map();

  paths.forEach((codeFilePath) => {
    const codeFileFullPath = path.isAbsolute(codeFilePath)
      ? codeFilePath
      : path.resolve(appPath, codeFilePath);

    // attempt to parse current file to extract imports from
    const tsCodeSource = tsHost.getSourceFile(codeFileFullPath, ts.ScriptTarget.Latest, (msg) => {
      throw new Error(`Failed to parse ${codeFileFullPath}: ${msg}`);
    });

    if (!tsCodeSource) throw ReferenceError(`Failed to find file ${codeFileFullPath}`);

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

    // finally, we parse the final, parsed js code and process import statements
    ts.forEachChild(jsCodeSource, (childNode) => {
      if (ts.isImportDeclaration(childNode) && childNode.importClause) {
        const imports = parseImportString(childNode.importClause.getText());
        // import path is extracted
        const moduleName = childNode.moduleSpecifier.getText().replace(/['"]/g, '');
        const resolvedModule = ts.nodeModuleNameResolver(
          moduleName,
          codeFileFullPath,
          cliCompilerOptions,
          tsHost
        );
        // get import path and check if its import target exists
        const resolvedFile = resolvedModule?.resolvedModule?.resolvedFileName;
        if (resolvedFile && imports) {
          // if import path points to a file in local app - process import path to the file (i.e. ./myComponent)
          // if it points to node_modules or a file in monorepo - parse import path as dependency module name (i.e. React)
          const localModuleName =
            resolvedFile.indexOf('node_modules') > -1 || resolvedFile.endsWith('.d.ts')
              ? moduleName
              : resolveLocalModulePath(resolvedFile, appPath);
          // Set module import info in the map. If module import exists - add entries to existing entry
          // Otherwise, add new entry
          if (!importMapRecord.has(localModuleName)) {
            importMapRecord.set(localModuleName, {
              namedExports: new Map(),
              defaultExports: new Map(),
            });
          }
          // named imports in import statements have many values, default imports do not
          if (Array.isArray(imports)) {
            imports.forEach((value) => {
              const importKey = value.alias || value.importName;
              importMapRecord.get(localModuleName)!.namedExports.set(importKey, value.importName);
            });
          } else {
            const importKey = imports.alias || imports.importName;
            importMapRecord.get(localModuleName)!.defaultExports.set(importKey, imports.importName);
          }
        } else {
          console.warn('Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  return importMapRecord;
};

// return alias-like name for an import value/variable name
// this helps alleviate duplicate import names in import-map.ts
const getImportValueAlias = (importValue: string, moduleName: string) => {
  const prefix = moduleName.replace(/[^0-9a-z]/gi, '').replace(/^src/, '');
  return `${prefix}_${importValue}`;
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
    if (!xmCloudDeploy()) {
      debug.common('Skipping import map generation. Not in XMCloud deploy context.');
      return;
    }
    const paths = _getComponentList(args.paths, args.exclude).map((entry) => entry.filePath);
    const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
    console.log(
      `Generating import map for paths: ${JSON.stringify(
        args
      )}.\n Writing into ${importMapFile} ...`
    );
    // get generated map and combine with default one
    const importMap = getImportMap(paths);

    // populate values from defauly map, if not present already
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
        // if default export (import React from React)
        if (
          defaultMapExportEntry.name.toLowerCase() === defaultMapEntry.module.toLowerCase() &&
          !maybeModuleExportsList.defaultExports.has(defaultMapExportEntry.name)
        ) {
          maybeModuleExportsList.defaultExports.set(
            defaultMapExportEntry.name,
            defaultMapExportEntry.name
          );
        } else if (!maybeModuleExportsList.namedExports.has(defaultMapExportEntry.name)) {
          maybeModuleExportsList.namedExports.set(
            defaultMapExportEntry.name,
            defaultMapExportEntry.name
          );
        }
      });
    });
    const importMapContent = nextJsMapTemplate(importMap);
    try {
      fs.writeFileSync(importMapFile, importMapContent, {
        encoding: 'utf8',
      });
    } catch (error) {
      console.error(`Import Map generation failed. Error writing to file ${importMapFile}:`, error);
      throw error;
    }
  };
};

/**
 * Builds file contents for component map based on the default template
 * @param {Map<string, ImportModule>} importMap map to be processed into final component-map.ts file
 * @returns {string} file code for component-map.ts
 */
export const nextJsMapTemplate = (importMap: Map<string, ModuleExports>) => {
  const getSingleImport = (aliasName: string, originalName: string) => {
    return originalName !== aliasName ? `${originalName} as ${aliasName}` : originalName;
  };

  const convertNamedImports = (namedImports: ExportDefinition[]) => {
    return namedImports
      .map((entry) => {
        return getSingleImport(entry.importMapValue, entry.originalName);
      })
      .join(', ');
  };

  const outputExportEntries = (exports: ExportDefinition[]) => {
    return exports.length
      ? exports
          .map(
            (namedExport) =>
              `      { name: '${namedExport.exportAlias}', value: ${namedExport.importMapValue} }`
          )
          .join(',\n')
      : '';
  };

  const importStatements: string[] = [];
  const importMapArray = Array.from(importMap);

  // get import map entries after
  const finalImportMap: ImportMapEntry[] = importMapArray.map(([modulePath, imports]) => {
    const defaultExports = Array.from(imports.defaultExports).map(([exportAlias, exportName]) => {
      const exportEntryName = exportAlias || exportName;
      return {
        originalName: exportName,
        exportAlias: exportEntryName,
        importMapValue: getImportValueAlias(exportEntryName, modulePath),
      };
    });
    const namedExports = Array.from(imports.namedExports).map(([exportAlias, exportName]) => {
      const exportEntryName = exportAlias || exportName;
      return {
        originalName: exportName,
        exportAlias: exportEntryName,
        importMapValue: getImportValueAlias(exportEntryName, modulePath),
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
          `import ${getSingleImport(
            defaultExportEntry.importMapValue,
            defaultExportEntry.originalName
          )} from '${entry.module}';`
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
