/* eslint-disable quotes */
import { expect } from 'chai';
import { ImportModule, parseImportString } from './import-map';
import sinon from 'sinon';
import { getImportMap } from './import-map';
import path from 'path';

describe('Import Map Generation', () => {
  describe('parseImportString', () => {
    it('should parse import string with named imports', () => {
      const result = parseImportString('{ foo, bar }');
      expect(result).to.deep.equal(['foo', 'bar']);
    });

    it('should parse import string with wildcard import', () => {
      const result = parseImportString('* as utils');
      expect(result).to.deep.equal(['utils']);
    });

    it('should parse import string with default import', () => {
      const result = parseImportString('myDefault');
      expect(result).to.deep.equal(['myDefault']);
    });

    it('should parse import string with named import when alias is used', () => {
      // This case is not handled by the current implementation, but let's test it
      const result = parseImportString('{ baz, foo as bar }');
      expect(result).to.deep.equal(['baz', 'bar']);
    });

    it('should return null when not valid import string', () => {
      const result = parseImportString('not an import');
      expect(result).to.equal(null);
    });
  });

  describe.only('getImportMap', () => {
    const sandbox = sinon.createSandbox();
    let cwdStub: sinon.SinonStub;

    const convertToTestable = (importMap: Map<string, ImportModule>) =>
      Array.from(importMap).map(([modulePath, imports]) => {
        const defaultImports = Array.from(imports.defaultImports).map(([key, importInfo]) => {
          return {
            valueName: key,
            importName: importInfo.importName,
            aliasName: importInfo.alias,
          };
        });
        const namedImports = Array.from(imports.namedImports).map(([key, importInfo]) => {
          return {
            valueName: key,
            importName: importInfo.importName,
            aliasName: importInfo.alias,
          };
        });
        return {
          module: modulePath,
          defaultImports,
          namedImports,
        };
      });

    beforeEach(() => {
      const appFolder = path.resolve(process.cwd(), './src/tools/codegen/test-data/import-map');
      cwdStub = sandbox.stub(process, 'cwd').returns(appFolder);
    });

    afterEach(() => {
      cwdStub.restore();
    });

    it('should return map with named imports (named.ts)', () => {
      const result = getImportMap(['named.ts']);
      const expected = [
        {
          module: '../test-exports.ts',
          namedImports: [
            { valueName: 'funco', importName: 'funco', aliasName: undefined },
            { valueName: 'TestClass', importName: 'TestClass', aliasName: undefined },
            {
              aliasName: 'testClassInstance',
              importName: 'testo',
              valueName: 'testClassInstance',
            },
          ],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from wildcard imports (wildcard.ts)', () => {
      const result = getImportMap(['wildcard.ts']);
      const expected = [
        {
          module: 'react',
          namedImports: [],
          defaultImports: [{ valueName: 'React', importName: '*', aliasName: 'React' }],
        },
        {
          module: '../test-exports.ts',
          namedImports: [],
          defaultImports: [{ valueName: 'everything', importName: '*', aliasName: 'everything' }],
        },
      ];

      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from mixed imports (mixed.ts)', () => {
      const result = getImportMap(['mixed.ts']);
      const expected = [
        {
          module: '../test-exports.ts',
          namedImports: [
            { valueName: 'funco', importName: 'funco', aliasName: undefined },
            { valueName: 'TestClass', importName: 'TestClass', aliasName: undefined },
            {
              aliasName: 'testClassInstance',
              importName: 'testo',
              valueName: 'testClassInstance',
            },
          ],
          defaultImports: [{ valueName: 'everything', importName: '*', aliasName: 'everything' }],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should exclude types from import map (with-types.ts)', () => {
      const result = getImportMap(['with-types.ts']);
      const expected = [
        {
          module: '../test-exports.ts',
          namedImports: [{ valueName: 'funco', importName: 'funco', aliasName: undefined }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return imports from tsx, jsx components', () => {
      const tsxResult = getImportMap(['tsx-component.tsx', 'jsx-component.jsx']);
      const expected = [
        {
          module: '../test-exports.ts',
          namedImports: [{ valueName: 'funco', importName: 'funco', aliasName: undefined }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(tsxResult)).to.deep.equal(expected);
    });

    it('should return map from js file (js-file.js)', () => {
      const result = getImportMap(['js-file.js']);
      const expected = [
        {
          module: '../test-exports.ts',
          namedImports: [{ valueName: 'funco', importName: 'funco', aliasName: undefined }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });
  });
});
