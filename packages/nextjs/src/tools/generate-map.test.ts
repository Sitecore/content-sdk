/* eslint-disable quotes */
import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';
import { generateMap } from './generate-map';
import fs from 'fs';
import { ComponentImport } from '@sitecore-content-sdk/core/tools';
import * as coreTools from '@sitecore-content-sdk/core/tools';

describe('generateMap', () => {
  const sandbox = sinon.createSandbox();

  describe('generateMap', () => {
    const fakeComponentList = [
      {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
      },
      {
        componentName: 'Link',
        moduleName: 'Link',
        importPath: './src/components/Link',
      },
    ];

    const fakePackages: ComponentImport[] = [
      {
        importName: 'MyLib',
        importInfo: {
          importFrom: '@my/lib',
        },
      },
      {
        importName: 'OtherLib',
        importInfo: {
          importFrom: '@other/lib',
          namedImports: ['CompA', 'CompB'],
        },
      },
    ];

    let getComponentListStub = sandbox.stub().returns(fakeComponentList);

    beforeEach(() => {
      getComponentListStub = sandbox.stub().returns(fakeComponentList);
      sandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      sandbox.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should write componentMap.ts file with components from "paths" parameter', async () => {
      const paths = ['src/components'];
      generateMap({ paths });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));

      expect(content).to.include(
        "import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';"
      );

      expect(content).to.include("import * as Button from './src/components/Button';");
      expect(content).to.include("import * as Link from './src/components/Link';");
      expect(content).to.include(
        [
          'export const componentMap = new Map<string, NextjsContentSdkComponent>([',
          "  ['BYOCWrapper', BYOCWrapper],",
          "  ['FEaaSWrapper', FEaaSWrapper],",
          "  ['Form', Form],",
          "  ['Button', Button],",
          "  ['Link', Link],",
          ']);',
        ].join('\n')
      );
      expect(content).to.include('export default componentMap;');
    });

    it('should use template from custom componentMap function, when provided', async () => {
      const paths = ['src/components'];
      const customTemplate = sinon.stub().returns('// custom template output');
      const fakePackages = [
        {
          importName: 'CustomLib',
          importInfo: {
            importFrom: '@custom/lib',
          },
        },
      ];
      generateMap({ paths, componentImports: fakePackages, mapTemplate: customTemplate });

      expect(customTemplate).to.have.been.calledOnce;
      expect(customTemplate.getCall(0).args[0]).to.deep.equal(fakeComponentList);
      expect(customTemplate.getCall(0).args[1]).to.deep.equal(fakePackages);
      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.equal('// custom template output');
    });

    it('should generate an empty component map if no components are found', async () => {
      getComponentListStub.returns([]);
      const paths = ['src/components'];
      generateMap({ paths });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include(
        'export const componentMap = new Map<string, NextjsContentSdkComponent>('
      );
      expect(content).to.include("['BYOCWrapper', BYOCWrapper],");
      expect(content).to.include("['FEaaSWrapper', FEaaSWrapper],");
      expect(content).to.include("['Form', Form],");
    });

    it('should handle multiple paths and merge their components', async () => {
      const paths = ['src/components', 'src/other-components'];
      // Simulate different components for each path
      getComponentListStub.returns([
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
        },
        {
          componentName: 'Card',
          moduleName: 'Card',
          importPath: './src/other-components/Card',
        },
      ]);
      generateMap({ paths });

      expect(getComponentListStub).to.have.been.calledOnce;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import * as Button from './src/components/Button';");
      expect(content).to.include("import * as Card from './src/other-components/Card';");
      expect(content).to.include("['Button', Button],");
      expect(content).to.include("['Card', Card],");
    });

    it('should not fail if packages is undefined', async () => {
      const paths = ['src/components'];
      expect(() => generateMap({ paths, componentImports: undefined })).to.not.throw();
      expect(fs.writeFileSync).to.have.been.calledOnce;
    });

    it('should write componentMap.ts file with components from "paths" and "packages" parameters, when provided', async () => {
      const paths = ['src/components'];
      generateMap({ paths, componentImports: fakePackages });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import * as MyLib from '@my/lib';");
      expect(content).to.include("import { CompA, CompB } from '@other/lib';");

      expect(content).to.include(
        'export const componentMap = new Map<string, NextjsContentSdkComponent>(['
      );
      expect(content).to.include("['MyLib', MyLib],");
      expect(content).to.include("['CompA', CompA]");
      expect(content).to.include("['CompB', CompB],");
    });

    it('should use custom destination when provided', async () => {
      const paths = ['src/components'];
      const customDest = path.join(process.cwd(), 'custom/path', 'component-map.ts');
      generateMap({ paths, destination: 'custom/path' });

      expect(fs.writeFileSync).to.have.been.calledOnceWith(
        customDest,
        sinon.match.string,
        sinon.match.object
      );
    });

    it('should pass exclude param into getComponentList call', async () => {
      const paths = ['src/components'];
      const exclude = ['**/*.stories.tsx', '**/*.test.tsx'];
      generateMap({ paths, exclude });

      expect(getComponentListStub).to.have.been.calledOnce;
      expect(getComponentListStub.getCall(0).args[1]).to.deep.equals(exclude);
    });

    it('should throw error when destination cannot be written to', async () => {
      (fs.writeFileSync as sinon.SinonStub).throws(new Error('Disk full'));
      const paths = ['src/components'];
      let errorCaught = null;
      try {
        generateMap({ paths });
      } catch (err) {
        errorCaught = err;
      }
      expect(errorCaught).to.be.an('error');
      expect((errorCaught as Error).message).to.equal('Disk full');
    });

    it('should import components from "packages" as wildcard when namedImports are not specified', async () => {
      const paths = ['src/components'];
      const wildcardPackages: ComponentImport[] = [
        {
          importName: 'WildcardLib',
          importInfo: {
            importFrom: '@wildcard/lib',
          },
        },
      ];
      generateMap({ paths, componentImports: wildcardPackages });

      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import * as WildcardLib from '@wildcard/lib';");
      expect(content).to.include(
        'export const componentMap = new Map<string, NextjsContentSdkComponent>(['
      );
      expect(content).to.include("['WildcardLib', WildcardLib],");
    });

    it('should use named component imports when "packages" contain them', async () => {
      const paths = ['src/components'];
      const namedPackages: ComponentImport[] = [
        {
          importName: 'NamedLib',
          importInfo: {
            importFrom: '@named/lib',
            namedImports: ['NamedA', 'NamedB'],
          },
        },
      ];
      generateMap({ paths, componentImports: namedPackages });

      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.include("import { NamedA, NamedB } from '@named/lib';");
      expect(content).to.include(
        'export const componentMap = new Map<string, NextjsContentSdkComponent>(['
      );
      expect(content).to.include("['NamedA', NamedA],");
      expect(content).to.include("['NamedB', NamedB],");
    });
  });
});
