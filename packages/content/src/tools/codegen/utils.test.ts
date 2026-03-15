/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import * as path from 'path';
import nock from 'nock';
import fs from 'fs';
import * as codegenUtils from './utils';
import {
  toPosixPath,
  stripExtension,
  getRelativeImportPath,
  isNodeModuleImportOrAlias,
} from './utils';

const uniqueFilesFrom = (res: Array<{ filePath: string }>) => {
  const set = new Set<string>();
  for (const it of res) set.add(it.filePath);
  return Array.from(set);
};

describe('codegen-utils', () => {
  const sandbox = sinon.createSandbox();
  afterEach(() => {
    sandbox.restore();
    nock.cleanAll();
  });

  describe('sendCode', () => {
    const meshEndpoint = 'https://test-mesh-endpoint.com';
    const componentName = 'component';

    it('should read file from componentPath and send code to meshEndpoint', async () => {
      const componentPath = '/path/to/component.ts';
      const token = 'test-token';
      const fileContent = 'export const test = () => {};';

      const file = {
        name: componentName,
        path: componentPath,
        type: codegenUtils.ExtractedFileType.Component,
      };

      sandbox.stub(fs, 'existsSync').withArgs(componentPath).returns(true);
      sandbox.stub(fs, 'readFileSync').withArgs(componentPath).returns(fileContent);

      const fetchStub = sandbox
        .stub(globalThis as any, 'fetch')
        .callsFake(async (url: string, init: any) => {
          // Assert URL & payload so this test still has value without nock
          expect(url).to.equal(`${meshEndpoint}/mesh/push/api/v1/contentsdk/code/extracted`);
          expect(init.method).to.equal('POST');
          expect(init.headers.Authorization).to.equal(`Bearer ${token}`);

          const body = JSON.parse(init.body);
          expect(body).to.deep.equal({
            EnvironmentId: 'ContentSDK',
            name: file.name,
            content: fileContent,
            labels: { type: file.type },
          });

          return {
            ok: true,
            status: 200,
            statusText: 'OK',
            url,
            headers: new Map(),
            text: async () => '',
          } as any;
        });

      const result = await codegenUtils.sendCode({ file, token, targetUrl: meshEndpoint });
      expect(result).to.equal(componentPath);

      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should read file from componentPath and send code with variant data to meshEndpoint', async () => {
      const componentPath = '/path/to/component.ts';
      const token = 'test-token';
      const fileContent = 'export const test = () => {};';

      const file = {
        name: componentName,
        path: componentPath,
        type: codegenUtils.ExtractedFileType.Variant,
        labels: {
          componentName: 'Promo',
          variantName: 'dark',
        },
      };

      sandbox.stub(fs, 'existsSync').withArgs(componentPath).returns(true);
      sandbox.stub(fs, 'readFileSync').withArgs(componentPath).returns(fileContent);

      const fetchStub = sandbox
        .stub(globalThis as any, 'fetch')
        .callsFake(async (url: string, init: any) => {
          expect(url).to.equal(`${meshEndpoint}/mesh/push/api/v1/contentsdk/code/extracted`);
          expect(init.method).to.equal('POST');
          expect(init.headers.Authorization).to.equal(`Bearer ${token}`);

          const body = JSON.parse(init.body);
          expect(body).to.deep.equal({
            EnvironmentId: 'ContentSDK',
            name: file.name,
            content: fileContent,
            labels: {
              type: file.type,
              componentName: 'Promo',
              variantName: 'dark',
            },
          });

          return {
            ok: true,
            status: 200,
            statusText: 'OK',
            url,
            headers: new Map(),
            text: async () => '',
          } as any;
        });

      const result = await codegenUtils.sendCode({ file, token, targetUrl: meshEndpoint });
      expect(result).to.equal(componentPath);
      expect(fetchStub.calledOnce).to.be.true;
    });

    it('should log when componentPath file is not found', async () => {
      const componentPath = '/path/to/nonexistent-component.ts';
      const token = 'test-token';

      const file = {
        name: componentName,
        path: componentPath,
        type: codegenUtils.ExtractedFileType.Component,
      };

      sandbox.stub(fs, 'existsSync').withArgs(componentPath).returns(false);

      const consoleErrorStub = sandbox.stub(console, 'error');

      await codegenUtils.sendCode({ file, token, targetUrl: meshEndpoint });

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.equal(
        chalk.red(`File not found: ${componentPath}`)
      );
    });

    it('should log when meshEndpoint returns an error', async () => {
      const componentPath = '/path/to/component.ts';
      const token = 'test-token';
      const fileContent = 'export const test = () => {};';
      const file = {
        name: componentName,
        path: componentPath,
        type: codegenUtils.ExtractedFileType.Component,
      };

      sandbox.stub(fs, 'existsSync').withArgs(componentPath).returns(true);
      sandbox.stub(fs, 'readFileSync').withArgs(componentPath).returns(fileContent);

      nock(meshEndpoint)
        .post(
          '/mesh/push/api/v1/contentsdk/code/extracted',
          JSON.stringify({
            EnvironmentId: 'ContentSDK',
            name: file.name,
            content: fileContent,
            labels: {
              type: file.type,
            },
          })
        )
        .matchHeader('Authorization', `Bearer ${token}`)
        .reply(500, 'Internal Server Error');

      const consoleErrorStub = sandbox.stub(console, 'error');

      await codegenUtils.sendCode({ file, token, targetUrl: meshEndpoint });

      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(consoleErrorStub.firstCall.args[0]).to.equal(
        chalk.red('Failed to send extracted code from /path/to/component.ts: Internal Server Error')
      );
    });
  });

  describe('resolveComponentImportFiles', () => {
    const norm = (s: string) => s.replace(/\\/g, '/');
    it('should not throw if tsconfig.json is missing (falls back to defaults) as long as map exists', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/regular-imports';
      expect(() => codegenUtils.resolveComponentImportFiles(appPath)).to.not.throw();
    });

    it('throws error when component map file is not found', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/no-componentBuilder';
      const expectedPath = path.resolve(appPath, './.sitecore/component-map.ts');

      expect(() => codegenUtils.resolveComponentImportFiles(appPath)).to.throw(
        ReferenceError,
        `Failed to find file ${expectedPath}`
      );
    });

    it('returns identifier imports with absolute paths from default .sitecore/component-map.ts', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/regular-imports';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      const actual = res.map((i) => ({ ...i, filePath: norm(i.filePath) }));
      const expected = [
        {
          componentKey: 'TestComponent',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
            )
          ),
        },
        {
          componentKey: 'Component1',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
            )
          ),
        },
      ];

      expect(actual).to.deep.equal(expected);
      expect(uniqueFilesFrom(res).map(norm).sort()).to.deep.equal(
        [
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
          ),
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
          ),
        ]
          .map(norm)
          .sort()
      );
    });

    it('handles custom componentMap path (JS) and parses identifier entries', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/regular-imports';
      const mapPath = './src/non-standard-path/componentMap.js';
      const res = codegenUtils.resolveComponentImportFiles(appPath, mapPath);

      const actual = res.map((i) => ({ ...i, filePath: norm(i.filePath) }));
      const expected = [
        {
          componentKey: 'OtherComponent1',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
            )
          ),
        },
        {
          componentKey: 'OtherComponent2',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
            )
          ),
        },
      ];

      expect(actual).to.deep.equal(expected);
    });

    it('should handle variant spread entries from default .sitecore/component-map.ts', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/variants-imports';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      const actual = res.map((i) => ({ ...i, filePath: norm(i.filePath) }));
      const expected = [
        {
          componentKey: 'Promo',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(path.resolve(process.cwd(), appPath, 'src/components/Promo.tsx')),
        },
        {
          componentKey: 'Promo',
          fileType: codegenUtils.ExtractedFileType.Variant,
          filePath: norm(path.resolve(process.cwd(), appPath, 'src/components/Promo.variants.tsx')),
        },
      ];

      expect(actual).to.deep.equal(expected);
    });

    it('supports spread entries and returns both files for a single componentKey', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/js-imports';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      const actual = res.map((i) => ({ ...i, filePath: norm(i.filePath) }));
      const expected = [
        {
          componentKey: 'TestComponent',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/js-imports/src/components/TestComponent.jsx'
            )
          ),
        },
        {
          componentKey: 'Component1',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/js-imports/src/components/TestComponent2.jsx'
            )
          ),
        },
      ];

      expect(actual).to.deep.equal(expected);
    });

    it('returns entries when component map is initialized and later set (custom map pattern)', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/custom-component-map';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      const actual = res
        .map((i) => ({ ...i, filePath: norm(i.filePath) }))
        .sort((a, b) => a.filePath.localeCompare(b.filePath));

      const expected = [
        {
          componentKey: 'TestComponent',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/custom-component-map/src/components/TestComponent.tsx'
            )
          ),
        },
        {
          componentKey: 'TestComponent2',
          fileType: codegenUtils.ExtractedFileType.Component,
          filePath: norm(
            path.resolve(
              process.cwd(),
              './src/tools/codegen/test-data/extract-components/custom-component-map/src/components/TestComponent2.tsx'
            )
          ),
        },
      ].sort((a, b) => a.filePath.localeCompare(b.filePath));

      expect(actual).to.deep.equal(expected);
    });

    it('resolves with path aliases defined in tsconfig (with-path-aliases fixture)', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/with-path-aliases';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      expect(uniqueFilesFrom(res).map(norm)).to.deep.equal([
        norm(
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/with-path-aliases/src/components/TestComponent.tsx'
          )
        ),
      ]);
    });

    it('ignores non-relevant imports (node:, *.d.ts, node_modules) in the map entries', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/node-modules-imports';
      const res = codegenUtils.resolveComponentImportFiles(appPath);

      expect(uniqueFilesFrom(res).map(norm)).to.deep.equal([
        norm(
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/node-modules-imports/src/components/TestComponent.tsx'
          )
        ),
      ]);
    });
  });

  describe('validateDeployContext', () => {
    afterEach(() => {
      delete process.env.NETLIFY;
      delete process.env.VERCEL;
      delete process.env.SITECORE;
      delete process.env.BUILD_ID;
      delete process.env.VERCEL_REGION;
      delete process.env.SITECORE_BUILD;
    });

    it('should return true when in Netlify build context', () => {
      process.env.NETLIFY = 'true';
      process.env.BUILD_ID = '12345';

      const result = codegenUtils.validateDeployContext();

      expect(result).to.be.true;
    });

    it('should return true when in Vercel build context', () => {
      process.env.VERCEL = 'true';

      const result = codegenUtils.validateDeployContext();

      expect(result).to.be.true;
    });

    it('should return false in Vercel runtime', () => {
      process.env.VERCEL = 'true';
      process.env.VERCEL_REGION = 'region';

      expect(codegenUtils.validateDeployContext()).to.be.false;
    });

    it('should return true when in Sitecore build context', () => {
      process.env.SITECORE = 'true';
      process.env.SITECORE_BUILD = '12345';

      const result = codegenUtils.validateDeployContext();

      expect(result).to.be.true;
    });

    it('should return false when not in a recognized build context', () => {
      expect(codegenUtils.validateDeployContext()).to.be.false;
    });
  });

  describe('Path & Import Utils', () => {
    describe('toPosixPath', () => {
      it('converts backslashes to forward slashes', () => {
        expect(toPosixPath('C:\\repo\\app\\src\\index.ts')).to.equal('C:/repo/app/src/index.ts');
        expect(toPosixPath('some\\nested\\dir')).to.equal('some/nested/dir');
      });
      it('leaves forward slashes unchanged', () => {
        expect(toPosixPath('C:/repo/app/src/index.ts')).to.equal('C:/repo/app/src/index.ts');
        expect(toPosixPath('some/nested/dir')).to.equal('some/nested/dir');
      });
    });

    describe('stripExtension', () => {
      it('removes supported script extensions', () => {
        expect(stripExtension('file.ts')).to.equal('file');
        expect(stripExtension('file.tsx')).to.equal('file');
        expect(stripExtension('file.js')).to.equal('file');
        expect(stripExtension('file.jsx')).to.equal('file');
        expect(stripExtension('file.mjs')).to.equal('file');
        expect(stripExtension('file.cjs')).to.equal('file');
      });

      it('leaves other extensions unchanged', () => {
        expect(stripExtension('file.json')).to.equal('file.json');
        expect(stripExtension('styles.css')).to.equal('styles.css');
        expect(stripExtension('archive.tar.gz')).to.equal('archive.tar.gz');
      });

      it('only strips the final extension', () => {
        expect(stripExtension('lib/utils/index.tsx')).to.equal('lib/utils/index');
      });
    });

    describe('getRelativeImportPath', () => {
      it('returns POSIX, extensionless path relative to app root', () => {
        const appRoot = path.resolve('/repo/app');
        const absFile = path.resolve(appRoot, 'src', 'components', 'Button.tsx');
        const rel = getRelativeImportPath(absFile, appRoot);
        expect(rel).to.equal('src/components/Button');
      });

      it('normalizes separators regardless of OS', () => {
        const appRoot = path.resolve('/repo/app');
        const absFile = path.resolve(appRoot, 'lib', 'utils', 'index.mjs');
        const rel = getRelativeImportPath(absFile, appRoot);
        expect(rel).to.equal('lib/utils/index');
      });
    });

    describe('isNodeModuleImportOrAlias', () => {
      it('returns true for package names and alias-like specifiers', () => {
        ['react', '@scope/pkg', 'components/Button', '#internal', 'somePkg'].forEach((s) =>
          expect(isNodeModuleImportOrAlias(s), s).to.equal(true)
        );
      });

      it('returns false for relative and absolute specifiers', () => {
        ['./x', '../x', '/abs/path'].forEach((s) =>
          expect(isNodeModuleImportOrAlias(s), s).to.equal(false)
        );
      });
    });
  });
});
