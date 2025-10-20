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
    const abs = (p: string) => path.resolve(process.cwd(), p);
    const fakeComponentList = [
      {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
      },
      {
        componentName: 'Link',
        moduleName: 'Link',
        importPath: './src/components/Link',
        filePath: abs('src/components/Link.tsx'),
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
    let getComponentListWithTypesStub: sinon.SinonStub;
    let detectRouterTypeStub: sinon.SinonStub;
    let filterComponentsByTypeStub: sinon.SinonStub;

    const fakeComponentsWithTypes = [
      {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client' as const,
        isVariant: false,
      },
      {
        componentName: 'Link',
        moduleName: 'Link',
        importPath: './src/components/Link',
        filePath: abs('src/components/Link.tsx'),
        componentType: 'universal' as const,
        isVariant: false,
      },
    ];

    beforeEach(() => {
      getComponentListStub = sandbox.stub().returns(fakeComponentList);
      getComponentListWithTypesStub = sandbox.stub().returns(fakeComponentsWithTypes);
      detectRouterTypeStub = sandbox.stub().returns('app'); // Default to App Router for tests
      filterComponentsByTypeStub = sandbox.stub().returns(fakeComponentsWithTypes);

      sandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
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

    it('should write componentMap.ts file with components from "paths" parameter', async () => {
      const paths = ['src/components'];

      generateMap({ paths, enableVariantsInMap: false });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));

      expect(content).to.include(
        "import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';"
      );

      expect(content).to.include("import * as Button from './src/components/Button';");
      expect(content).to.include("import * as Link from './src/components/Link';");

      expect(content).to.include('new Map');

      expect(content).to.match(/\['Button'[\s\S]*Button/);
      expect(content).to.include("componentType: 'client'");

      expect(content).to.match(/\['Link'[\s\S]*Link/);

      expect(content.replace(/\s+/g, ' ')).to.include('export default componentMap');
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
      expect(customTemplate.getCall(0).args[0]).to.deep.equal(fakeComponentsWithTypes);
      expect(customTemplate.getCall(0).args[1]).to.deep.equal(fakePackages);
      expect(fs.writeFileSync).to.have.been.calledTwice;
      const [, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(content).to.equal('// custom template output');
    });

    it('should generate an empty component map if no components are found', async () => {
      getComponentListWithTypesStub.returns([]);
      const paths = ['src/components'];
      generateMap({ paths });

      expect(fs.writeFileSync).to.have.been.calledTwice;
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
      const abs = (p: string) => path.resolve(process.cwd(), p);

      const allWithTypes = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: abs('src/components/Button.tsx'),
          componentType: 'client' as const,
          isVariant: false,
        },
        {
          componentName: 'Link',
          moduleName: 'Link',
          importPath: './src/components/Link',
          filePath: abs('src/components/Link.tsx'),
          componentType: 'universal' as const,
          isVariant: false,
        },
        {
          componentName: 'Card',
          moduleName: 'Card',
          importPath: './src/other-components/Card',
          filePath: abs('src/other-components/Card.tsx'),
          componentType: 'server' as const,
          isVariant: false,
        },
      ];

      getComponentListWithTypesStub.callsFake(() => allWithTypes);

      filterComponentsByTypeStub.callsFake((list: any[], types: string[]) =>
        list.filter((c) => types.includes(c.componentType))
      );

      generateMap({ paths, enableVariantsInMap: false });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      const [mainDest, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(mainDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));

      expect(mainContent).to.include("import * as Button from './src/components/Button';");
      expect(mainContent).to.include("import * as Link from './src/components/Link';");
      expect(mainContent).to.include("import * as Card from './src/other-components/Card';");

      expect(mainContent).to.include('new Map');

      expect(mainContent).to.match(/\['Button'[\s\S]*Button/);
      expect(mainContent).to.include("componentType: 'client'");
      expect(mainContent).to.match(/\['Link'[\s\S]*Link/);
      expect(mainContent).to.match(/\['Card'[\s\S]*Card/);

      const [, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientContent).to.include('new Map');
      expect(clientContent).to.include("import * as Button from './src/components/Button';");
      expect(clientContent).to.include("import * as Link from './src/components/Link';");
      expect(clientContent).to.not.include("import * as Card from './src/other-components/Card';");
    });

    it('should not fail if packages is undefined', async () => {
      const paths = ['src/components'];
      expect(() => generateMap({ paths, componentImports: undefined })).to.not.throw();
      expect(fs.writeFileSync).to.have.been.calledTwice;
    });

    it('should write componentMap.ts file with components from "paths" and "packages" parameters, when provided', async () => {
      const paths = ['src/components'];
      generateMap({ paths, componentImports: fakePackages });

      expect(fs.writeFileSync).to.have.been.calledTwice;
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
      const customDir = path.join(process.cwd(), 'custom/path');
      const mainDest = path.join(customDir, 'component-map.ts');
      const clientDest = path.join(customDir, 'component-map.client.ts');

      generateMap({ paths, destination: 'custom/path', enableVariantsInMap: false });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      const encodingArg = sinon.match.string.or(sinon.match.has('encoding'));

      expect(fs.writeFileSync).to.have.been.calledWithMatch(
        mainDest,
        sinon.match.string,
        encodingArg
      );

      // Client map write
      expect(fs.writeFileSync).to.have.been.calledWithMatch(
        clientDest,
        sinon.match.string,
        encodingArg
      );
    });

    it('should pass exclude param into getComponentListWithTypes call', async () => {
      const paths = ['src/components'];
      const exclude = ['**/*.stories.tsx', '**/*.test.tsx'];
      generateMap({ paths, exclude });

      expect(getComponentListWithTypesStub).to.have.been.calledOnce;
      expect(getComponentListWithTypesStub.getCall(0).args[1]).to.deep.equals(exclude);
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

    it('should group neighbor files into variants when in App Router + enableVariantsInMap=true', async () => {
      const withNeighbor = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
          componentType: 'universal' as const,
        },
        {
          componentName: 'Link',
          moduleName: 'Link',
          importPath: './src/components/Link',
          filePath: path.join(process.cwd(), 'src/components/Link.tsx'),
          componentType: 'universal' as const,
        },
      ];
      getComponentListWithTypesStub.returns(withNeighbor);
      filterComponentsByTypeStub
        .withArgs(withNeighbor, ['client', 'universal'])
        .returns(withNeighbor);

      generateMap({
        paths: ['src/components'],
        enableVariantsInMap: true,
        clientComponentMap: true,
      });

      expect(fs.writeFileSync).to.have.been.calledTwice;
      const [, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;

      expect(mainContent).to.include(
        "import * as Buttonextra from './src/components/Button.extra';"
      );
      expect(mainContent).to.include("import * as Button from './src/components/Button';");

      expect(mainContent.replace(/\s+/g, ' ')).to.include(
        "['Button', { ...{ ...Buttonextra, ...Button }, componentType: 'client' }]"
      );

      expect(mainContent).to.match(/\['Link',\s*(\{[^]*?\.{3}Link[^]*?\}|Link)\s*\],/);
      const linkEntryMain = mainContent.match(/\['Link',\s*([^\]]+)\],/);
      expect(linkEntryMain?.[1] || '').to.not.include("componentType: 'client'");

      const [, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientContent.replace(/\s+/g, ' ')).to.include(
        "['Button', { ...Buttonextra, ...Button }]"
      );
      expect(clientContent).to.not.include("componentType: 'client'");
      expect(clientContent).to.match(/\['Link',\s*(\{[^]*?\.{3}Link[^]*?\}|Link)\s*\],/);
    });

    it('should groups neighbors in a single main map when in Pages Router + enableVariantsInMap=true(no client map)', async () => {
      detectRouterTypeStub.returns('pages');

      const withNeighborNoTypes = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
        },
        {
          componentName: 'Link',
          moduleName: 'Link',
          importPath: './src/components/Link',
          filePath: path.join(process.cwd(), 'src/components/Link.tsx'),
        },
      ];
      getComponentListStub.returns(withNeighborNoTypes);

      generateMap({
        paths: ['src/components'],
        enableVariantsInMap: true,
      });

      expect(fs.writeFileSync).to.have.been.calledOnce;

      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(String(dest)).to.match(/\.sitecore[\/\\]component-map\.ts$/);

      expect(content).to.include("import * as Buttonextra from './src/components/Button.extra';");
      expect(content).to.include("import * as Button from './src/components/Button';");

      const btnEntry = content.replace(/\s+/g, ' ');
      expect(btnEntry).to.include("['Button', { ...Buttonextra, ...Button }]");
      expect(btnEntry).to.not.include("componentType: 'client'");

      expect(content).to.match(/\['Link',\s*(\{[^]*?\.{3}Link[^]*?\}|Link)\s*\],/);
    });

    it('should strip neighbor files when in App Router + clientComponentMap=true + enableVariantsInMap=false', async () => {
      const withNeighbor = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
          componentType: 'server' as const,
        },
        {
          componentName: 'Link',
          moduleName: 'Link',
          importPath: './src/components/Link',
          filePath: path.join(process.cwd(), 'src/components/Link.tsx'),
          componentType: 'universal' as const,
        },
      ];
      getComponentListWithTypesStub.returns(withNeighbor);
      filterComponentsByTypeStub
        .withArgs(withNeighbor, ['client', 'universal'])
        .returns([withNeighbor[0], withNeighbor[2]]);

      generateMap({
        paths: ['src/components'],
        enableVariantsInMap: false,
        clientComponentMap: true,
      });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      const [, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(mainContent).to.not.include(
        "import * as Buttonextra from './src/components/Button.extra';"
      );
      expect(mainContent).to.include("import * as Button from './src/components/Button';");

      const buttonEntryMain = mainContent.match(/\['Button',\s*([^\]]+)\],/);
      expect(buttonEntryMain, 'Button entry should exist in main map').to.not.be.null;

      const buttonValueMain = (buttonEntryMain?.[1] || '').replace(/\s+/g, ' ');
      expect(buttonValueMain).to.include("componentType: 'client'");
      expect(buttonValueMain).to.match(/(\.\.\.Button|Button)/);

      expect(mainContent).to.match(/\['Link',\s*(\{[^]*?\.{3}Link[^]*?\}|Link)\s*\],/);

      const [, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientContent).to.not.include('Buttonextra');

      const buttonEntryClient = clientContent.match(/\['Button',\s*([^\]]+)\],/);
      expect(buttonEntryClient, 'Button entry should exist in client map').to.not.be.null;
      expect(buttonEntryClient?.[1] || '').to.not.include("componentType: 'client'");
      expect(clientContent).to.match(/\['Link',\s*(\{[^]*?\.{3}Link[^]*?\}|Link)\s*\],/);
    });

    it('should pass unstripped arrays to custom templates when in App Router + clientComponentMap=true + enableVariantsInMap=true', async () => {
      const withNeighbor = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
          componentType: 'universal' as const,
        },
      ];
      getComponentListWithTypesStub.returns(withNeighbor);
      filterComponentsByTypeStub
        .withArgs(withNeighbor, ['client', 'universal'])
        .returns(withNeighbor);

      const customMain = sinon.stub().returns('// main-out');
      const customClient = sinon.stub().returns('// client-out');

      generateMap({
        paths: ['src/components'],
        enableVariantsInMap: true,
        clientComponentMap: true,
        mapTemplate: customMain as any,
        clientMapTemplate: customClient as any,
      });

      sinon.assert.calledOnce(customMain);
      expect(customMain.getCall(0).args[0]).to.deep.equal(withNeighbor);

      sinon.assert.calledOnce(customClient);
      expect(customClient.getCall(0).args[0]).to.deep.equal(withNeighbor);

      expect(fs.writeFileSync).to.have.been.calledTwice;
      expect((fs.writeFileSync as sinon.SinonStub).getCall(0).args[1]).to.equal('// main-out');
      expect((fs.writeFileSync as sinon.SinonStub).getCall(1).args[1]).to.equal('// client-out');
    });

    it('should pass stripped arrays to custom templates when enableVariantsInMap=false', async () => {
      const withNeighbor = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
          componentType: 'universal' as const,
        },
      ];
      getComponentListWithTypesStub.returns(withNeighbor);
      filterComponentsByTypeStub
        .withArgs(withNeighbor, ['client', 'universal'])
        .returns(withNeighbor);

      const customMain = sinon.stub().returns('// main-stripped');
      const customClient = sinon.stub().returns('// client-stripped');

      generateMap({
        paths: ['src/components'],
        enableVariantsInMap: false,
        clientComponentMap: true,
        mapTemplate: customMain as any,
        clientMapTemplate: customClient as any,
      });

      const stripped = [withNeighbor[0]];

      sinon.assert.calledOnce(customMain);
      expect(customMain.getCall(0).args[0]).to.deep.equal(stripped);

      sinon.assert.calledOnce(customClient);
      expect(customClient.getCall(0).args[0]).to.deep.equal(stripped);

      expect(fs.writeFileSync).to.have.been.calledTwice;
      expect((fs.writeFileSync as sinon.SinonStub).getCall(0).args[1]).to.equal('// main-stripped');
      expect((fs.writeFileSync as sinon.SinonStub).getCall(1).args[1]).to.equal(
        '// client-stripped'
      );
    });

    it('should generate main map only when in Pages Router + clientComponentMap=false', async () => {
      detectRouterTypeStub.returns('pages');
      getComponentListStub.returns(fakeComponentList);

      generateMap({ paths: ['src/components'], clientComponentMap: false });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [mainPath] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(String(mainPath)).to.match(/component-map\.ts$/);
    });

    it('should generate empty client map when in App Router even when clientComponentMap=false', async () => {
      detectRouterTypeStub.returns('app');
      getComponentListStub.returns(fakeComponentList);

      const clientTemplate = sinon.stub().returns('// empty client map');
      generateMap({
        paths: ['src/components'],
        clientComponentMap: false,
        clientMapTemplate: clientTemplate as any,
      });

      expect(fs.writeFileSync).to.have.been.calledTwice;
      const call1Args = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(String(call1Args[0])).to.match(/component-map\.client\.ts$/);
      sinon.assert.calledWith(clientTemplate, [], sinon.match.any);
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
      generateMap({ paths, clientComponentMap: true, enableVariantsInMap: false });

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
      console.log(mainContent);
      expect(mainContent).to.include(
        "['ClientButton', { ...ClientButton, componentType: 'client' }],"
      );
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

    it('should generate both component maps when clientComponentMap is false (App Router compatibility)', async () => {
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
      const detectRouterTypeStub = newSandbox.stub().returns('app'); // Force App Router
      newSandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      newSandbox.replaceGetter(coreTools, 'detectRouterType', () => detectRouterTypeStub);
      newSandbox.stub(fs, 'writeFileSync');

      generateMap({ paths, clientComponentMap: false, enableVariantsInMap: false });

      expect(fs.writeFileSync).to.have.been.calledTwice;
      expect(getComponentListStub).to.have.been.calledOnce;

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

      // Check client component map (should only contain built-in components)
      const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.client.ts'));
      expect(clientContent).to.include('Client-safe component map for App Router');
      // Should not include custom components when clientComponentMap is false
      expect(clientContent).to.not.include('ClientButton');
      expect(clientContent).to.not.include('ServerData');
      expect(clientContent).to.not.include('UniversalCard');
      // Should only include built-in components
      expect(clientContent).to.include("['BYOCWrapper', BYOCWrapper],");
      expect(clientContent).to.include("['FEaaSWrapper', FEaaSWrapper],");
      expect(clientContent).to.include("['Form', Form],");

      newSandbox.restore();
    });

    it('should always generate client component map for App Router compatibility even when clientComponentMap is false', async () => {
      const paths = ['src/components'];
      // Reset stubs for this test - use getComponentList instead of getComponentListWithTypes
      sandbox.restore();
      const newSandbox = sinon.createSandbox();

      const fakeComponentList = [
        {
          componentName: 'CustomComponent',
          moduleName: 'CustomComponent',
          importPath: './src/components/CustomComponent',
        },
      ];

      const getComponentListStub = newSandbox.stub().returns(fakeComponentList);
      const detectRouterTypeStub = newSandbox.stub().returns('app'); // Force App Router
      newSandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      newSandbox.replaceGetter(coreTools, 'detectRouterType', () => detectRouterTypeStub);
      newSandbox.stub(fs, 'writeFileSync');

      generateMap({ paths, clientComponentMap: false });

      // Should generate both files for App Router compatibility
      expect(fs.writeFileSync).to.have.been.calledTwice;

      // Check that client component map is generated with only built-in components
      const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.client.ts'));
      expect(clientContent).to.include('Client-safe component map for App Router');

      // Should not include custom components when clientComponentMap is false
      expect(clientContent).to.not.include('CustomComponent');

      // Should only include built-in components for App Router compatibility
      expect(clientContent).to.include("['BYOCWrapper', BYOCWrapper],");
      expect(clientContent).to.include("['FEaaSWrapper', FEaaSWrapper],");
      expect(clientContent).to.include("['Form', Form],");

      newSandbox.restore();
    });

    it('should auto-detect App Router and generate both maps when clientComponentMap is undefined', async () => {
      const paths = ['src/components'];
      generateMap({ paths }); // clientComponentMap is undefined

      expect(detectRouterTypeStub).to.have.been.calledOnce;
      expect(fs.writeFileSync).to.have.been.calledTwice;
    });

    it('should auto-detect Pages Router and generate single map when clientComponentMap is undefined', async () => {
      // Reset stubs for this test - use getComponentList instead of getComponentListWithTypes
      sandbox.restore();
      const newSandbox = sinon.createSandbox();

      const fakeComponentList = [
        {
          componentName: 'TestComponent',
          moduleName: 'TestComponent',
          importPath: './src/components/TestComponent',
        },
      ];

      const getComponentListStub = newSandbox.stub().returns(fakeComponentList);
      const detectRouterTypeStub = newSandbox.stub().returns('pages');
      newSandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      newSandbox.replaceGetter(coreTools, 'detectRouterType', () => detectRouterTypeStub);
      newSandbox.stub(fs, 'writeFileSync');

      const paths = ['src/components'];
      generateMap({ paths }); // clientComponentMap is undefined

      expect(detectRouterTypeStub).to.have.been.calledOnce;
      expect(fs.writeFileSync).to.have.been.calledOnce;

      newSandbox.restore();
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
