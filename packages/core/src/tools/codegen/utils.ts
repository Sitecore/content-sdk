import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';

/**
 * Description properties for the files sent to the mesh endpoint
 */
export type ExtractedFile = {
  name: string;
  path: string;
  type: ExtractedFileType;
};

/**
 * Type of file to be sent to the mesh endpoint
 */
export enum ExtractedFileType {
  Component = 'component',
  Json = 'json',
  Package = 'package.json',
}

/**
 * Validates consent for code extraction procedures
 * @returns {boolean} - true if consent is given, false otherwise
 */
export const validateConsent = () => {
  if (!process.env.EXTRACT_CONSENT) {
    console.log(chalk.yellow('EXTRACT_CONSENT is not set'));
    return false;
  }
  return true;
};

/**
 * Validates if the current operation is done in Vercel, Netlify or XMCloud
 * deploy context
 * @returns {boolean} - true if in deploy context, false otherwise
 */
export const validateDeployContext = () => {
  if (process.env.NETLIFY && process.env.BUILD_ID) {
    return true;
  }
  // workaround, Vercel does not have variables that are only accessible at build time
  if (process.env.VERCEL && !process.env.VERCEL_REGION) {
    return true;
  }
  if (process.env.SITECORE && process.env.BuildMetadata_BuildId) {
    return true;
  }
  return false;
};

/**
 * Parses the componentBuilder.ts file and returns a map of component names
 * and their respective import strings
 * @param {string} appPath path to the JSS app root
 * @param {object} compilerOptions compiler options from tsconfig.json
 * @param {string} [componentMapPath] path to the app's component map file. Default: 'src/lib/componentMap.ts'
 * @returns map of component names and their respective import strings
 */
