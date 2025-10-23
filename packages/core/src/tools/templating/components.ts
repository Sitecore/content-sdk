import * as glob from 'glob';
import fs from 'fs';
import * as ts from 'typescript';

export let getComponentList = _getComponentList;

export const componentUnitMocks = {
  set getComponentList(mockImplementation) {
    getComponentList = mockImplementation;
  },
  get getComponentList() {
    return _getComponentList;
  },
};

const componentNamePattern = /^[\/]*(.+[\/\\])*(.+)\.[jt]sx?$/;

const componentPathPattern = /^([\/]*.+[\/\\].+)\..+$/;

export type ComponentType = 'server' | 'client' | 'universal';
export type RouterType = 'app' | 'pages';

export type ComponentMapTemplate = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports?: ComponentImport[]
) => string;

export type EnhancedComponentMapTemplate = (
  components: (ComponentFile | ComponentFileWithType)[],
  componentImports: ComponentImport[] | undefined,
  ctx: {
    entries: ComponentMapEntry[];
    includeVariants: boolean;
    isClientMap: boolean;
  }
) => string;

/*
 * An entry in the component map, including import lines and value expression.
 */
export type ComponentMapEntry = {
  /** map entry key */
  key: string;
  /** namespace import lines needed for this entry */
  imports: string[];
  /** whether base is client (and we're in main map) */
  annotateClient: boolean;
  /** expression used as the map value */
  valueExpr: string;
};

/**
 * Definition for a component file
 */
export interface ComponentFile {
  /** The original file path of the component */
  filePath: string;
  /** Normalized path that can be used for import statements */
  importPath: string;
  /** Normalized name that can be used as import */
  moduleName: string;
  /** Name of the code file */
  componentName: string;
  /** Detected component type (server, client, or universal) */
  componentType?: ComponentType;
}

/*
 * Definition for a component file with guaranteed componentType
 */
export interface ComponentFileWithType extends ComponentFile {
  /** Detected component type (server, client, or universal) */
  componentType: ComponentType;
}

/**
 * Definition for custom components to be included in component map.
 * Use this to define components imported from modules/dependencies/packages
 */
export interface ComponentImport {
  /** The name of the import (e.g., 'MyComponent')*/
  importName: string;
  /** Information about how to import the package */
  importInfo: {
    /** The path from which to import the component(s) */
    importFrom: string;
    /** The specific named components to import from the package. Leave empty to have whole package be imported as wildcard and allow SXA variants support for component. */
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
 * @param {boolean} [includeVariants] whether to include variant components
 */
function _getComponentList(
  paths: string[],
  exclude?: string[],
  includeVariants?: boolean
): ComponentFile[] {
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
          return {
            filePath,
            importPath: filePath.match(componentPathPattern)![1].replace(/\\/g, '/'), // use forward slashes for consistency
            componentName: name,
            moduleName: name.replace(/[^\w]+/g, ''),
          };
        })
    );
  }, []);

  return includeVariants
    ? components
    : components.filter((component) => !component.componentName.includes('.'));
}

/**
 * Detects the Next.js router type (App Router or Pages Router) based on directory structure.
 * @param {string} projectRoot - The project root directory. Defaults to current working directory.
 * @returns {RouterType} 'app' if App Router is detected, 'pages' otherwise
 */
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

/**
 * Detects the component type based on directives, imports, and router context.
 * - Checks for 'use client' directive
 * - Checks for explicit componentType export
 * - Checks for server-only imports (next/headers, etc.)
 * - Defaults to 'server' for App Router, 'universal' for Pages Router
 * @param {string} filePath - Path to the component file
 * @param {RouterType} [routerType] - Optional router type override. Auto-detected if not provided.
 * @returns {ComponentType} 'server', 'client', or 'universal'
 */
export function detectComponentType(filePath: string, routerType?: RouterType): ComponentType {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Parse using TypeScript AST (following patterns from import-map.ts and utils.ts)
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

    let hasUseClientDirective = false;
    let explicitComponentType: ComponentType | null = null;
    let hasServerOnlyImports = false;

    // Auto-detect router type if not provided
    const detectedRouterType = routerType || detectRouterType();

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
      if (
        isValidDirective(node) &&
        ts.isStringLiteral((node as ts.ExpressionStatement).expression)
      ) {
        const directiveText = ((node as ts.ExpressionStatement).expression as ts.StringLiteral)
          .text;
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
      if (
        ts.isImportDeclaration(node) ||
        ts.isVariableStatement(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isExportDeclaration(node) ||
        ts.isExportAssignment(node)
      ) {
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
      if (
        ts.isExportDeclaration(node) &&
        node.exportClause &&
        ts.isNamedExports(node.exportClause)
      ) {
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

    // Router-aware defaults:
    // - App Router: defaults to server (RSC by default)
    // - Pages Router: defaults to universal (isomorphic by default)
    if (detectedRouterType === 'app') {
      return 'server';
    } else {
      return 'universal';
    }
  } catch (error) {
    console.warn(`Failed to parse component file ${filePath}, defaulting to universal:`, error);
    return 'universal';
  }
}

/**
 * Get list of components with detected types (server, client, or universal).
 * @param {string[]} paths - Paths to search for components
 * @param {string[]} [exclude] - Paths and glob patterns to exclude from final result
 * @param {boolean} includeVariants - Whether to include variant components
 * @param {RouterType} [routerType] - Optional router type override for type detection. Auto-detected if not provided.
 * @returns {ComponentFileWithType[]} Array of components with their detected types
 */
export function getComponentListWithTypes(
  paths: string[],
  exclude?: string[],
  includeVariants?: boolean,
  routerType?: RouterType
): ComponentFileWithType[] {
  const components = getComponentList(paths, exclude, includeVariants);
  const detectedRouterType = routerType || detectRouterType();

  return components.map((component) => ({
    ...component,
    componentType: detectComponentType(component.filePath, detectedRouterType),
  }));
}

/**
 * Filters components by their detected type.
 * @param {ComponentFileWithType[]} components - Array of components with types
 * @param {ComponentType[]} allowedTypes - Array of allowed component types to filter by
 * @returns {ComponentFileWithType[]} Filtered array containing only components matching allowed types
 */
export function filterComponentsByType(
  components: ComponentFileWithType[],
  allowedTypes: ComponentType[]
): ComponentFileWithType[] {
  return components.filter((component) => allowedTypes.includes(component.componentType));
}
