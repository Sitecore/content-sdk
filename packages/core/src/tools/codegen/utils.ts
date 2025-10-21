/* eslint-disable jsdoc/require-jsdoc */
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as ts from 'typescript';
import debug from './../../debug';

/**
 * Parse the generated component-map file and return all referenced modules
 * per map entry (handles both single identifiers and spread objects).
 * @param {string} appRoot path to the JSS app root
 * @param {string} componentMapPath path to the component map file
 * @returns map of component names and their respective import strings
 */
export let resolveComponentImportFiles = _resolveComponentImportFiles;

/**
 * Reads the named exports from a TypeScript file.
 * @param {ExtractedFile} filePath absolute path to a .ts/.tsx file
 * @returns {string[]} list of named exports found in the file
 */
export let readNamedExports = _readNamedExports;

/**
 * Sends the extracted code to the specified target URL.
 * @param {object} params - The parameters object.
 * @param {ExtractedFile} params.file - The file to be sent.
 * @param {string} params.token - The access token for authentication.
 * @param {string} params.targetUrl - The target URL to send the file to.
 * @param {Record<string, unknown>} [params.extraLabels] - Additional labels to include in the payload.
 * @returns {Promise<string | null>} - The path of the sent file or null if sending failed.
 */
export let sendCode = _sendCode;

export const utilsUnitMocks = {
  set xmCloudDeploy(mockImpl: () => boolean) {
    utils.xmCloudDeploy = mockImpl;
  },
  get xmCloudDeploy() {
    return _xmCloudDeploy;
  },
  set resolveComponentImportFiles(mockImpl) {
    resolveComponentImportFiles = mockImpl;
  },
  get resolveComponentImportFiles() {
    return _resolveComponentImportFiles;
  },
  set readNamedExports(mockImpl) {
    readNamedExports = mockImpl;
  },
  get readNamedExports() {
    return _readNamedExports;
  },
  set sendCode(mockImpl) {
    sendCode = mockImpl;
  },
  get sendCode() {
    return _sendCode;
  },
};

/**
 * Description properties for the files sent to the mesh endpoint
 */
export type ExtractedFile = {
  name: string;
  path: string;
  type: ExtractedFileType;
  labels?: Record<string, unknown>;
};

/**
 * Type of file to be sent to the mesh endpoint
 */
export enum ExtractedFileType {
  Component = 'component',
  Variant = 'variant',
  Json = 'json',
  PackageJson = 'package.json',
}

export type ResolvedImport = {
  componentKey: string; // map key, e.g. 'PromoBlock'
  filePath: string; // absolute file path to source (with extension)
  fileType: ExtractedFileType;
};

export const utils: {
  xmCloudDeploy: () => boolean;
} = {
  xmCloudDeploy: (...args) => _xmCloudDeploy(...args),
};

export const _xmCloudDeploy = () => !!process.env.SITECORE && !!process.env.SITECORE_BUILD;

// workaround, Vercel does not have variables that are only accessible at build time
const vercelDeploy = () => !!process.env.VERCEL && !process.env.VERCEL_REGION;
const netlifyDeploy = () => !!process.env.NETLIFY && !!process.env.BUILD_ID;

/**
 * Validates if the current operation is done in Vercel, Netlify or XMCloud
 * deploy context
 * @returns {boolean} - true if in deploy context, false otherwise
 */
export function validateDeployContext() {
  return _xmCloudDeploy() || vercelDeploy() || netlifyDeploy();
}

/*
 * Load and parse the tsconfig.json file from the specified app path.
 */
function loadCompilerOptions(appPathAbs: string): ts.CompilerOptions {
  const configPath = ts.findConfigFile(appPathAbs, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    // Sane defaults if no tsconfig exists
    return {
      jsx: ts.JsxEmit.Preserve,
      allowJs: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      target: ts.ScriptTarget.ES2020,
      baseUrl: appPathAbs,
      noEmit: true,
    };
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(`Error reading tsconfig at ${configPath}: ${configFile.error.messageText}`);
  }

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));

  // Merge with a few safe fallbacks/overrides
  return {
    jsx: ts.JsxEmit.Preserve,
    allowJs: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2020,
    baseUrl: appPathAbs,
    noEmit: true,
    ...parsed.options,
  };
}

/*
 * Resolve a module specifier using tsconfig options (fast, no Program needed).
 */
