/* eslint-disable quotes */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import {
  ModuleExports,
  nextJsMapTemplate,
  getImportMap,
  unitMocks,
  writeImportMap,
  getImportValueAlias,
} from './import-map';
import { debug } from '@sitecore-content-sdk/core';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';

describe.only('Import Map Generation', () => {
  describe('getImportMap', () => {
    const sandbox = sinon.createSandbox();
    let cwdStub: sinon.SinonStub;
    let testExportsModulePath = '';

    const convertToTestable = (importMap: Map<string, ModuleExports>) =>
      Array.from(importMap).map(([modulePath, imports]) => {
        const namedImports = Array.from(imports.namedExports).map(([key, value]) => {
          return {
            name: key,
            value,
          };
        });
        return {
          module: modulePath,
          defaultImport: imports.defaultExport,
          namespaceImport: imports.namespaceExport,
          namedImports,
        };
      });

    beforeEach(() => {
      const appFolder = path.resolve(process.cwd(), './src/tools/codegen/test-data/import-map');
      cwdStub = sandbox.stub(process, 'cwd').returns(appFolder);
      testExportsModulePath = 'test-exports';
    });

    afterEach(() => {
      cwdStub.restore();
    });

    it('should return map with named imports (named.ts)', () => {
      const result = getImportMap(['single-file-imports/named.ts']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [
            { name: 'funco', value: 'funco' },
            { name: 'TestClass', value: 'TestClass' },
            {
              name: 'testClassInstance',
              value: 'testClassInstance',
            },
          ],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map with named imports when tsconfig paths is used (ts-path-alias.ts)', () => {
      const result = getImportMap(['single-file-imports/ts-path-alias.ts']);

      const expected = [
        {
          module: '@pathed/test-path-exports',
          namedImports: [{ name: 'pathedVariable', value: 'pathedVariable' }],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from JS file (js-file.js)', () => {
      const result = getImportMap(['single-file-imports/js-file.js']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from wildcard imports (wildcard.ts)', () => {
      const result = getImportMap(['single-file-imports/wildcard.ts']);
      const expected = [
        {
          module: 'react',
          namedImports: [],
          namespaceImport: 'React',
          defaultImport: null,
        },
        {
          module: testExportsModulePath,
          namedImports: [],
          namespaceImport: 'everything',
          defaultImport: null,
        },
      ];

      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from mixed imports (mixed.ts)', () => {
      const result = getImportMap(['single-file-imports/mixed.ts']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [
            { name: 'funco', value: 'funco' },
            { name: 'TestClass', value: 'TestClass' },
            {
              name: 'testClassInstance',
              value: 'testClassInstance',
            },
          ],
          namespaceImport: 'everything',
          defaultImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should handle mixed namespace, default and named imports in one line (mixed-namespace.ts)', () => {
      const result = getImportMap(['single-file-imports/mixed-namespace.ts']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [
            { name: 'funco', value: 'funco' },
            { name: 'TestClass', value: 'TestClass' },
            {
              name: 'testClassInstance',
              value: 'testClassInstance',
            },
          ],
          defaultImport: 'defaultExport',
          namespaceImport: 'everything',
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should exclude types from import map (with-types.ts)', () => {
      const result = getImportMap(['single-file-imports/with-types.ts']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return imports from tsx, jsx components', () => {
      const tsxResult = getImportMap([
        'single-file-imports/tsx-component.tsx',
        'single-file-imports/jsx-component.jsx',
      ]);

      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(tsxResult)).to.deep.equal(expected);
    });

    it('should return map from js file (js-file.js)', () => {
      const result = getImportMap(['single-file-imports/js-file.js']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImport: null,
          namespaceImport: null,
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from multi-file imports with duplicate mixed exports', () => {
      const reactSpecifier = 'react';
      const fakeReactSpecifier = 'fake-react';
      const testExports2Specifier = 'test-exports-2';
      const testExportsSpecifier = 'test-exports';

      cwdStub.restore();
      const multiFileFolder = path.resolve(
        process.cwd(),
        './src/tools/codegen/test-data/import-map'
      );
      cwdStub = sandbox.stub(process, 'cwd').returns(multiFileFolder);

      const result = getImportMap([
        'multi-file-imports/A.tsx',
        'multi-file-imports/B.tsx',
        'multi-file-imports/C.tsx',
        'multi-file-imports/D.tsx',
        'multi-file-imports/E.tsx',
      ]);

      const expected = [
        {
          module: reactSpecifier,
          defaultImport: 'React',
          namedImports: [{ name: 'useEffect', value: 'useEffect' }],
          namespaceImport: getImportValueAlias('React', reactSpecifier, 'namespace'),
        },
        {
          module: testExports2Specifier,
          namedImports: [{ name: 'testClassInstance', value: 'testClassInstance' }],
          defaultImport: null,
          namespaceImport: null,
        },
        {
          module: fakeReactSpecifier,
          defaultImport: getImportValueAlias('React', fakeReactSpecifier, 'default'),
          namespaceImport: getImportValueAlias('React', fakeReactSpecifier, 'namespace'),
          namedImports: [
            {
              name: 'useEffect',
              value: getImportValueAlias('useEffect', fakeReactSpecifier, 'named'),
            },
          ],
        },
        {
          module: testExportsSpecifier,
          namedImports: [
            {
              name: 'testClassInstance',
              value: getImportValueAlias('testClassInstance', testExportsSpecifier, 'named'),
            },
          ],
          defaultImport: 'testExportsDefault',
          namespaceImport: null,
        },
      ];

      expect(convertToTestable(result)).to.deep.equal(expected);
    });
  });

  describe('nextJsMapTemplate', () => {
    it('should accept a Map object and transform it into file content with imports', () => {
      // Prepare a fake import map with both named and default imports
      const importMap = new Map<string, ModuleExports>();
      importMap.set('../test-exports', {
        namedExports: new Map([
          ['funco', 'funco'],
          ['TestClass', 'TestClass'],
          ['testo', 'aliased_testo'],
        ]),
        defaultExport: null,
        namespaceExport: 'everything',
      });
      importMap.set('react', {
        namedExports: new Map(),
        defaultExport: null,
        namespaceExport: 'React',
      });

      const output = nextJsMapTemplate(importMap);

      // Check that import statements are present
      expect(output).to.include(
        "import { funco, TestClass, testo as aliased_testo } from '../test-exports';"
      );
      expect(output).to.include("import * as everything from '../test-exports';");
      expect(output).to.include("import * as React from 'react';");
    });

    it('should accept a Map object and transform it into file content with component map entries', () => {
      // Prepare a fake import map with both named and default imports
      const importMap = new Map<string, ModuleExports>();
      importMap.set('../test-exports', {
        namedExports: new Map([
          ['funco', 'funco'],
          ['TestClass', 'TestClass'],
          ['testo', 'aliased_testo'],
        ]),
        defaultExport: null,
        namespaceExport: 'everything',
      });

      const output = nextJsMapTemplate(importMap);

      // Check that the export const importMap is present and contains correct entries
      expect(output).to.include('const importMap = [');
      expect(output).to.match(/module: '\.\.\/test-exports'/);
      expect(output).to.match(/name: '\*', value: everything/);
      expect(output).to.match(/name: 'funco', value: funco/);
      expect(output).to.match(/name: 'TestClass', value: TestClass/);
      expect(output).to.match(/name: 'testo', value: aliased_testo/);
    });

    it('should write default service imports from codegen submodule', () => {
      // Prepare a fake import map with no entries
      const importMap = new Map<string, ModuleExports>();
      const output = nextJsMapTemplate(importMap);

      // Should always include default service imports at the top
      expect(output).to.include(
        "import { combineImportEntries, defaultImportEntries } from '@sitecore-content-sdk/nextjs/codegen';"
      );
    });

    it('final file should export function combining generated and default import maps', () => {
      // Prepare a fake import map with one entry
      const importMap = new Map<string, ModuleExports>();
      importMap.set('../test-exports', {
        namedExports: new Map([['funco', 'funco']]),
        defaultExport: null,
        namespaceExport: null,
      });

      const output = nextJsMapTemplate(importMap);

      // Should export default using combineImportEntries
      expect(output).to.match(
        /export default combineImportEntries\(defaultImportEntries, importMap\);/
      );
    });
  });

  describe('writeImportMap', () => {
    const sandbox = sinon.createSandbox();
    afterEach(() => {
      sandbox.restore();
    });

    it('should skip when code generation is disabled', async () => {
      const debugStub = sandbox.stub(debug, 'common');
      const scConfig = { disableCodeGeneration: true } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').returns(true);
      const getComponentListStub = sandbox.stub();
      unitMocks({ getComponentListStub });
      const fsWriteStub = sandbox.stub(fs, 'writeFileSync');

      await writeImportMap({ paths: ['foo'], exclude: [], scConfig })();

      expect(
        debugStub.calledWithMatch(
          'Skipping import map generation. Code generation functionality is disabled.'
        )
      ).to.be.true;
      expect(getComponentListStub.notCalled).to.be.true;
      expect(fsWriteStub.called).to.be.false;
    });

    it('should retrieve and parse paths based on inputs from "paths" and "exclude"', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').returns(true);

      const fakeEntries = [{ filePath: 'component1.tsx' }, { filePath: 'component2.tsx' }];
      const getComponentListStub = sandbox.stub().returns(fakeEntries);
      unitMocks({ getComponentListStub });
      const getImportMapStub = sandbox
        .stub(require('./import-map'), 'getImportMap')
        .returns(new Map());
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');
      const nextJsMapTemplateStub = sandbox
        .stub(require('./import-map'), 'nextJsMapTemplate')
        .returns('// import map content');

      await writeImportMap({ paths: ['foo'], exclude: ['bar'], scConfig })();

      expect(getComponentListStub.called).to.be.true;
      expect(getComponentListStub.calledWith(['foo'], ['bar'])).to.be.true;
      expect(getImportMapStub.calledWith(['component1.tsx', 'component2.tsx'])).to.be.true;
      expect(fsWriteStub.calledOnce).to.be.true;
      expect(nextJsMapTemplateStub.calledOnce).to.be.true;
    });

    it('should write output into import-map file', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').returns(true);

      const fakeEntries = [{ filePath: 'component1.tsx' }];
      sandbox
        .stub(require('@sitecore-content-sdk/core/tools'), 'getComponentList')
        .returns(fakeEntries);
      sandbox.stub(require('./import-map'), 'getImportMap').returns(new Map());
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');
      sandbox.stub(require('./import-map'), 'nextJsMapTemplate').returns('// import map content');

      await writeImportMap({ paths: ['foo'], exclude: [], scConfig })();

      expect(fsWriteStub.calledOnce).to.be.true;
      const filePath = fsWriteStub.getCall(0).args[0];
      expect(filePath).to.include('.sitecore');
      expect(filePath).to.include('import-map.ts');
      expect(fsWriteStub.getCall(0).args[1]).to.equal('// import map content');
      expect(fsWriteStub.getCall(0).args[2]).to.deep.include({ encoding: 'utf8' });
    });

    it('should throw when file write operation fails', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').returns(true);

      const fakeEntries = [{ filePath: 'component1.tsx' }];
      sandbox
        .stub(require('@sitecore-content-sdk/core/tools'), 'getComponentList')
        .returns(fakeEntries);
      sandbox.stub(require('./import-map'), 'getImportMap').returns(new Map());
      const error = new Error('Unit test mocks: write failed');
      sandbox.stub(require('fs'), 'writeFileSync').throws(error);
      sandbox.stub(require('./import-map'), 'nextJsMapTemplate').returns('// import map content');

      let thrownError: Error | undefined;
      try {
        await writeImportMap({ paths: ['foo'], exclude: [], scConfig })();
      } catch (e) {
        thrownError = e as Error;
      }
      expect(thrownError).to.equal(error);
    });
  });
});
