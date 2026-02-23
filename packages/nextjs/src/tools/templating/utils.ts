import {
  ComponentFileWithType,
  ComponentType,
  getComponentList,
  RouterType,
} from '@sitecore-content-sdk/core/tools';
import ts from 'typescript';
import fs from 'fs';
import { defaultImportMapTemplate, ModuleExports } from '@sitecore-content-sdk/core/tools';

/**
 * Detects the Next.js router type (App Router or Pages Router) based on directory structure.
 * @param {string} projectRoot - The project root directory. Defaults to current working directory.
 * @returns {RouterType} 'app' if App Router is detected, 'pages' otherwise
 * @internal
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
 * @internal
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
 * @internal
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
 * React-specific import map template with 'use client' directive. Used in App Router.
 * @param {Map<string, ModuleExports>} indexedImportMap import map to be processed into final import-map.client.ts file
 * @returns {string} contents for resulting import map file
 */
export function nextjsClientMapTemplate(indexedImportMap: Map<string, ModuleExports>) {
  return `'use client';
  ${defaultImportMapTemplate(indexedImportMap, 'nextjs')}`;
}

/**
 * React-specific import map template for server side imports only. Used in App Router.
 * @param {Map<string, ModuleExports>} indexedImportMap import map to be processed into final import-map.server.ts file
 * @returns {string} contents for resulting import map file
 */
export function nextjsServertMapTemplate(indexedImportMap: Map<string, ModuleExports>) {
  return defaultImportMapTemplate(indexedImportMap, 'nextjs', 'defaultServerImportEntries');
}

/**
 * React-specific import map template. Used in Pages Router.
 * @param {Map<string, ModuleExports>} indexedImportMap import map to be processed into final import-map.client.ts file
 * @returns {string} contents for resulting import map file
 */
export function nextjsDefaultMapTemplate(indexedImportMap: Map<string, ModuleExports>) {
  return defaultImportMapTemplate(indexedImportMap, 'nextjs');
}
