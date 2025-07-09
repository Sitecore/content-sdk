import * as ts from 'typescript';
import path from 'path';
import { getFilesList } from './component-utils';
import fs from 'fs';

export type ImportMapEntry = {
  module: string;
  imports: string[];
};

export type GetImportMapArgs = {
  paths: string[];
  exclude?: string[];
};

export type ImportWithAlias = {
  importName: string;
  alias?: string;
};

export type ImportModule = {
  // import { import1, import2 as imp3 }
  namedImports: Map<string, ImportWithAlias>;
  // import coolName or import * as coolName or import coolName as coolerName
  defaultImports: Map<string, ImportWithAlias>;
};

export const parseImportString = (
  importString: string
): ImportWithAlias | ImportWithAlias[] | null => {
  const namedImport = /\{.*\}/g;
  const aliasImport = /^\s*([a-zA-Z0-9]+|\*)\s*as (.+)\s*$/g;
  const regularImport = /^\s*[a-zA-Z0-9]+\s*$/g;

  if (namedImport.test(importString)) {
    // import { import1, import2, import3 as imp ...}
    return importString
      .replace(/[import]*\s*\{/, '')
      .replace(/\}/, '')
      .split(',')
      .reduce<ImportWithAlias[]>((acc, value) => {
        const maybeAlias = aliasImport.exec(value);
        console.log(maybeAlias);
        if (maybeAlias) {
          acc.push({
            importName: maybeAlias[2].trim(),
            alias: maybeAlias[1].trim(),
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

export const resolveLocalModulePath = (fullModulePath: string, appPath?: string) => {
  appPath = appPath || process.cwd();
  // account for imports being done from .sitecore folder
  return `../${path.relative(appPath, fullModulePath).replace(/\\/g, '/')}`;
};

export const getImportMap = (paths: string[]) => {
  const appPath = process.cwd();
  const tsConfig = ts.readConfigFile(path.resolve(appPath, 'tsconfig.json'), ts.sys.readFile);
  if (tsConfig.error) {
    throw new Error(`Error reading tsconfig.json from JSS app root: ${tsConfig.error.messageText}`);
  }

  // store unique import paths and their imports
  const importMapRecord: Map<string, ImportModule> = new Map();

  paths.forEach((codeFilePath) => {
    const codeFileFullPath = path.isAbsolute(codeFilePath)
      ? codeFilePath
      : path.resolve(appPath, codeFilePath);

    const cliCompilerOptions = {
      ...tsConfig.config.compilerOptions,
      baseUrl: appPath,
      allowJs: true,
      target: ts.ScriptTarget.ESNext,
    };

    const tsHost = ts.createCompilerHost(cliCompilerOptions, true);

    const tsCodeSource = tsHost.getSourceFile(codeFileFullPath, ts.ScriptTarget.Latest, (msg) => {
      throw new Error(`Failed to parse ${codeFileFullPath}: ${msg}`);
    });

    if (!tsCodeSource) throw ReferenceError(`Failed to find file ${codeFileFullPath}`);

    // Get rid of type imports and unused imports by compling to JS
    const jsCode = ts.transpileModule(tsCodeSource.getFullText(), {
      compilerOptions: cliCompilerOptions,
    });
    const jsCodeSource = ts.createSourceFile(
      'code.js',
      jsCode.outputText,
      ts.ScriptTarget.ESNext,
      true
    );

    ts.forEachChild(jsCodeSource, (childNode) => {
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
          const localModuleName =
            resolvedFile.indexOf('node_modules') > -1 || resolvedFile.endsWith('.d.ts')
              ? moduleName
              : resolveLocalModulePath(resolvedFile, appPath);
          if (!importMapRecord.has(localModuleName)) {
            importMapRecord.set(localModuleName, {
              namedImports: new Map(),
              defaultImports: new Map(),
            });
          }
          // named imports are array, default are not
          if (Array.isArray(imports)) {
            imports.forEach((value) => {
              const importKey = value.alias || value.importName;
              importMapRecord.get(localModuleName)!.namedImports.set(importKey, value);
            });
          } else {
            const importKey = imports.alias || imports.importName;
            importMapRecord.get(localModuleName)!.defaultImports.set(importKey, imports);
          }
        } else {
          console.warn('Could not resolve a file for import %s', moduleName);
        }
      }
    });
  });

  return importMapRecord;
};

export const writeImportMap = (args: GetImportMapArgs) => {
  return async () => {
    const paths = getFilesList(args.paths, args.exclude);
    const importMapFile = path.join(process.cwd(), '.sitecore', 'import-map.ts');
    console.log(
      `Generating import map for paths: ${paths.join(', ')}. Writing into ${importMapFile}`
    );
    const importMap = getImportMap(paths);
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

export const nextJsMapTemplate = (importMap: Map<string, ImportModule>) => {
  const getSingleImport = (importObj: ImportWithAlias) => {
    const { alias, importName } = importObj;
    return alias ? `${importName} as ${alias}` : importName;
  };

  const convertNamedImports = (namedImports: Map<string, ImportWithAlias>) => {
    return Array.from(namedImports)
      .map(([_, importDef]) => {
        return getSingleImport(importDef);
      })
      .join(', ');
  };

  const importStatements: string[] = [];
  const importMapArray = Array.from(importMap);

  // build import statements first
  for (const [modulePath, imports] of importMapArray) {
    if (imports.namedImports.size > 0) {
      importStatements.push(
        `import { ${convertNamedImports(imports.namedImports)} } from '${modulePath}';`
      );
    }
    if (imports.defaultImports.size > 0) {
      imports.defaultImports.forEach((importEntry) => {
        importStatements.push(`import ${getSingleImport(importEntry)} from '${modulePath}';`);
      });
    }
  }

  // get import map entries after
  const finalImportMap: ImportMapEntry[] = importMapArray.map(([modulePath, imports]) => {
    const defaultImports = Array.from(imports.defaultImports).map(([_, importInfo]) => {
      return importInfo.alias || importInfo.importName;
    });
    const namedImports = Array.from(imports.namedImports).map(([_, importInfo]) => {
      return importInfo.alias || importInfo.importName;
    });
    return {
      module: modulePath,
      imports: [...defaultImports, ...namedImports],
    };
  });

  return `${importStatements.join('\n')}
    
export const importMap = [
${finalImportMap
  .map((entry) =>
    [
      '  {',
      `    module: '${entry.module}',`,
      '    exports: [',
      entry.imports.length
        ? entry.imports
            .map((namedImport) => `      { name: '${namedImport}', value: ${namedImport} }`)
            .join(',\n')
        : '    *',
      '    ]',
      '  }',
    ].join('\n')
  )
  .join(',\n')}
]`;
};
