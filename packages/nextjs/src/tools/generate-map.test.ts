/* eslint-disable quotes */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
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

  describe('clientComponentMap functionality', () => {
    const fakeComponentsWithTypes = [
      {
        componentName: 'ClientButton',
        moduleName: 'ClientButton',
        importPath: './src/components/ClientButton',
        componentType: 'client' as const,
      },
      {
        componentName: 'ServerData',
        moduleName: 'ServerData',
        importPath: './src/components/ServerData',
        componentType: 'server' as const,
      },
      {
        componentName: 'UniversalCard',
        moduleName: 'UniversalCard',
        importPath: './src/components/UniversalCard',
        componentType: 'universal' as const,
      },
    ];

    let getComponentListWithTypesStub: sinon.SinonStub;
    let detectRouterTypeStub: sinon.SinonStub;
    let filterComponentsByTypeStub: sinon.SinonStub;

    beforeEach(() => {
      getComponentListWithTypesStub = sandbox.stub().returns(fakeComponentsWithTypes);
      detectRouterTypeStub = sandbox.stub().returns('app');
      filterComponentsByTypeStub = sandbox.stub().returns([
        fakeComponentsWithTypes[0], // ClientButton
        fakeComponentsWithTypes[2], // UniversalCard
      ]);

      sandbox.replaceGetter(
        coreTools,
        'getComponentListWithTypes',
        () => getComponentListWithTypesStub
      );
      sandbox.replaceGetter(coreTools, 'detectRouterType', () => detectRouterTypeStub);
      sandbox.replaceGetter(coreTools, 'filterComponentsByType', () => filterComponentsByTypeStub);
      sandbox.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should generate both component maps when clientComponentMap is true', async () => {
      const paths = ['src/components'];
      generateMap({ paths, clientComponentMap: true });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      // Check main component map
      const [mainDest, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(mainDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
      expect(mainContent).to.include(
        "import * as ClientButton from './src/components/ClientButton';"
      );
      expect(mainContent).to.include("import * as ServerData from './src/components/ServerData';");
      expect(mainContent).to.include(
        "import * as UniversalCard from './src/components/UniversalCard';"
      );
      expect(mainContent).to.include("['ClientButton', ClientButton],");
      expect(mainContent).to.include("['ServerData', ServerData],");
      expect(mainContent).to.include("['UniversalCard', UniversalCard],");

      // Check client component map
      const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.client.ts'));
      expect(clientContent).to.include('Client-safe component map for App Router');
      expect(clientContent).to.include(
        "import * as ClientButton from './src/components/ClientButton';"
      );
      expect(clientContent).to.include(
        "import * as UniversalCard from './src/components/UniversalCard';"
      );
      expect(clientContent).to.not.include('ServerData'); // Should exclude server components
      expect(clientContent).to.include("['ClientButton', ClientButton],");
      expect(clientContent).to.include("['UniversalCard', UniversalCard],");
    });

    it('should generate only main component map when clientComponentMap is false', async () => {
      const paths = ['src/components'];
      // Reset stubs for this test - use getComponentList instead of getComponentListWithTypes
      sandbox.restore();
      const newSandbox = sinon.createSandbox();

      const fakeComponentList = [
        {
          componentName: 'ClientButton',
          moduleName: 'ClientButton',
          importPath: './src/components/ClientButton',
        },
        {
          componentName: 'ServerData',
          moduleName: 'ServerData',
          importPath: './src/components/ServerData',
        },
        {
          componentName: 'UniversalCard',
          moduleName: 'UniversalCard',
          importPath: './src/components/UniversalCard',
        },
      ];

      const getComponentListStub = newSandbox.stub().returns(fakeComponentList);
      newSandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      newSandbox.stub(fs, 'writeFileSync');

      generateMap({ paths, clientComponentMap: false });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      expect(getComponentListStub).to.have.been.calledOnce;

      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
      expect(content).to.include("import * as ClientButton from './src/components/ClientButton';");
      expect(content).to.include("import * as ServerData from './src/components/ServerData';");
      expect(content).to.include(
        "import * as UniversalCard from './src/components/UniversalCard';"
      );

      newSandbox.restore();
    });

    it('should auto-detect App Router and generate both maps when clientComponentMap is undefined', async () => {
      const paths = ['src/components'];
      generateMap({ paths }); // clientComponentMap is undefined

      expect(detectRouterTypeStub).to.have.been.calledOnce;
      expect(fs.writeFileSync).to.have.been.calledTwice;
    });

    it('should auto-detect Pages Router and generate single map when clientComponentMap is undefined', async () => {
      detectRouterTypeStub.returns('pages');
      const paths = ['src/components'];
      generateMap({ paths }); // clientComponentMap is undefined

      expect(detectRouterTypeStub).to.have.been.calledOnce;
      expect(fs.writeFileSync).to.have.been.calledOnce;
    });

    it('should use custom clientMapTemplate when provided', async () => {
      const paths = ['src/components'];
      const customClientTemplate = sandbox.stub().returns('// custom client template');
      generateMap({ paths, clientComponentMap: true, clientMapTemplate: customClientTemplate });

      expect(customClientTemplate).to.have.been.calledOnce;
      expect(customClientTemplate.getCall(0).args[0]).to.deep.equal([
        fakeComponentsWithTypes[0], // ClientButton
        fakeComponentsWithTypes[2], // UniversalCard
      ]);

      const [, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientContent).to.equal('// custom client template');
    });

    it('should handle errors when writing client component map fails', async () => {
      const paths = ['src/components'];
      (fs.writeFileSync as sinon.SinonStub)
        .onFirstCall()
        .returns(undefined) // Main map succeeds
        .onSecondCall()
        .throws(new Error('Client map write failed'));

      expect(() => generateMap({ paths, clientComponentMap: true })).to.throw(
        'Client map write failed'
      );
    });

    it('should call getComponentListWithTypes when generating dual maps', async () => {
      const paths = ['src/components'];
      generateMap({ paths, clientComponentMap: true });

      expect(getComponentListWithTypesStub).to.have.been.calledOnce;
      expect(getComponentListWithTypesStub.getCall(0).args[0]).to.deep.equal(paths);
    });

    it('should call filterComponentsByType with correct component types for client map', async () => {
      const paths = ['src/components'];
      generateMap({ paths, clientComponentMap: true });

      expect(filterComponentsByTypeStub).to.have.been.calledOnce;
      expect(filterComponentsByTypeStub.getCall(0).args[0]).to.deep.equal(fakeComponentsWithTypes);
      expect(filterComponentsByTypeStub.getCall(0).args[1]).to.deep.equal(['client', 'universal']);
    });
  });
});
