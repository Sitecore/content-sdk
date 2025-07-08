/* eslint-disable quotes */
import { expect } from 'chai';
import { parseImportString } from './import-map';
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

    beforeEach(() => {
      const appFolder = path.resolve(process.cwd(), './src/tools/codegen/test-data/import-map');
      cwdStub = sandbox.stub(process, 'cwd').returns(appFolder);
    });

    afterEach(() => {
      cwdStub.restore();
    });

    it('should return map with named imports (named.ts)', () => {
      const result = getImportMap(['named.ts']);
      expect(result).to.deep.equal([
        {
          module: './test-exports.ts',
          namedImports: ['funco', 'TestClass', 'testo'],
        },
      ]);
    });

    it('should return map from wildcard imports (wildcard.ts)', () => {
      const result = getImportMap(['wildcard.ts']);
      expect(result).to.deep.equal([
        {
          module: 'react',
          namedImports: ['React'],
        },
        {
          module: './test-exports.ts',
          namedImports: ['everything'],
        },
      ]);
    });

    it('should return map from mixed imports (mixed.ts)', () => {
      const result = getImportMap(['mixed.ts']);
      expect(result).to.deep.equal([
        {
          module: './test-exports.ts',
          namedImports: ['funco', 'TestClass', 'testo', 'everything'],
        },
      ]);
    });

    it('should exclude types from import map (with-types.ts)', () => {
      const result = getImportMap(['with-types.ts']);
      expect(result).to.deep.equal([
        {
          module: './test-exports.ts',
          namedImports: ['funco'],
        },
      ]);
    });

    it('should return imports from tsx, jsx components', () => {
      const tsxResult = getImportMap(['tsx-component.tsx', 'jsx-component.jsx']);
      expect(tsxResult).to.deep.equal([
        {
          module: './test-exports.ts',
          namedImports: ['funco'],
        },
      ]);
    });

    it('should return map from js file (js-file.js)', () => {
      const result = getImportMap(['js-file.js']);
      expect(result).to.deep.equal([
        {
          module: './test-exports.ts',
          namedImports: ['funco'],
        },
      ]);
    });
  });
});
