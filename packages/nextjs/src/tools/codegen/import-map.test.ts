/* eslint-disable quotes */
import { expect } from 'chai';
import crypto from 'crypto';
import {
  ModuleExports,
  nextJsMapTemplate,
  getImportMap,
  unitMocks,
  writeImportMap,
} from './import-map';
import { debug } from '@sitecore-content-sdk/core';
import sinon from 'sinon';
import { getComponentList } from '@sitecore-content-sdk/core/tools';
import path from 'path';
import fs from 'fs';
import { ImportEntry } from '@sitecore-content-sdk/core/editing';

describe('Import Map Generation', () => {
  beforeEach(() => {
    unitMocks({ mockDefaultImportEntries: [], getComponentListStub: getComponentList });
  });

  describe('getImportMap', () => {
    const sandbox = sinon.createSandbox();
    let cwdStub: sinon.SinonStub;
    let testExportsModulePath = '';

    const convertToTestable = (importMap: Map<string, ModuleExports>) =>
      Array.from(importMap).map(([modulePath, imports]) => {
        const defaultImports = Array.from(imports.defaultExports).map(([key, value]) => {
          return {
            name: key,
            value,
          };
        });
        const namedImports = Array.from(imports.namedExports).map(([key, value]) => {
          return {
            name: key,
            value,
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
      testExportsModulePath = path.resolve(process.cwd(), 'test-exports.ts').replace(/\\/g, '/');
    });

    afterEach(() => {
      cwdStub.restore();
    });

    it('should return map with named imports (named.ts)', () => {
      const result = getImportMap(['named.ts']);
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
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from JS file (js-file.js)', () => {
      const result = getImportMap(['js-file.js']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
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
          defaultImports: [{ name: '*', value: 'React' }],
        },
        {
          module: testExportsModulePath,
          namedImports: [],
          defaultImports: [{ name: '*', value: 'everything' }],
        },
      ];

      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from mixed imports (mixed.ts)', () => {
      const result = getImportMap(['mixed.ts']);
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
          defaultImports: [{ name: '*', value: 'everything' }],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should handle mixed namespace, default and named imports in one line (mixed-namespace.ts)', () => {
      const result = getImportMap(['mixed-namespace.ts']);
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
          defaultImports: [
            { name: 'defaultExport', value: 'defaultExport' },
            { name: '*', value: 'everything' },
            { name: 'defaultExport2', value: 'defaultExport2' },
          ],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map with default import map values', () => {
      const defaultMap = [
        {
          module: 'test',
          exports: [
            {
              name: 'testExport',
              value: 'testExport',
            },
          ],
        },
      ] as ImportEntry[];

      unitMocks({ mockDefaultImportEntries: defaultMap });

      const result = getImportMap(['mixed.ts']);
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
          defaultImports: [{ name: '*', value: 'everything' }],
        },
        {
          module: 'test',
          namedImports: [{ name: 'testExport', value: 'testExport' }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return map from with aliased values when import getting duplicate import names', () => {
      const result = getImportMap(['wildcard.ts', 'duplicates.ts']);
      const testDuplicateImportModule = path
        .resolve(process.cwd(), 'fake-react.ts')
        .replace(/\\/g, '/');
      const expected = [
        {
          module: 'react',
          namedImports: [],
          defaultImports: [{ name: '*', value: 'React' }],
        },
        {
          module: testExportsModulePath,
          namedImports: [],
          defaultImports: [{ name: '*', value: 'everything' }],
        },
        {
          defaultImports: [],
          module: testDuplicateImportModule,
          namedImports: [
            {
              name: 'React',
              value: `React_${crypto.hash('sha1', testDuplicateImportModule)}`,
            },
          ],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should exclude types from import map (with-types.ts)', () => {
      const result = getImportMap(['with-types.ts']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(result)).to.deep.equal(expected);
    });

    it('should return imports from tsx, jsx components', () => {
      const tsxResult = getImportMap(['tsx-component.tsx', 'jsx-component.jsx']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImports: [],
        },
      ];
      expect(convertToTestable(tsxResult)).to.deep.equal(expected);
    });

    it('should return map from js file (js-file.js)', () => {
      const result = getImportMap(['js-file.js']);
      const expected = [
        {
          module: testExportsModulePath,
          namedImports: [{ name: 'funco', value: 'funco' }],
          defaultImports: [],
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
        defaultExports: new Map([['*', 'everything']]),
      });
      importMap.set('react', {
        namedExports: new Map(),
        defaultExports: new Map([['*', 'React']]),
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
        defaultExports: new Map([['*', 'everything']]),
      });

      const output = nextJsMapTemplate(importMap);

      // Check that the export const importMap is present and contains correct entries
      expect(output).to.include('export const importMap = [');
      expect(output).to.match(/module: '\.\.\/test-exports'/);
      expect(output).to.match(/name: '\*', value: everything/);
      expect(output).to.match(/name: 'funco', value: funco/);
      expect(output).to.match(/name: 'TestClass', value: TestClass/);
      expect(output).to.match(/name: 'testo', value: aliased_testo/);
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
      const getComponentListStub = sandbox.stub(
        require('@sitecore-content-sdk/core/tools'),
        'getComponentList'
      );
      const fsWriteStub = sandbox.stub(fs, 'writeFileSync');

      await writeImportMap({ paths: ['foo'], exclude: [] }, scConfig)();

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
      unitMocks({ getComponentListStub: getComponentListStub });
      const getImportMapStub = sandbox
        .stub(require('./import-map'), 'getImportMap')
        .returns(new Map());
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');
      const nextJsMapTemplateStub = sandbox
        .stub(require('./import-map'), 'nextJsMapTemplate')
        .returns('// import map content');

      await writeImportMap({ paths: ['foo'], exclude: ['bar'] }, scConfig)();

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

      await writeImportMap({ paths: ['foo'], exclude: [] }, scConfig)();

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
        await writeImportMap({ paths: ['foo'], exclude: [] }, scConfig)();
      } catch (e) {
        thrownError = e as Error;
      }
      expect(thrownError).to.equal(error);
    });
  });
});
