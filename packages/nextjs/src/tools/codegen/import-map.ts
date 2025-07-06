import * as ts from 'typescript';
import path from 'path';
import { getFilesList } from './component-utils';
import fs from 'fs';

export type ImportMapEntry = {
  module: string;
  namedExports: string[];
};

const namedImportPattern = /import \{.*\}/;
const wildcardImportsPattern = /import \* as .*/;

const parseImportString = (importString: string): string => {
  if (namedImportPattern.test(importString)) {
    // named imports
    return importString
      .replace(/import\s*\{/, '')
      .replace(/\}\s*from\s*/, ',')
      .replace(/['"]/g, '');
  }
  if (wildcardImportsPattern.test(importString)) {
    // wildcard imports
    return '*';
  }
  return importString.replace(/import\s*/, '').replace(/['"]/g, '');
};

/**
 * {
 *   key(resolvedModule): {
 *     key(localModuleString):{
 *       namedExports: Set<string>
 *     }
 *   }
 * }
 */
export type ImportMapRecord = Record<string, Record<string, Set<string>>>;

export type getImportMapArgs = {
  codePaths: string[];
  exclude: string[];
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
        const importClause = parseImportString(childNode.importClause.getText());
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
        if (resolvedFile) {
          if (importMapRecord[resolvedFile]) {
            if (importMapRecord[resolvedFile][moduleName]) {
              importClause
                .replace(/\s*/g, '')
                .split(',')
                .forEach((value) => {
                  importMapRecord[resolvedFile][moduleName].add(value);
                });
            } else {
              importMapRecord[resolvedFile][moduleName] = new Set(
                importClause.replace(/\s*/g, '').split(',')
              );
            }
          } else {
            importMapRecord[resolvedFile] = {};
            importMapRecord[resolvedFile][moduleName] = new Set(
              importClause.replace(/\s*/g, '').split(',')
            );
          }
        } else {
          console.warn('Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  return importMapRecord;
};

export const writeImportMap = (args: getImportMapArgs) => {
  const paths = getFilesList(args.codePaths, args.exclude);
  const importMap = getImportMap(paths);
  const convertedImportMap: ImportMapEntry[] = Object.keys(importMap).map((entry) => {
    const finalSet = Object.values(importMap[entry]).reduce<string[]>((acc, value) => {
      acc.push(...Array.from(value));
      return acc;
    }, []);
    return {
      module: entry,
      namedExports: finalSet,
    };
  });
  const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
  const importMapContent = `export const importMap = ${JSON.stringify(
    convertedImportMap,
    null,
    2
  )};\n`;
  try {
    fs.writeFileSync(importMapFile, importMapContent, {
      encoding: 'utf8',
    });
  } catch (error) {
    console.error(`Import Map generation failed. Error writing to file ${importMapFile}:`, error);
    throw error;
  }
};
