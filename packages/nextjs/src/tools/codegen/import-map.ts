import * as ts from 'typescript';
import path from 'path';
import { getFilesList } from './component-utils';
import fs from 'fs';

export type ImportMapEntry = {
  module: string;
  namedImports: string[];
};

/**
 * {
 *   key(resolvedModule): {
 *     key(localModuleString):{
 *       namedImports: Set<string>
 *     }
 *   }
 * }
 */
export type ImportMapRecord = Record<string, Set<string>>;

export type getImportMapArgs = {
  codePaths: string[];
  exclude: string[];
};

export const parseImportString = (importString: string): string[] | null => {
  const namedImport = /\{.*\}/;
  const wildcardImport = /\* as .*/;
  const aliasImport = /^\s*[a-zA-Z0-9]+(\s*(as .+)\s*)*$/;

  if (namedImport.test(importString)) {
    // import { import1, import2, ...}
    return importString
      .replace(/[import]*\s*\{/, '')
      .replace(/\}/, '')
      .split(',')
      .reduce<string[]>((acc, value) => {
        const importName = parseImportString(value.trim());
        if (importName) {
          acc.push(...importName);
        }
        return acc;
      }, []);
  } else if (wildcardImport.test(importString)) {
    // import * as coolName
    return [importString.replace('* as ', '')];
  } else if (aliasImport.test(importString)) {
    // import coolName[ as coolerName]
    return [importString.replace(/[a-zA-Z0-9]+\s+(as)+/g, '').replace(/\s*/, '')];
  }
  console.warn('Cannot parse import string: %s', importString);
  return null;
};

export const resolveLocalModulePath = (fullModulePath: string, appPath?: string) => {
  appPath = appPath || process.cwd();
  return `./${path.relative(appPath, fullModulePath).replace(/\\/g, '/')}`;
};

export const getImportMap = (paths: string[]) => {
  const appPath = process.cwd();
  const tsConfig = ts.readConfigFile(path.resolve(appPath, 'tsconfig.json'), ts.sys.readFile);
  if (tsConfig.error) {
    throw new Error(`Error reading tsconfig.json from JSS app root: ${tsConfig.error.messageText}`);
  }
  const importMapRecord: ImportMapRecord = {};

  paths.forEach((codeFilePath) => {
    const codeFileFullPath = path.isAbsolute(codeFilePath)
      ? codeFilePath
      : path.resolve(appPath, codeFilePath);

    const cliCompilerOptions = {
      ...tsConfig.config.compilerOptions,
      baseUrl: appPath,
    };

    const tsHost = ts.createCompilerHost(cliCompilerOptions, true);
    const componentMapSourceFile = tsHost.getSourceFile(
      codeFileFullPath,
      ts.ScriptTarget.Latest,
      (msg) => {
        throw new Error(`Failed to parse ${codeFileFullPath}: ${msg}`);
      }
    );

    if (!componentMapSourceFile) throw ReferenceError(`Failed to find file ${codeFileFullPath}`);
    ts.forEachChild(componentMapSourceFile, (childNode) => {
      if (ts.isImportDeclaration(childNode) && childNode.importClause) {
        const imports = parseImportString(childNode.importClause.getText());
        // import path is extracted
        const moduleName = childNode.moduleSpecifier.getText().replace(/['"]/g, '');
        // unless the import is a nodeJS one, or points to dependency package, resolve full path to the imported source file
        if (moduleName.startsWith('node:') || moduleName.indexOf('/node_modules') > -1) {
          return;
        }
        const resolvedModule = ts.nodeModuleNameResolver(
          moduleName,
          codeFileFullPath,
          cliCompilerOptions,
          tsHost
        );
        const resolvedFile = resolvedModule?.resolvedModule?.resolvedFileName;
        // module imports will be resolved to /node_modules location - we don't support that yet
        if (resolvedFile && imports) {
          // TODO: take tsconfig into account
          const localModuleName = resolvedFile.indexOf('node_modules') > -1 ? moduleName : resolveLocalModulePath(resolvedFile, appPath);
          if (importMapRecord[localModuleName]) {
            imports.forEach((value) => {
              importMapRecord[localModuleName].add(value);
            });
          } else {
            importMapRecord[localModuleName] = new Set(imports);
          }
        } else {
          console.warn('Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  return Object.keys(importMapRecord).map((modulePath) => {
    return {
      module: modulePath,
      namedImports: Array.from(importMapRecord[modulePath]),
    };
  });
};

export const writeImportMap = (args: getImportMapArgs) => {
  const paths = getFilesList(args.codePaths, args.exclude);
  const importMap = getImportMap(paths);
  const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
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

export const nextJsMapTemplate = (importMap: ImportMapEntry[]) => {
  const importStatements = importMap.map((entry) => {
    const namedImports = entry.namedImports.length ? `{ ${entry.namedImports.join(', ')} }` : '*';
    return `import ${namedImports} from '${entry.module}';`;
  });

  return `${importStatements.join('\n')}
    
    export const importMap = [
        ${importMap
          .map(
            (entry) =>
              `  {
                    module: '${entry.module}', exports: [
                        ${entry.namedImports
                          .map(
                            (namedImport) => `    { name: '${namedImport}', value: ${namedImport} }`
                          )
                          .join(',\n        ')},]}`
          )
          .join(',\n        ')}
    ]
    `;
};
