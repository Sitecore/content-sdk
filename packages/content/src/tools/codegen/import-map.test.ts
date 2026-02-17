/* eslint-disable quotes */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { debug } from '@sitecore-content-sdk/core';
import {
  ModuleExports,
  defaultMapTemplate,
  getImportMap,
  unitMocks,
  writeImportMap,
  getImportValueAlias,
  WriteImportMapArgsInternal,
} from './import-map';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import { utilsUnitMocks } from './utils';
import { importUnitMocks } from './import-map';
import { componentUnitMocks } from './../templating/components';
import { SitecoreConfig } from './../../config';

describe('Import Map Generation', () => {
  const sandbox = sinon.createSandbox();
  let cwdStub: sinon.SinonStub;
  let testExportsModulePath = '';

  beforeEach(() => {
    const appFolder = path.resolve(process.cwd(), './src/tools/codegen/test-data/import-map');
    cwdStub = sandbox.stub(process, 'cwd').returns(appFolder);
    testExportsModulePath = 'test-exports';
  });

  afterEach(() => {
    cwdStub.restore();
  });

  describe('getImportMap', () => {
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
          defaultImport: null,
          module: testExportsModulePath,
          namedImports: [],
          namespaceImport: 'everything',
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
      process.env.IMPORT_ALIAS_STRATEGY = 'plain';
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
          module: testExports2Specifier,
          namedImports: [{ name: 'testClassInstance', value: 'testClassInstance' }],
          defaultImport: null,
          namespaceImport: null,
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

    it('should return map with imports from 3rd party modules', () => {
      const fakeCode = `import { coolFeature } from 'coolFeatureLib';
        import { fancyNameFeature } from 'fancy.js';
        export default function logic() {
          console.log('document imports', coolFeature, fancyNameFeature);
        };
      `;

      const ts = require('typescript');
      const fakeFilePath = path.resolve(process.cwd(), 'fake-file.ts');
      const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');

      // Store original functions
      const originalReadFile = ts.sys.readFile;
      const originalFileExists = ts.sys.fileExists;

      try {
        // Mock ts.sys.readFile to return our fake code
        ts.sys.readFile = (filePath: string) => {
          if (filePath === fakeFilePath) {
            return fakeCode;
          }
          if (filePath.includes('tsconfig.json')) {
            return originalReadFile(filePath);
          }
          // For node_modules resolution, return minimal valid module content
          if (
            filePath.includes('coolFeatureLib') ||
            filePath.includes('fancy.js') ||
            filePath.includes(nodeModulesPath)
          ) {
            return 'export const placeholder = true;';
          }
          return originalReadFile(filePath);
        };

        // Mock ts.sys.fileExists to confirm our files exist
        ts.sys.fileExists = (filePath: string) => {
          if (filePath === fakeFilePath) {
            return true;
          }
          if (
            filePath.includes('coolFeatureLib') ||
            filePath.includes('fancy.js') ||
            filePath.includes(nodeModulesPath)
          ) {
            return true;
          }
          return originalFileExists(filePath);
        };

        const result = getImportMap([fakeFilePath]);
        const expected = [
          {
            module: 'coolFeatureLib',
            namedImports: [{ name: 'coolFeature', value: 'coolFeature' }],
            defaultImport: null,
            namespaceImport: null,
          },
          {
            module: 'fancy.js',
            namedImports: [{ name: 'fancyNameFeature', value: 'fancyNameFeature' }],
            defaultImport: null,
            namespaceImport: null,
          },
        ];

        expect(convertToTestable(result)).to.deep.equal(expected);
      } finally {
        // Always restore original functions, even if test fails
        ts.sys.readFile = originalReadFile;
        ts.sys.fileExists = originalFileExists;
      }
    });
  });

  describe('defaultMapTemplate', () => {
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

      const output = defaultMapTemplate(importMap);

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

      const output = defaultMapTemplate(importMap);

      // Check that the export const importMap is present and contains correct entries
      expect(output).to.include('const importMap = [');
      expect(output).to.match(/module: '\.\.\/test-exports'/);
      expect(output).to.match(/name: '\*', value: everything/);
      expect(output).to.match(/name: 'funco', value: funco/);
      expect(output).to.match(/name: 'TestClass', value: TestClass/);
      expect(output).to.match(/name: 'testo', value: aliased_testo/);
    });

    it('should write default service imports from codegen submodule with fallback framework', () => {
      // Prepare a fake import map with no entries
      const importMap = new Map<string, ModuleExports>();
      const output = defaultMapTemplate(importMap);

      // Should always include default service imports at the top
      expect(output).to.include(
        `import {
  combineImportEntries,
  defaultImportEntries,
  ImportEntry,
} from '@sitecore-content-sdk/core/codegen';`
      );
    });

    it('should write default service imports from codegen submodule with custom framework', () => {
      // Prepare a fake import map with no entries
      const importMap = new Map<string, ModuleExports>();
      const output = defaultMapTemplate(importMap, 'react');

      // Should always include default service imports at the top
      expect(output).to.include(
        `import {
  combineImportEntries,
  defaultImportEntries,
  ImportEntry,
} from '@sitecore-content-sdk/react/codegen';`
      );
    });

    it('should write default service imports with custom defaultImportEntries import name', () => {
      // Prepare a fake import map with no entries
      const importMap = new Map<string, ModuleExports>();
      const customImportName = 'customDefaultImports';
      const output = defaultMapTemplate(importMap, 'core', customImportName);

      // Should include custom import name in the import statement
      expect(output).to.include(
        `import {
  combineImportEntries,
  ${customImportName},
  ImportEntry,
} from '@sitecore-content-sdk/core/codegen';`
      );

      // Should use custom import name in the combineImportEntries call
      expect(output).to.match(
        new RegExp(`export default combineImportEntries\\(${customImportName}, importMap\\);`)
      );
    });

    it('should write default service imports with fallback defaultImportEntries import name', () => {
      // Prepare a fake import map with no entries
      const importMap = new Map<string, ModuleExports>();
      // Call without providing the third parameter to test default behavior
      const output = defaultMapTemplate(importMap);

      // Should include default 'defaultImportEntries' in the import statement
      expect(output).to.include(
        `import {
  combineImportEntries,
  defaultImportEntries,
  ImportEntry,
} from '@sitecore-content-sdk/core/codegen';`
      );

      // Should use default 'defaultImportEntries' in the combineImportEntries call
      expect(output).to.match(
        /export default combineImportEntries\(defaultImportEntries, importMap\);/
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

      const output = defaultMapTemplate(importMap);

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
      /* eslint-disable-next-line */
      importUnitMocks.getImportMap = importUnitMocks.getImportMap;
      /* eslint-disable-next-line */
      importUnitMocks.defaultMapTemplate = importUnitMocks.defaultMapTemplate;
      unitMocks({ getComponentListStub: componentUnitMocks.getComponentList });
    });

    let getImportMapStub: sinon.SinonStub;
    let defaultMapTemplateStub: sinon.SinonStub;
    let getComponentListStub: sinon.SinonStub;

    beforeEach(() => {
      getImportMapStub = sandbox.stub();
      defaultMapTemplateStub = sandbox.stub();
      getComponentListStub = sandbox.stub();
      importUnitMocks.getImportMap = getImportMapStub;
      importUnitMocks.defaultMapTemplate = defaultMapTemplateStub;
      unitMocks({ getComponentListStub });
    });

    const runCommand = (
      scConfig: SitecoreConfig,
      writeImportMapConfig: WriteImportMapArgsInternal
    ) => {
      const runWruteImportMap = writeImportMap(writeImportMapConfig);
      return runWruteImportMap({ scConfig });
    };

    it('should skip when code generation is disabled', async () => {
      const debugStub = sandbox.stub(debug, 'common');
      const scConfig = { disableCodeGeneration: true } as any;
      utilsUnitMocks.xmCloudDeploy = sandbox.stub().returns(true) as any;
      const getComponentListStub = sandbox.stub();
      unitMocks({ getComponentListStub });
      const fsWriteStub = sandbox.stub(fs, 'writeFileSync');

      await runCommand(scConfig, { paths: ['foo'], exclude: [] });

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
      utilsUnitMocks.xmCloudDeploy = sandbox.stub().returns(true) as any;

      const fakeEntries = [{ filePath: 'component1.tsx' }, { filePath: 'component2.tsx' }];
      const getComponentListStub = sandbox.stub().returns(fakeEntries);
      unitMocks({ getComponentListStub });
      getImportMapStub.returns(new Map());
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');

      // Mock fs.createReadStream for prepImportMaps with proper event emitter
      const createReadStreamStub = sandbox.stub(fs, 'createReadStream');
      createReadStreamStub.callsFake(() => {
        const handlers: any = {};
        const mockStream = {
          on: (event: string, handler: any) => {
            handlers[event] = handler;
            if (event === 'error') {
              // Don't trigger error
            } else if (event === 'close') {
              // Trigger close after data
              setImmediate(() => handler());
            }
            return mockStream;
          },
        };
        // Trigger data event
        setImmediate(() => handlers.data && handlers.data(Buffer.from('import { funco')));
        return mockStream as any;
      });

      defaultMapTemplateStub.returns('// import map content');
      await runCommand(scConfig, { paths: ['foo'], exclude: ['bar'] });

      expect(getComponentListStub.called).to.be.true;
      expect(getComponentListStub.calledWith(['foo'], ['bar'])).to.be.true;
      expect(getImportMapStub.calledWith(['component1.tsx', 'component2.tsx'])).to.be.true;
      expect(fsWriteStub.calledOnce).to.be.true;
      expect(defaultMapTemplateStub.calledOnce).to.be.true;
    });

    it('should write server and client import maps', async () => {
      // run the full unobstructed flow for this test
      /* eslint-disable-next-line */
      importUnitMocks.getImportMap = importUnitMocks.getImportMap;
      /* eslint-disable-next-line */
      importUnitMocks.defaultMapTemplate = importUnitMocks.defaultMapTemplate;
      unitMocks({ getComponentListStub: componentUnitMocks.getComponentList });
      const scConfig = { disableCodeGeneration: false } as any;
      utilsUnitMocks.xmCloudDeploy = sandbox.stub().returns(true) as any;

      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');

      await runCommand(scConfig, {
        paths: ['client-components/*', 'single-file-imports/named.ts'],
        exclude: [],
        separateServerClientMaps: true,
        clientTemplate: (indexedImportMap: Map<string, ModuleExports>) => {
          return `'use client';
${defaultMapTemplate(indexedImportMap)}`;
        },
      });

      // Assert fsWriteStub was called twice
      expect(fsWriteStub.calledTwice).to.be.true;

      // Assert server import map was written to import-map.server.ts
      const serverCall = fsWriteStub.getCall(0);
      expect(serverCall.args[0]).to.include('import-map.server.ts');
      expect(serverCall.args[0]).to.not.include('import-map.client.ts');
      expect(serverCall.args[1]).to.match(/test-exports/);
      expect(serverCall.args[1]).to.not.match(/useEffect/);

      // Assert client import map was written to import-map.client.ts
      const clientCall = fsWriteStub.getCall(1);
      expect(clientCall.args[0]).to.include('import-map.client.ts');
      expect(clientCall.args[1]).to.match(/\'use client\'/);
      expect(clientCall.args[1]).to.match(/useEffect/);
      expect(clientCall.args[1]).to.match(/fake-react/);
      expect(clientCall.args[1]).to.not.match(/test-exports/);
    });

    it('should write output into import-map file', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      utilsUnitMocks.xmCloudDeploy = sandbox.stub().returns(true) as any;

      const fakeEntries = [{ filePath: 'component1.tsx' }];
      getComponentListStub.returns(fakeEntries);
      getImportMapStub.returns(new Map());
      const fsWriteStub = sandbox.stub(require('fs'), 'writeFileSync');

      // Mock fs.createReadStream for prepImportMaps with proper event emitter
      const createReadStreamStub = sandbox.stub(fs, 'createReadStream');
      createReadStreamStub.callsFake(() => {
        const handlers: any = {};
        const mockStream = {
          on: (event: string, handler: any) => {
            handlers[event] = handler;
            if (event === 'error') {
              // Don't trigger error
            } else if (event === 'close') {
              // Trigger close after data
              setImmediate(() => handler());
            }
            return mockStream;
          },
        };
        // Trigger data event
        setImmediate(() => handlers.data && handlers.data(Buffer.from('import { funco')));
        return mockStream as any;
      });

      defaultMapTemplateStub.returns('// import map content');

      await runCommand(scConfig, { paths: ['foo'], exclude: [] });

      expect(fsWriteStub.calledOnce).to.be.true;
      const filePath = fsWriteStub.getCall(0).args[0];
      expect(filePath).to.include('.sitecore');
      expect(filePath).to.include('import-map.ts');
      expect(fsWriteStub.getCall(0).args[1]).to.equal('// import map content');
      expect(fsWriteStub.getCall(0).args[2]).to.deep.include({ encoding: 'utf8' });
    });

    it('should throw when file write operation fails', async () => {
      const scConfig = { disableCodeGeneration: false } as any;
      utilsUnitMocks.xmCloudDeploy = sandbox.stub().returns(true) as any;

      const fakeEntries = [{ filePath: 'component1.tsx' }];
      getComponentListStub.returns(fakeEntries);
      getImportMapStub.returns(new Map());
      const error = new Error('Unit test mocks: write failed');

      // Mock fs.createReadStream for prepImportMaps with proper event emitter
      const createReadStreamStub = sandbox.stub(fs, 'createReadStream');
      createReadStreamStub.callsFake(() => {
        const handlers: any = {};
        const mockStream = {
          on: (event: string, handler: any) => {
            handlers[event] = handler;
            if (event === 'error') {
              // Don't trigger error
            } else if (event === 'close') {
              // Trigger close after data
              setImmediate(() => handler());
            }
            return mockStream;
          },
        };
        // Trigger data event
        setImmediate(() => handlers.data && handlers.data(Buffer.from('import { funco')));
        return mockStream as any;
      });

      sandbox.stub(require('fs'), 'writeFileSync').throws(error);
      defaultMapTemplateStub.returns('// import map content');

      let thrownError: Error | undefined;
      try {
        await runCommand(scConfig, { paths: ['foo'], exclude: [] });
      } catch (e) {
        thrownError = e as Error;
      }
      expect(thrownError).to.equal(error);
    });
  });
});
