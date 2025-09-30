import * as glob from 'glob';
import fs from 'fs';
import * as ts from 'typescript';

const componentNamePattern = /^[\/]*(.+[\/\\])*(.+)\.[jt]sx?$/;

const componentPathPattern = /^([\/]*.+[\/\\].+)\..+$/;

export type ComponentType = 'server' | 'client' | 'universal';
export type RouterType = 'app' | 'pages';

/**
 * Describes a file that represents a component definition
 * @typedef ComponentFile
 * @property {string} filePath - Path to the component or code file
 * @property {string} importPath - Normalized path that can be used for import statements
 * @property {string} moduleName - Normalized name that can be used as import
 * @property {string} componentName - Name of the code file
 */
export interface ComponentFile {
  filePath: string;
  importPath: string;
  moduleName: string;
  componentName: string;
  componentType?: ComponentType;
}

export interface ComponentFileWithType extends ComponentFile {
  componentType: ComponentType;
}

/**
 * Definition for custom components to be included in component map.
 * Use this to define components imported from modules/dependencies/packages
 * @typedef ComponentImport
 * @property {string} importName - Name of the import.
 * @property {object} importInfo - Information about how to import the package.
 * @property {string} importInfo.importFrom - The path from which to import the component(s).
 * @property {string[]} [importInfo.namedImports] - The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component.
 */
export interface ComponentImport {
  importName: string;
  importInfo: {
    importFrom: string;
    namedImports?: string[];
  };
}

/**
 * Get list of components from @var path
 * Returns a list of components in the following format:
 * {
 *  path: 'path/to/component',
 *  componentName: 'ComponentName',
 *  moduleName: 'ComponentName'
 * }
 * @param {string[]} paths paths to search
 * @param {string[]} [exclude] paths and glob patterns to exclude from final result
 */
export function getComponentList(paths: string[], exclude?: string[]): ComponentFile[] {
  const components = paths.reduce<ComponentFile[]>((result, path) => {
    const globPath =
      glob.hasMagic(path, { magicalBraces: true }) || path.match(componentNamePattern)
        ? path
        : path.replace(/\/$/, '').concat('/**/*.{js,jsx,ts,tsx}');
    return result.concat(
      ...glob
        .sync(globPath, { ignore: exclude, nodir: true })
        .filter((path: string) => path.match(componentNamePattern))
        .map((filePath: string) => {
          const name = filePath.match(componentNamePattern)![2];
          console.debug(`Registering Content SDK component ${name}`);
          return {
            filePath,
            importPath: filePath.match(componentPathPattern)![1].replace(/\\/g, '/'), // use forward slashes for consistency
            componentName: name,
            moduleName: name.replace(/[^\w]+/g, ''),
          };
        })
    );
  }, []);

  return components;
}

export function detectRouterType(projectRoot: string = process.cwd()): RouterType {
  const appDirExists =
    fs.existsSync(`${projectRoot}/src/app`) || fs.existsSync(`${projectRoot}/app`);
  const pagesDirExists =
    fs.existsSync(`${projectRoot}/src/pages`) || fs.existsSync(`${projectRoot}/pages`);

  if (appDirExists) {
    return 'app';
  }

  if (pagesDirExists) {
    return 'pages';
  }

  return 'pages';
}