function resolveWithTs(spec: string, fromFile: string, options: ts.CompilerOptions): string | null {
  const host: ts.ModuleResolutionHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    directoryExists: ts.sys.directoryExists,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getDirectories: ts.sys.getDirectories,
    realpath: ts.sys.realpath,
  };
  const result = ts.resolveModuleName(spec, fromFile, options, host);
  return result.resolvedModule?.resolvedFileName ?? null;
}

function _resolveComponentImportFiles(
  appRoot: string,
  componentMapPath: string = './.sitecore/component-map.ts'
): ResolvedImport[] {
  const appPath = path.isAbsolute(appRoot) ? appRoot : path.resolve(process.cwd(), appRoot);
  const mapPath = path.isAbsolute(componentMapPath)
    ? componentMapPath
    : path.resolve(appPath, componentMapPath);

  // 1) Load tsconfig (simple + safe). Use appPath as baseUrl fallback.
  const compilerOptions = loadCompilerOptions(appPath);

  // Read & parse the map file to an AST (SourceFile)
  const mapText = fs.readFileSync(mapPath, 'utf8');
  const source = ts.createSourceFile(mapPath, mapText, ts.ScriptTarget.Latest, true);

  const getFileType = (absPath: string): ExtractedFileType => {
    const base = path.basename(absPath); // e.g., "PromoBlock.extra.tsx"
    const name = base.replace(/\.[^.]+$/, ''); // -> "PromoBlock.extra"
    return name.includes('.') ? ExtractedFileType.Variant : ExtractedFileType.Component;
  };

  // 1) Collect namespace imports: Identifier -> module specifier string
  const nameSpaceImports = new Map<string, string>();
  source.forEachChild((node) => {
    if (
      ts.isImportDeclaration(node) &&
      node.importClause &&
      node.importClause.namedBindings &&
      ts.isNamespaceImport(node.importClause.namedBindings)
    ) {
      const ident = node.importClause.namedBindings.name.text;
      const spec = (node.moduleSpecifier as ts.StringLiteral).text;
      nameSpaceImports.set(ident, spec);
    }
  });

  // 2) Find the map literal: new Map([...]) and collect entries
  //    Also capture subsequent mutations: <mapIdent>.set('Key', Value)
  const results: ResolvedImport[] = [];
  const mapIdentifiers = new Set<string>(); // all identifiers bound to the Map we care about

  // Given a component key and an expression (identifier or object literal with spreads),
  // resolve the module(s) to absolute file paths and append normalized entries to `results`.
  const resolveAndRecordEntry = (componentKey: string, expr: ts.Expression) => {
    // Case A: ['Key', Identifier]
    if (ts.isIdentifier(expr)) {
      const modName = expr.text;
      const spec = nameSpaceImports.get(modName);
      if (!spec) return;
      const fileAbs = resolveWithTs(spec, mapPath, compilerOptions);
      if (!fileAbs) return;
      results.push({
        componentKey,
        filePath: toPosixPath(fileAbs),
        fileType: getFileType(fileAbs),
      });
      return;
    }

    // Case B: ['Key', { ...A, ...B, ...C }]
    if (ts.isObjectLiteralExpression(expr)) {
      expr.properties.forEach((prop) => {
        if (ts.isSpreadAssignment(prop) && ts.isIdentifier(prop.expression)) {
          const modName = prop.expression.text;
          const spec = nameSpaceImports.get(modName);
          if (!spec) return;
          const fileAbs = resolveWithTs(spec, mapPath, compilerOptions);
          if (!fileAbs) return;
          results.push({
            componentKey,
            filePath: toPosixPath(fileAbs),
            fileType: getFileType(fileAbs),
          });
        }
      });
    }
  };

  // Walk the `new Map([...])` array literal and feed each ['Key', Value] into
  // `resolveAndRecordEntry` (only when the key is a string literal).
  const collectArrayEntries = (arrayArg: ts.ArrayLiteralExpression) => {
    arrayArg.elements.forEach((el) => {
      if (ts.isArrayLiteralExpression(el)) {
        const [keyNode, valNode] = el.elements;
        if (keyNode && valNode && ts.isStringLiteral(keyNode)) {
          resolveAndRecordEntry(keyNode.text, valNode as ts.Expression);
        }
      }
    });
  };

  // If this `new Map([...])` is bound to a variable (via decl or assignment),
  // record the identifier name so we can catch later `<id>.set(...)` mutations.
  const captureMapIdentifier = (node: ts.NewExpression) => {
    // const m = new Map([...])
    const parent = node.parent;

    // Variable declaration with initializer new Map(...)
    if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      mapIdentifiers.add(parent.name.text);
      return;
    }

    // Assignment: m = new Map([...])
    if (
      parent &&
      ts.isBinaryExpression(parent) &&
      parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(parent.left)
    ) {
      mapIdentifiers.add(parent.left.text);
      return;
    }

    // Exported variable declaration: export const componentMap = new Map([...])
    if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
      mapIdentifiers.add(parent.name.text);
      return;
    }
  };

  const traverseAst = (node: ts.Node) => {
    // A) Initial literal: new Map([...])
    if (
      ts.isNewExpression(node) &&
      node.expression.getText(source) === 'Map' &&
      node.arguments &&
      node.arguments.length > 0
    ) {
      const firstArg = node.arguments[0];
      if (ts.isArrayLiteralExpression(firstArg)) {
        collectArrayEntries(firstArg);
      }
      captureMapIdentifier(node);
    }

    // B) Mutations: <mapIdent>.set('Key', Value)
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'set'
    ) {
      const target = node.expression.expression;
      if (ts.isIdentifier(target) && mapIdentifiers.has(target.text)) {
        const [keyArg, valArg] = node.arguments ?? [];
        if (keyArg && ts.isStringLiteral(keyArg) && valArg) {
          resolveAndRecordEntry(keyArg.text, valArg as ts.Expression);
        }
      }
    }

    ts.forEachChild(node, traverseAst);
  };

  ts.forEachChild(source, traverseAst);

  return results;
}

