/* eslint-disable quotes */
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';
import { generateMap, matchPath } from './generateMap';
import fs from 'fs';
import { PackageDefinition } from '@sitecore-content-sdk/core/tools';
import * as coreTools from '@sitecore-content-sdk/core/tools';
import { ComponentFile } from '@sitecore-content-sdk/core/src/tools';

describe('generateMap', () => {
  const sandbox = sinon.createSandbox();

  describe('matchPath', () => {
    it('should return true when both paths are matching relative path', () => {
      const relPath = 'src/components/Button.tsx';
      expect(matchPath(relPath, relPath)).to.be.true;
    });

    it('should return true if componentPath is relative and matches to absolute "compare" path', () => {
      const relPath = 'src/components/Button.tsx';
      const absPath = path.join(process.cwd(), relPath);
      expect(matchPath(relPath, absPath)).to.be.true;
    });

    it('should return true if "compare" path is relative and matches to absolute componentPath', () => {
      const relPath = 'src/components/Button.tsx';
      const absPath = path.join(process.cwd(), relPath);
      expect(matchPath(absPath, relPath)).to.be.true;
    });

    it('should return true if "compare" is a matching regex string', () => {
      const componentPath = 'src/components/Button.tsx';
      const regexString = 'Button\\.tsx$';
      expect(matchPath(componentPath, regexString)).to.be.true;
    });

    it('should return false if paths do not match', () => {
      const componentPath = 'src/components/Button.tsx';
      const comparePath = 'src/components/Link.tsx';
      expect(matchPath(componentPath, comparePath)).to.be.false;
    });
  });

  describe('generateMap', () => {
    const fakeComponentList: ComponentFile[] = [
      {
        componentName: 'Button',
        moduleName: 'Button',
        path: './src/components/Button',
      },
      {
        componentName: 'Link',
        moduleName: 'Link',
        path: './src/components/Link',
      },
    ];

    const fakePackages: PackageDefinition[] = [
      {
        name: 'MyLib',
        importInfo: {
          importFrom: '@my/lib',
          imports: '*',
        },
      },
      {
        name: 'OtherLib',
        importInfo: {
          importFrom: '@other/lib',
          imports: ['CompA', 'CompB'],
        },
      },
    ];

    beforeEach(() => {
      sandbox.replaceGetter(coreTools, 'getComponentList', () => (componentPath: string) => {
        console.log(componentPath);
        // Return fakeComponentList for any path
        return fakeComponentList;
      });
      sandbox.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should write componentMap.ts file with components from "paths" parameter', async () => {
      const paths = ['src/components'];
      generateMap({ paths })();

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));

      expect(content).to.include(
        "import { BYOCWrapper, NextjsJssComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';"
      );

      expect(content).to.include("import * as Button from './src/components/Button';");
      expect(content).to.include("import * as Link from './src/components/Link';");
      expect(content).to.include(
        [
          'export const componentMap = new Map<string, NextjsJssComponent>([',
          "  ['Button', Button],",
          "  ['Link', Link],",
          ']);',
        ].join('\n')
      );
      expect(content).to.include('export default componentMap;');
    });

    it('should write componentMap.ts file with components from "paths" and "packages" parameters, when provided', async () => {
      const paths = ['src/components'];
      generateMap({ paths, packages: fakePackages })();

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import * as MyLib from '@my/lib';");
      expect(content).to.include("import { CompA, CompB } from '@other/lib';");

      expect(content).to.include(
        [
          'export const componentMap = new Map<string, NextjsJssComponent>([',
          "  ['Button', Button],",
          "  ['Link', Link],",
          "  ['MyLib', MyLib],",
          "  ['CompA', CompA],",
          "  ['CompB', CompB],",
          ']);',
        ].join('\n')
      );
    });

    it('should use custom destination when provided', async () => {
      const paths = ['src/components'];
      const customDest = path.join(process.cwd(), 'custom/path', 'component-map.ts');
      generateMap({ paths, destination: 'custom/path' })();

      expect(fs.writeFileSync).to.have.been.calledOnceWith(
        customDest,
        sinon.match.string,
        sinon.match.object
      );
    });

    it('should throw error when destination cannot be written to', async () => {
      (fs.writeFileSync as sinon.SinonStub).throws(new Error('Disk full'));
      const paths = ['src/components'];
      let errorCaught = null;
      try {
        generateMap({ paths })();
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.be.an('error');
      expect((errorCaught as Error).message).to.equal('Disk full');
    });

    it('should import components from "packages" as wildcard when imports are specified as such', async () => {
      const paths = ['src/components'];
      const wildcardPackages: PackageDefinition[] = [
        {
          name: 'WildcardLib',
          importInfo: {
            importFrom: '@wildcard/lib',
            imports: '*',
          },
        },
      ];
      generateMap({ paths, packages: wildcardPackages })();

      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import * as WildcardLib from '@wildcard/lib';");
      expect(content).to.include(
        [
          'export const componentMap = new Map<string, NextjsJssComponent>([',
          "  ['Button', Button],",
          "  ['Link', Link],",
          "  ['WildcardLib', WildcardLib],",
          ']);',
        ].join('\n')
      );
    });

    it('should use named component imports when "packages" contain them', async () => {
      const paths = ['src/components'];
      const namedPackages: PackageDefinition[] = [
        {
          name: 'NamedLib',
          importInfo: {
            importFrom: '@named/lib',
            imports: ['NamedA', 'NamedB'],
          },
        },
      ];
      generateMap({ paths, packages: namedPackages })();

      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import { NamedA, NamedB } from '@named/lib';");
      expect(content).to.include(
        [
          'export const componentMap = new Map<string, NextjsJssComponent>([',
          "  ['Button', Button],",
          "  ['Link', Link],",
          "  ['NamedA', NamedA],",
          "  ['NamedB', NamedB],",
          ']);',
        ].join('\n')
      );
    });
  });
});
