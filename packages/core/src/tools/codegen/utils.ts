import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';

export const validateConsent = () => {
  if (!process.env.EXTRACT_CONSENT) {
    throw new Error('Skipping code extraction, EXTRACT_CONSENT is not set');
  }
};

export const validateBuildContext = () => {
  if (process.env.NETLIFY && process.env.BUILD_ID) {
    return;
  }
  // workaround, Vercel does not have variables that are only accessible at build time
  if (process.env.VERCEL && !process.env.VERCEL_REGION) {
    return;
  }
  if (process.env.SITECORE && process.env.BuildMetadata_BuildId) {
    return;
  }
  throw new Error('Skipping code extraction, not in build context');
};

export const resolveComponentImportFiles = (
  appPath: string,
  compilerOptions: {
    [key: string]: unknown;
  },
  componentMapPath: string = 'src/lib/componentMap.ts'
) => {
  appPath = path.isAbsolute(appPath) ? appPath : path.resolve(process.cwd(), appPath);

  const componentMapFullPath = path.resolve(appPath, componentMapPath);

  const cliCompilerOptions = {
    ...compilerOptions,
    baseUrl: appPath,
  };

  const tsHost = ts.createCompilerHost(cliCompilerOptions, true);
  const sourceFile = tsHost.getSourceFile(componentMapFullPath, ts.ScriptTarget.Latest, (msg) => {
    throw new Error(`Failed to parse ${componentMapFullPath}: ${msg}`);
  });

  if (!sourceFile) throw ReferenceError(`Failed to find file ${componentMapFullPath}`);

  const componentImportsMap: Map<string, string> = new Map();
  const importNodesMap: Record<string, string> = {};
  let mapExportName: string = '';
  const newAssignments: ts.Node[] = [];

  const traverseNewStatement = (node: ts.Node) => {
    if (ts.isArrayLiteralExpression(node)) {
      ts.forEachChild(node, (childNode) => {
        if (ts.isArrayLiteralExpression(childNode)) {
          const componentKey = childNode.elements[1].getText();
          const componentImport = Object.keys(importNodesMap).find((importStatement) => {
            const matcher = new RegExp(`\\b(${componentKey})\\b`);
            return importStatement.match(matcher) !== null;
          });
          if (componentImport) {
            console.log(`${componentKey} - ${componentImport}`);
            const componentValue = importNodesMap[componentImport];
            componentImportsMap.set(componentKey, componentValue);
          }
        }
      });
    } else if (node.getChildCount() > 0) {
      ts.forEachChild(node, (childNode) => {
        traverseNewStatement(childNode);
      });
    }
  };

  ts.forEachChild(sourceFile, (childNode) => {
    if (ts.isImportDeclaration(childNode)) {
      if (childNode.importClause) {
        const moduleName = childNode.moduleSpecifier.getText().replace(/['"]/g, '');
        if (!moduleName.startsWith('node:') && moduleName.indexOf('/node_modules') === -1) {
          const resolvedModule = ts.nodeModuleNameResolver(
            moduleName,
            componentMapFullPath,
            cliCompilerOptions,
            tsHost
          );
          const resolvedFile = resolvedModule?.resolvedModule?.resolvedFileName;
          // module imports will be resolved to /node_modules location - we don't support that yet
          if (resolvedFile && resolvedFile.indexOf('node_modules') === -1) {
            // gotta use OS-agnostic path
            importNodesMap[childNode.importClause.getText()] = path.resolve(resolvedFile);
          } else {
            console.warn('Could not resolve a file for import %s', moduleName);
          }
        }
      }
    } else if (ts.isExportAssignment(childNode)) {
      // get component map export variable
      mapExportName = childNode.expression.getText();
    } else if (childNode.kind === ts.SyntaxKind.FirstStatement) {
      // get potential map = new Map() assignments
      newAssignments.push(childNode);
    }
  });

  for (const mapAssignment of newAssignments) {
    // only consider exported map
    if (
      mapAssignment
        .getText()
        .match(`^((export )|(export default ))?\\b(var|let|const)\\b\\s{1}\\b(${mapExportName})\\b`)
    ) {
      traverseNewStatement(mapAssignment);
      break;
    }
  }
  return componentImportsMap;
};

export const sendCode = async ({
  componentName,
  componentPath,
  token,
  edgeUrl,
}: {
  componentName: string;
  componentPath: string;
  token: string;
  edgeUrl?: string;
}) => {
  const meshEndpoint = `${edgeUrl || SITECORE_EDGE_URL_DEFAULT}/api/v1/mesh`;
  if (!fs.existsSync(componentPath)) {
    console.error(chalk.red(`Component file not found: ${componentPath}`));
    return;
  }
  const code = fs.readFileSync(componentPath);
  const response = await fetch(meshEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      componentName,
      code: code.toString(),
    }),
  });

  if (!response.ok) {
    console.error(
      chalk.red(`Failed to send extracted code from ${componentPath}: ${response.statusText}`)
    );
  } else {
    console.log(chalk.green(`Code from ${componentPath} extracted and sent to mesh endpoint`));
  }
};