function _readNamedExports(filePath: string): string[] {
  const code = fs.readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);

  const names = new Set<string>();

  const visit = (node: ts.Node) => {
    // export const X = ...
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach((d) => {
        if (ts.isIdentifier(d.name)) names.add(d.name.text);
      });
    }
    // export function X() {}
    if (
      ts.isFunctionDeclaration(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
      node.name
    ) {
      names.add(node.name.text);
    }
    // export { A, B as C }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      node.exportClause.elements.forEach((e) => names.add(e.name.text));
    }
    // export default ...
    if (ts.isExportAssignment(node)) {
      names.add('Default');
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sf, visit);
  return Array.from(names);
}

async function _sendCode({
  file,
  token,
  targetUrl,
}: {
  file: ExtractedFile;
  token: string;
  targetUrl: string;
}) {
  const apiEndpoint = `${targetUrl}/mesh/push/api/v1/contentsdk/code/extracted`;

  if (!fs.existsSync(file.path)) {
    console.error(chalk.red(`File not found: ${file.path}`));
    return null;
  }

  const code = fs.readFileSync(file.path);

  // Merge base labels with any extra labels (variants, componentName, etc.)
  const labels: Record<string, unknown> = {
    type: file.type,
    ...(file.labels || {}),
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EnvironmentId: 'ContentSDK',
        name: file.name,
        content: code.toString(),
        labels,
      }),
    });

    if (!response.ok) {
      console.error(
        chalk.red(`Failed to send extracted code from ${file.path}: ${response.statusText}`)
      );
      debug.http('Error details: %o', {
        status: response.status,
        text: await response.text(),
        url: response.url,
        headers: response.headers,
      });
      return null;
    }
  } catch (error) {
    console.error(
      chalk.red(
        `Fetch request to send extracted code from ${file.path} failed: ${JSON.stringify(error)}`
      )
    );
    return null;
  }

  return file.path;
}

// Normalize path separators to POSIX-style "/" for cross-platform consistency.
export function toPosixPath(p: string) {
  if (/^\\\\\?\\/.test(p)) return p;
  return p.replace(/\\/g, '/');
}

export const stripExtension = (p: string) => p.replace(/\.(tsx?|jsx?|mjs|cjs)$/, '');

// Convert an absolute file path into an relative module specifier (POSIX)
export const getRelativeImportPath = (absFile: string, appPath: string) => {
  let rel = toPosixPath(path.relative(appPath, absFile));
  return stripExtension(rel);
};

// Determine if a specifier is bare/aliased (i.e., not relative "./" or "../" and not absolute "/").
export const isNodeModuleImport = (name: string) =>
  !name.startsWith('./') && !name.startsWith('../') && !name.startsWith('/');