export function detectComponentType(filePath: string): ComponentType {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Parse using TypeScript AST (following patterns from import-map.ts and utils.ts)
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    let hasUseClientDirective = false;
    let explicitComponentType: ComponentType | null = null;
    let hasServerOnlyImports = false;

    // Track position to ensure directives come before imports/other statements
    let foundFirstNonDirectiveStatement = false;

    // Helper function to check if a node is a valid directive
    const isValidDirective = (node: ts.Node): boolean => {
      return (
        ts.isExpressionStatement(node) &&
        ts.isStringLiteral(node.expression) &&
        !foundFirstNonDirectiveStatement
      );
    };

    // More comprehensive AST traversal (following patterns from import-map.ts and utils.ts)
    const traverseNode = (node: ts.Node) => {
      // Check for 'use client'/'use server' directives (must be at top, before imports)
      if (isValidDirective(node) && ts.isStringLiteral((node as ts.ExpressionStatement).expression)) {
        const directiveText = ((node as ts.ExpressionStatement).expression as ts.StringLiteral).text;
        if (directiveText === 'use client') {
          hasUseClientDirective = true;
          return; // Don't mark as non-directive statement
        }
        if (directiveText === 'use server') {
          explicitComponentType = 'server';
          return; // Don't mark as non-directive statement
        }
      }

      // Mark that we've seen a non-directive statement (imports, declarations, etc.)
      if (ts.isImportDeclaration(node) || ts.isVariableStatement(node) || ts.isFunctionDeclaration(node) || ts.isExportDeclaration(node) || ts.isExportAssignment(node)) {
        foundFirstNonDirectiveStatement = true;
      }

      // Check for import declarations with server-only modules
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier)) {
          const importPath = moduleSpecifier.text;
          // Expand server-only module detection
          if (
            importPath === 'next/headers' ||
            importPath === 'server-only' ||
            importPath === 'next/cache' ||
            importPath === 'next/cookies' ||
            importPath.startsWith('node:') ||
            importPath === 'fs' ||
            importPath === 'path'
          ) {
            hasServerOnlyImports = true;
          }
        }
      }

      // Check for explicit componentType export (improved detection)
      if (ts.isVariableStatement(node)) {
        const hasExportModifier = node.modifiers?.some(
          (modifier: ts.ModifierLike) => modifier.kind === ts.SyntaxKind.ExportKeyword
        );

        if (hasExportModifier) {
          node.declarationList.declarations.forEach((declaration: ts.VariableDeclaration) => {
            if (
              ts.isIdentifier(declaration.name) &&
              declaration.name.text === 'componentType' &&
              declaration.initializer
            ) {
              // Handle string literal
              if (ts.isStringLiteral(declaration.initializer)) {
                const typeValue = declaration.initializer.text as ComponentType;
                if (typeValue === 'server' || typeValue === 'client' || typeValue === 'universal') {
                  explicitComponentType = typeValue;
                }
              }
              // Handle template literal (e.g., `client`)
              else if (ts.isNoSubstitutionTemplateLiteral(declaration.initializer)) {
                const typeValue = declaration.initializer.text as ComponentType;
                if (typeValue === 'server' || typeValue === 'client' || typeValue === 'universal') {
                  explicitComponentType = typeValue;
                }
              }
            }
          });
        }
      }

      // Check for named export of componentType (export const componentType = ...)
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((exportSpecifier: ts.ExportSpecifier) => {
          if (exportSpecifier.name.text === 'componentType') {
            // This would need additional logic to resolve the actual value, but for now
            // we'll rely on the variable declaration detection above
          }
        });
      }

      // Recursively traverse child nodes (following import-map.ts pattern)
      ts.forEachChild(node, traverseNode);
    };

    // Start traversal from the source file (following utils.ts pattern)
    ts.forEachChild(sourceFile, traverseNode);

    // Priority: explicit componentType export > use client/server directives > server-only imports > universal default
    if (explicitComponentType) {
      return explicitComponentType;
    }

    if (hasUseClientDirective) {
      return 'client';
    }

    if (hasServerOnlyImports) {
      return 'server';
    }

    // Default to universal for components that can work in both environments
    return 'universal';

  } catch (error) {
    console.warn(`Failed to parse component file ${filePath}, defaulting to universal:`, error);
    return 'universal';
  }
}

export function getComponentListWithTypes(
  paths: string[],
  exclude?: string[]
): ComponentFileWithType[] {
  const components = getComponentList(paths, exclude);

  return components.map((component) => ({
    ...component,
    componentType: detectComponentType(component.filePath),
  }));
}

export function filterComponentsByType(
  components: ComponentFileWithType[],
  allowedTypes: ComponentType[]
): ComponentFileWithType[] {
  return components.filter((component) => allowedTypes.includes(component.componentType));
}
