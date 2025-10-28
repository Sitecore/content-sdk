/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import sinon from 'sinon';
import chalk from 'chalk';
import * as path from 'path';
import nock from 'nock';
import fs from 'fs';
import * as codegenUtils from './utils';
import { toPosixPath, stripExtension, getRelativeImportPath, isNodeModuleImport } from './utils';

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
        .reply(200);

      const result = await codegenUtils.sendCode({ file, token, targetUrl: meshEndpoint });

      expect(result).to.equal(componentPath);
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
    it('should throw when tsconfig.json is not found under baseApp path', () => {
      const appPath = './path/to/app/that/not/exist';

      expect(() => codegenUtils.resolveComponentImportFiles(appPath)).to.throw(
        Error,
        // eslint-disable-next-line
        `Error reading tsconfig.json from JSS app root: Cannot read file '${path.resolve(
          process.cwd(),
          './path/to/app/that/not/exist/tsconfig.json'
        )}'`
      );
    });

    it('should throw when .sitecore/component-map.ts is not found', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/no-componentBuilder';
      const appRoot = process.cwd();
      const expectedPath = path.resolve(
        appRoot,
        './src/tools/codegen/test-data/extract-components/no-componentBuilder/.sitecore/component-map.ts'
      );
      expect(() => codegenUtils.resolveComponentImportFiles(appPath)).to.throw(
        ReferenceError,
        `Failed to find file ${expectedPath}`
      );
    });

    it('should return JS imports with absolute paths from component-map.ts', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/regular-imports';
      const imports = codegenUtils.resolveComponentImportFiles(appPath);
      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
          ),
        ],
        [
          'TestComponent2',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
          ),
        ],
      ]);
    });

    it('should handle custom componentMap path and parse js', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/regular-imports';
      const mapPath = './src/non-standard-path/componentMap.js';
      const imports = codegenUtils.resolveComponentImportFiles(appPath, mapPath);
      expect(Array.from(imports)).to.deep.equal([
        [
          'OtherComponent1',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent.tsx'
          ),
        ],
        [
          'OtherComponent2',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/regular-imports/src/components/TestComponent2.tsx'
          ),
        ],
      ]);
    });

    it('should return imports with absolute paths from component-map.ts', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/js-imports';

      const imports = codegenUtils.resolveComponentImportFiles(appPath);
      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/js-imports/src/components/TestComponent.jsx'
          ),
        ],
        [
          'TestComponent2',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/js-imports/src/components/TestComponent2.jsx'
          ),
        ],
      ]);
    });

    it('should return imports with absolute paths when component map is initialized with values and set with values', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/custom-component-map';
      const imports = codegenUtils.resolveComponentImportFiles(appPath);
      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/custom-component-map/src/components/TestComponent.tsx'
          ),
        ],
        [
          'TestComponent2',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/custom-component-map/src/components/TestComponent2.tsx'
          ),
        ],
      ]);
    });

    it('should return imports with absolute paths from component-map.ts with named imports', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/named-imports';

      const imports = codegenUtils.resolveComponentImportFiles(appPath);
      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/named-imports/src/components/TestComponent.tsx'
          ),
        ],
        [
          'Component1',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/named-imports/src/components/TestComponent2.tsx'
          ),
        ],
        [
          'Component2',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/named-imports/src/components/TestComponent2.tsx'
          ),
        ],
      ]);
    });

    it('should return imports with absolute paths from component-map.ts when paths aliases are used', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/with-path-aliases';
      const imports = codegenUtils.resolveComponentImportFiles(appPath);

      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/with-path-aliases/src/components/TestComponent.tsx'
          ),
        ],
      ]);
    });

    it('should ignore imports starting with "node:", ending with ".d.ts" and containing "node_modules"', () => {
      const appPath = './src/tools/codegen/test-data/extract-components/node-modules-imports';
      const imports = codegenUtils.resolveComponentImportFiles(appPath);

      expect(Array.from(imports)).to.deep.equal([
        [
          'TestComponent',
          path.resolve(
            process.cwd(),
            './src/tools/codegen/test-data/extract-components/node-modules-imports/src/components/TestComponent.tsx'
          ),
        ],
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

    describe('isNodeModuleImport', () => {
      it('returns true for package names and alias-like specifiers', () => {
        ['react', '@scope/pkg', 'components/Button', '#internal', 'somePkg'].forEach((s) =>
          expect(isNodeModuleImport(s), s).to.equal(true)
        );
      });

      it('returns false for relative and absolute specifiers', () => {
        ['./x', '../x', '/abs/path'].forEach((s) =>
          expect(isNodeModuleImport(s), s).to.equal(false)
        );
      });
    });
  });
});