export const resolveComponentImportFiles = (
  appPath: string,
  compilerOptions: {
    [key: string]: unknown;
  },
  componentMapPath: string = './src/lib/componentMap.ts'
) => {
  appPath = path.isAbsolute(appPath) ? appPath : path.resolve(process.cwd(), appPath);

  const componentMapFullPath = path.isAbsolute(componentMapPath)
    ? componentMapPath
    : path.resolve(appPath, componentMapPath);

  const cliCompilerOptions = {
    ...compilerOptions,
    baseUrl: appPath,
  };

  const tsHost = ts.createCompilerHost(cliCompilerOptions, true);
  const componentMapSourceFile = tsHost.getSourceFile(
    componentMapFullPath,
    ts.ScriptTarget.Latest,
    (msg) => {
      throw new Error(`Failed to parse ${componentMapFullPath}: ${msg}`);
    }
  );

  if (!componentMapSourceFile) throw ReferenceError(`Failed to find file ${componentMapFullPath}`);
  // this map matches all raw import strings (i.e. * as component) to import strings
  const importStringsMap: Record<string, string> = {};
  // this map will match component names only to full resolved source file paths
  const componentImportsMap: Map<string, string> = new Map();

  let mapExportName: string = '';
  // all new xyz() statements in file
  const newAssignments: ts.Node[] = [];
  // all map.set() assignments in file
  const mapAssignments: ts.CallExpression[] = [];

  // this function will traverse the  map = new Map([/values/]) statement
  // and get the component names registered in map from it
  const traverseNewStatement = (node: ts.Node) => {
    // going through map invocation, we're looking for outer array value
    if (ts.isArrayLiteralExpression(node)) {
      ts.forEachChild(node, (childNode) => {
        // and then parse each individual array pair (i.e. ['MyComp', MyComp])
        if (!ts.isArrayLiteralExpression(childNode)) {
          return;
        }
        const componentKey = childNode.elements[1].getText();
        const componentImport = Object.keys(importStringsMap).find((importStatement) => {
          const matcher = new RegExp(`\\b(${componentKey})\\b`);
          return importStatement.match(matcher) !== null;
        });
        if (componentImport) {
          const componentValue = importStringsMap[componentImport];
          componentImportsMap.set(componentKey, componentValue);
        }
      });
    } else if (node.getChildCount() > 0) {
      ts.forEachChild(node, (childNode) => {
        traverseNewStatement(childNode);
      });
    }
  };

  // step 1: get all import statements, map assignments (map.set) and map inits (map = new Map()) from componentMap file
  ts.forEachChild(componentMapSourceFile, (childNode) => {
    // first, all import statements are parsed
    if (ts.isImportDeclaration(childNode) && childNode.importClause) {
      // import path is extracted
      const moduleName = childNode.moduleSpecifier.getText().replace(/['"]/g, '');
      // unless the import is a nodeJS one, or points to dependency package, resolve full path to the imported source file
      if (moduleName.startsWith('node:') || moduleName.indexOf('/node_modules') > -1) {
        return;
      }
      const resolvedModule = ts.nodeModuleNameResolver(
        moduleName,
        componentMapFullPath,
        cliCompilerOptions,
        tsHost
      );
      const resolvedFile = resolvedModule?.resolvedModule?.resolvedFileName;
      // module imports will be resolved to /node_modules location - we don't support that yet
      if (resolvedFile && resolvedFile.indexOf('node_modules') === -1) {
        importStringsMap[childNode.importClause.getText()] = path.resolve(resolvedFile);
      } else {
        console.warn('Could not resolve a file for import %s', moduleName);
      }
    } else if (ts.isExpressionStatement(childNode)) {
      // parse map assignments (map.set(..)) to get registered components
      ts.forEachChild(childNode, (expressionNode) => {
        if (
          ts.isCallExpression(expressionNode) &&
          expressionNode.expression.getText().indexOf('set') !== -1
        ) {
          // get map.set assignments
          mapAssignments.push(expressionNode);
        }
      });
    } else if (ts.isExportAssignment(childNode)) {
      // get component map export variable
      mapExportName = childNode.expression.getText();
    } else if (childNode.kind === ts.SyntaxKind.FirstStatement) {
      // get potential map = new Map() assignments to extract initial component values from
      newAssignments.push(childNode);
    }
  });

  // step 2: parse map assignments (from map.set and the new Map()) and retrieve import paths
  // only for components registered into component map
  for (const mapAssignment of newAssignments) {
    // parse new Map() statement first
    // only consider variable name for map that is exported
    if (
      // get the (maybe) exported new Map() statement
      // matches i.e. export const map.. / export default const map.. / let map = .. / etc
      mapAssignment
        .getText()
        .match(`^((export )|(export default ))?\\b(var|let|const)\\b\\s{1}\\b(${mapExportName})\\b`)
    ) {
      traverseNewStatement(mapAssignment);
      break;
    }
  }
  for (const mapAssignment of mapAssignments) {
    // only consider the map variable that is exported
    if (mapAssignment.getText().startsWith(mapExportName)) {
      const componentKey = mapAssignment.arguments[1].getText();
      const componentImport = Object.keys(importStringsMap).find((importStatement) => {
        const matcher = new RegExp(`\\b(${componentKey})\\b`);
        return importStatement.match(matcher) !== null;
      });
      if (componentImport) {
        const componentValue = importStringsMap[componentImport];
        componentImportsMap.set(componentKey, componentValue);
      }
    }
  }
  return componentImportsMap;
};

export const sendCode = async ({
  file,
  token,
  edgeUrl,
}: {
  file: ExtractedFile;
  token: string;
  edgeUrl?: string;
}) => {
  const meshEndpoint = `${edgeUrl || SITECORE_EDGE_URL_DEFAULT}/api/v1/mesh`;
  if (!fs.existsSync(file.path)) {
    console.error(chalk.red(`Component file not found: ${file.path}`));
    return;
  }
  const code = fs.readFileSync(file.path);
  const response = await fetch(meshEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: file.name,
      content: code.toString(),
      labels: {
        properties: {
          type: file.type,
        },
      },
    }),
  });

  if (!response.ok) {
    console.error(
      chalk.red(`Failed to send extracted code from ${file.path}: ${response.statusText}`)
    );
  } else {
    console.log(chalk.green(`Code from ${file.path} extracted and sent to mesh endpoint`));
  }
};
