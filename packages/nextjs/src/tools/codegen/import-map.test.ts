/* eslint-disable quotes */
import { expect } from 'chai';
import { ImportModule, nextJsMapTemplate, parseImportString, writeImportMap } from './import-map';
import { debug } from '@sitecore-content-sdk/core';
import sinon from 'sinon';
import { getImportMap } from './import-map';
import * as coreTools from '@sitecore-content-sdk/core/tools';
import path from 'path';
import fs from 'fs';

describe('Import Map Generation', () => {
  describe('parseImportString', () => {
    it('should parse import string with named imports', () => {
      const result = parseImportString('{ foo, bar }');
      const expected = [
        {
          importName: 'foo',
        },
        {
          importName: 'bar',
        },
      ];
      expect(result).to.deep.equal(expected);
    });

    it('should parse import string with wildcard import and return single import entry', () => {
      const result = parseImportString('* as utils');
      const expected = {
        importName: '*',
        alias: 'utils',
      };
      expect(result).to.deep.equal(expected);
    });

    it('should parse import string with default import', () => {
      const result = parseImportString('myDefault');
      const expected = {
        importName: 'myDefault',
      };
      expect(result).to.deep.equal(expected);
    });

    it('should parse import string with named import when alias is used', () => {
      // This case is not handled by the current implementation, but let's test it
      const result = parseImportString('{ baz, foo as bar }');
      const expected = [
        {
          importName: 'baz',
        },
        {
          importName: 'foo',
          alias: 'bar',
        },
      ];
      expect(result).to.deep.equal(expected);
    });

    it('should return null when not valid import string', () => {
      const result = parseImportString('not an import');
      expect(result).to.equal(null);
    });
  });

  describe('getImportMap', () => {
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
              aliasName: 'testo',
              importName: 'testClassInstance',
              valueName: 'testo',
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
              aliasName: 'testo',
              importName: 'testClassInstance',
              valueName: 'testo',
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

  describe('nextJsMapTemplate', () => {
    it('should accept a Map object and transform it into file content with imports', () => {
      // Prepare a fake import map with both named and default imports
      const importMap = new Map<string, ImportModule>();
      importMap.set('../test-exports.ts', {
        namedImports: new Map([
          ['funco', { importName: 'funco' }],
          ['TestClass', { importName: 'TestClass' }],
          ['testClassInstance', { importName: 'testo', alias: 'testClassInstance' }],
        ]),
        defaultImports: new Map([['everything', { importName: '*', alias: 'everything' }]]),
      });
      importMap.set('react', {
        namedImports: new Map(),
        defaultImports: new Map([['React', { importName: '*', alias: 'React' }]]),
      });

      const output = nextJsMapTemplate(importMap);

      // Check that import statements are present
      expect(output).to.include(
        "import { funco, TestClass, testo as testClassInstance } from '../test-exports.ts';"
      );
      expect(output).to.include("import * as everything from '../test-exports.ts';");
      expect(output).to.include("import * as React from 'react';");
    });

    it('should accept a Map object and transform it into file content with component map entries', () => {
      // Prepare a fake import map with both named and default imports
      const importMap = new Map<string, ImportModule>();
      importMap.set('../test-exports.ts', {
        namedImports: new Map([
          ['funco', { importName: 'funco' }],
          ['TestClass', { importName: 'TestClass' }],
          ['testClassInstance', { importName: 'testo', alias: 'testClassInstance' }],
        ]),
        defaultImports: new Map([['everything', { importName: '*', alias: 'everything' }]]),
      });

      const output = nextJsMapTemplate(importMap);

      // Check that the export const importMap is present and contains correct entries
      expect(output).to.include('export const importMap = [');
      expect(output).to.match(/module: '\.\.\/test-exports\.ts'/);
      expect(output).to.match(/name: 'everything', value: everything/);
      expect(output).to.match(/name: 'funco', value: funco/);
      expect(output).to.match(/name: 'TestClass', value: TestClass/);
      expect(output).to.match(/name: 'testClassInstance', value: testClassInstance/);
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
      sandbox.stub(require('./utils'), 'xmCloudDeploy').value(true);
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

    it('should skip when not in xm cloud deploy context', async () => {
      const debugStub = sandbox.stub(debug, 'common');
      const scConfig = { disableCodeGeneration: false } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').value(false);
      const getComponentListStub = sandbox.stub(
        require('@sitecore-content-sdk/core/tools'),
        'getComponentList'
      );
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');

      await writeImportMap({ paths: ['foo'], exclude: [] }, scConfig)();

      expect(
        debugStub.calledWithMatch('Skipping import map generation. Not in XMCloud deploy context.')
      ).to.be.true;
      expect(getComponentListStub.notCalled).to.be.true;
      expect(fsWriteStub.notCalled).to.be.true;
    });

    // temporarily disabled due to sinon stub issues for getComponentListStub
    xit('should retrieve and parse paths based on inputs from "paths" and "exclude"', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      sandbox.stub(require('./utils'), 'xmCloudDeploy').value(true);

      const fakeEntries = [{ filePath: 'component1.tsx' }, { filePath: 'component2.tsx' }];
      const getComponentListStub = sandbox.stub(coreTools, 'getComponentList').returns(fakeEntries);
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
      sandbox.stub(require('./utils'), 'xmCloudDeploy').value(true);

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
      sandbox.stub(require('./utils'), 'xmCloudDeploy').value(true);

      const fakeEntries = [{ filePath: 'component1.tsx' }];
      sandbox
        .stub(require('@sitecore-content-sdk/core/tools'), 'getComponentList')
        .returns(fakeEntries);
      sandbox.stub(require('./import-map'), 'getImportMap').returns(new Map());
      const error = new Error('Write failed');
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
