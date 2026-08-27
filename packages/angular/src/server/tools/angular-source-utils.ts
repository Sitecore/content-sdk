/* eslint-disable jsdoc/require-jsdoc */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';
import { ExtractedFile, ExtractedFileType } from '@sitecore-content-sdk/content/node-tools';

/**
 * Parses an Angular component source file for externally referenced companion files
 * (`templateUrl`, `styleUrl`, `styleUrls` on its `@Component({...})` decorator) and returns
 * them as {@link ExtractedFile} entries so they are dispatched alongside the component.
 *
 * Angular components with inline `template` / `styles` produce no companions.
 * @param {string} componentFilePath - absolute path to the component `.ts` file
 * @param {string} componentKey - component map key the file belongs to
 * @returns {ExtractedFile[]} companion template/style files that exist on disk
 * @public
 */
export let gatherAngularCompanionFiles = _gatherAngularCompanionFiles;

// Writable-`let` export so the wrapper/tests can swap the implementation.
export const angularSourceUnitMocks = {
  set gatherAngularCompanionFiles(mockImplementation) {
    gatherAngularCompanionFiles = mockImplementation;
  },
  get gatherAngularCompanionFiles() {
    return _gatherAngularCompanionFiles;
  },
};

function _gatherAngularCompanionFiles(
  componentFilePath: string,
  componentKey: string
): ExtractedFile[] {
  if (!fs.existsSync(componentFilePath)) return [];

  const code = fs.readFileSync(componentFilePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    componentFilePath,
    code,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true
  );

  const dir = path.dirname(componentFilePath);
  const companions: ExtractedFile[] = [];
  const seen = new Set<string>();

  const addCompanion = (ref: string, type: ExtractedFileType) => {
    if (!ref) return;
    const abs = path.resolve(dir, ref);
    if (seen.has(abs)) return;
    seen.add(abs);
    if (!fs.existsSync(abs)) return;
    companions.push({
      name: componentKey,
      path: abs,
      type,
      labels: { componentKey, source: path.basename(abs) },
    });
  };

  const readRefs = (init: ts.Expression, type: ExtractedFileType) => {
    if (ts.isStringLiteralLike(init)) {
      addCompanion(init.text, type);
    } else if (ts.isArrayLiteralExpression(init)) {
      init.elements.forEach((el) => {
        if (ts.isStringLiteralLike(el)) addCompanion(el.text, type);
      });
    }
  };

  const visit = (node: ts.Node) => {
    if (
      ts.isDecorator(node) &&
      ts.isCallExpression(node.expression) &&
      ts.isIdentifier(node.expression.expression) &&
      node.expression.expression.text === 'Component'
    ) {
      const arg = node.expression.arguments[0];
      if (arg && ts.isObjectLiteralExpression(arg)) {
        arg.properties.forEach((prop) => {
          if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) return;
          if (prop.name.text === 'templateUrl') {
            readRefs(prop.initializer, ExtractedFileType.Template);
          } else if (prop.name.text === 'styleUrl' || prop.name.text === 'styleUrls') {
            readRefs(prop.initializer, ExtractedFileType.Style);
          }
        });
      }
    }
    ts.forEachChild(node, visit);
  };

  ts.forEachChild(sourceFile, visit);
  return companions;
}
