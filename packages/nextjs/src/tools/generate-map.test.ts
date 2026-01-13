/* eslint-disable quotes */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-vars */

import path from 'path';
import { expect } from 'chai';
import sinon from 'sinon';
import { generateMap } from './generate-map';
import fs from 'fs';
import { ComponentImport } from '@sitecore-content-sdk/core/tools';
import * as coreTools from '@sitecore-content-sdk/core/tools';
import * as templatingUtils from './templating/utils';

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
      sandbox
        .stub(templatingUtils, 'getComponentListWithTypes')
        .callsFake(getComponentListWithTypesStub);
      sandbox.stub(templatingUtils, 'detectRouterType').callsFake(detectRouterTypeStub);
      sandbox.replaceGetter(coreTools, 'filterComponentsByType', () => filterComponentsByTypeStub);
      sandbox.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should write componentMap.ts file with components from "paths" parameter in pages router', async () => {
      const paths = ['src/components'];
      sandbox.restore();
      getComponentListStub = sandbox.stub().returns(fakeComponentList);
      getComponentListWithTypesStub = sandbox.stub().returns(fakeComponentsWithTypes);
      detectRouterTypeStub = sandbox.stub().returns('pages');
      filterComponentsByTypeStub = sandbox.stub().returns(fakeComponentsWithTypes);

      sandbox.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
      sandbox
        .stub(templatingUtils, 'getComponentListWithTypes')
        .callsFake(getComponentListWithTypesStub);
      sandbox.stub(templatingUtils, 'detectRouterType').callsFake(detectRouterTypeStub);
      sandbox.replaceGetter(coreTools, 'filterComponentsByType', () => filterComponentsByTypeStub);
      sandbox.stub(fs, 'writeFileSync');

      generateMap({ paths, includeVariants: false });

      expect(fs.writeFileSync).to.have.been.calledOnce;
      const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));

      expect(content).to.include(
        "import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';"
      );

      expect(content).to.include("import * as Button from './src/components/Button';");
      expect(content).to.include("import * as Link from './src/components/Link';");

      expect(content).to.include('new Map');
      expect(content).to.match(/\['BYOCWrapper'[\s\S]*BYOCWrapper/);
      expect(content).to.match(/\['FEaaSWrapper'[\s\S]*FEaaSWrapper/);
      expect(content).to.match(/\['Form'[\s\S]*Form/);
      expect(content).to.match(/\['Button'[\s\S]*Button/);

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
      expect(content).to.include("['BYOCWrapper', BYOCServerWrapper],");
      expect(content).to.include("['FEaaSWrapper', FEaaSServerWrapper],");
      expect(content).to.include("['Form', { ...Form, componentType: 'client' }],");
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

      generateMap({ paths, includeVariants: false });

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

      generateMap({ paths, destination: 'custom/path', includeVariants: false });

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

      // App Router generates both main + client maps => two calls to getComponentListWithTypes
      expect(getComponentListWithTypesStub).to.have.been.calledTwice;
      const firstArgs = getComponentListWithTypesStub.getCall(0).args;
      const secondArgs = getComponentListWithTypesStub.getCall(1).args;

      expect(firstArgs[0]).to.deep.equal(paths);
      expect(secondArgs[0]).to.deep.equal(paths);

      expect(firstArgs[1]).to.deep.equals(exclude);
      expect(secondArgs[1]).to.deep.equals(exclude);
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

    it('should group neighbor files into variants when in App Router + includeVariants=true', async () => {
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
        includeVariants: true,
        clientComponentMap: true,
      });

      expect(fs.writeFileSync).to.have.been.calledTwice;
      const [, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;

      expect(mainContent).to.include(
        "import * as Buttonextra from './src/components/Button.extra';"
      );
      expect(mainContent).to.include("import * as Button from './src/components/Button';");

      expect(mainContent.replace(/\s+/g, ' ')).to.include(
        "['Button', { ...Buttonextra, ...Button, componentType: 'client' }],"
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

    it('should group neighbors in a single main map when in Pages Router + includeVariants=true (no client map)', async () => {
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
      ];
      getComponentListWithTypesStub.returns(withNeighborNoTypes);

      generateMap({ paths: ['src/components'], includeVariants: true, clientComponentMap: false });

      expect(fs.writeFileSync).to.have.been.calledOnce;

      const [, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;

      expect(mainContent).to.include("import * as Button from './src/components/Button';");
      expect(mainContent).to.include(
        "import * as Buttonextra from './src/components/Button.extra';"
      );

      const compact = mainContent.replace(/\s+/g, ' ');
      expect(compact).to.include("['Button', { ...Buttonextra, ...Button }]");
    });

    it('should pass raw arrays to legacy (2-arity) custom templates even when includeVariants=false', async () => {
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

      detectRouterTypeStub.returns('app');

      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(withNeighbor);

      filterComponentsByTypeStub.resetBehavior();
      filterComponentsByTypeStub
        .withArgs(withNeighbor, ['client', 'universal'])
        .returns(withNeighbor);

      const customMain = sandbox.stub().returns('// main-out');
      const customClient = sandbox.stub().returns('// client-out');

      generateMap({
        paths: ['src/components'],
        includeVariants: false,
        clientComponentMap: true,
        mapTemplate: customMain as any,
        clientMapTemplate: customClient as any,
      });

      sinon.assert.calledOnce(customMain);
      expect(customMain.getCall(0).args[0]).to.deep.equal(withNeighbor);

      sinon.assert.calledOnce(customClient);
      expect(customClient.getCall(0).args[0]).to.deep.equal(withNeighbor);
    });

    it('should pass unstripped arrays to custom templates when in App Router + clientComponentMap=true + includeVariants=true', async () => {
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
        includeVariants: true,
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

    it('should strip variants for enhanced templates via ctx.entries when includeVariants=false', async () => {
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
        includeVariants: false,
        clientComponentMap: true,
        mapTemplate: customMain as any,
        clientMapTemplate: customClient as any,
      });

      sinon.assert.calledOnce(customMain);
      {
        // eslint-disable-next-line no-unused-vars
        const [rawComponents, _imports, ctx] = customMain.getCall(0).args;
        expect(rawComponents).to.deep.equal(withNeighbor);

        expect(ctx.includeVariants).to.equal(false);
        const keys = ctx.entries.map((e: any) => e.key);
        expect(keys).to.include('Button');

        const buttonEntry = ctx.entries.find((e: any) => e.key === 'Button');
        expect(String(buttonEntry.valueExpr)).to.equal('Button');
      }

      sinon.assert.calledOnce(customClient);
      {
        // eslint-disable-next-line no-unused-vars
        const [rawClientComponents, entries, ctx] = customClient.getCall(0).args;
        expect(rawClientComponents).to.deep.equal(withNeighbor);
        expect(ctx.includeVariants).to.equal(false);

        const keys = ctx.entries.map((e: any) => e.key);
        expect(keys).to.include('Button');

        const buttonEntry = ctx.entries.find((e: any) => e.key === 'Button');
        expect(String(buttonEntry.valueExpr)).to.equal('Button');
      }

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

    it('should log for component registration', () => {
      const debugStub = sandbox.stub(console, 'debug');

      const withNeighbor = [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: path.join(process.cwd(), 'src/components/Button.tsx'),
          componentType: 'universal' as const,
        },
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: path.join(process.cwd(), 'src/components/Button.extra.tsx'),
          componentType: 'universal' as const,
        },
      ];

      getComponentListWithTypesStub.resetBehavior();

      getComponentListWithTypesStub.returns(withNeighbor);

      generateMap({ paths: ['src/components'] });

      expect(debugStub).to.have.been.calledWithExactly('Registering Content SDK component Button');
      expect(debugStub).to.have.been.calledWithExactly(
        'Registering Content SDK component Button.extra'
      );
      expect(debugStub).to.have.been.callCount(4);
    });
  });

  describe('clientComponentMap functionality', () => {
    const fakeComponentsWithTypes = [
      {
        componentName: 'ClientButton',
        moduleName: 'ClientButton',
        importPath: './src/components/ClientButton',
        filePath: path.join(process.cwd(), 'src/components/ClientButton.tsx'),
        componentType: 'client' as const,
      },
      {
        componentName: 'ServerData',
        moduleName: 'ServerData',
        importPath: './src/components/ServerData',
        filePath: path.join(process.cwd(), 'src/components/ServerData.tsx'),
        componentType: 'server' as const,
      },
      {
        componentName: 'UniversalCard',
        moduleName: 'UniversalCard',
        importPath: './src/components/UniversalCard',
        filePath: path.join(process.cwd(), 'src/components/UniversalCard.tsx'),
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

      sandbox
        .stub(templatingUtils, 'getComponentListWithTypes')
        .callsFake(getComponentListWithTypesStub);
      sandbox.stub(templatingUtils, 'detectRouterType').callsFake(detectRouterTypeStub);
      sandbox.replaceGetter(coreTools, 'filterComponentsByType', () => filterComponentsByTypeStub);
      sandbox.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
      sandbox.restore();
    });
    // A) clientComponentMap = true  (REUSE existing sandbox + fs stub from beforeEach)
    it('should generate both component maps when clientComponentMap is true', async () => {
      // Ensure App Router branch
      detectRouterTypeStub.returns('app');

      // Provide well-formed typed components
      const typed = [
        {
          componentName: 'ClientButton',
          moduleName: 'ClientButton',
          importPath: './src/components/ClientButton',
          filePath: path.join(process.cwd(), 'src/components/ClientButton.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'ServerData',
          moduleName: 'ServerData',
          importPath: './src/components/ServerData',
          filePath: path.join(process.cwd(), 'src/components/ServerData.tsx'),
          componentType: 'server' as const,
        },
        {
          componentName: 'UniversalCard',
          moduleName: 'UniversalCard',
          importPath: './src/components/UniversalCard',
          filePath: path.join(process.cwd(), 'src/components/UniversalCard.tsx'),
          componentType: 'universal' as const,
        },
      ];

      // Reconfigure existing stubs from beforeEach (do NOT restub fs)
      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(typed);

      // Robust filter that doesn’t depend on array identity
      filterComponentsByTypeStub.resetBehavior();
      filterComponentsByTypeStub.callsFake((arr: any[], allowed: string[]) => {
        const allow = new Set(allowed);
        return (arr || []).filter((c) => allow.has(c.componentType));
      });

      const paths = ['src/components'];
      generateMap({ paths, clientComponentMap: true, includeVariants: false });

      // wrote main + client
      expect(fs.writeFileSync).to.have.been.calledTwice;

      // MAIN map assertions
      const [mainDest, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(mainDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
      expect(mainContent).to.include(
        "import * as ClientButton from './src/components/ClientButton';"
      );
      expect(mainContent).to.include("import * as ServerData from './src/components/ServerData';");
      expect(mainContent).to.include(
        "import * as UniversalCard from './src/components/UniversalCard';"
      );

      expect(mainContent).to.include(
        "['ClientButton', { ClientButton, componentType: 'client' }],"
      );
      expect(mainContent).to.include("['ServerData', ServerData],");
      expect(mainContent).to.include("['UniversalCard', UniversalCard],");

      // CLIENT map assertions (whitespace-insensitive; accept bare or spread form)
      const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.client.ts'));
      expect(clientContent).to.include('Client-safe component map for App Router');

      const compactClient = clientContent.replace(/\s+/g, ' ');
      // Accept either "ClientButton" or "{ ...ClientButton }"
      expect(compactClient).to.match(
        /\['ClientButton',\s*(\{\s*\.\.\.ClientButton\s*\}|ClientButton)\s*\],/
      );
      expect(compactClient).to.match(
        /\['UniversalCard',\s*(\{\s*\.\.\.UniversalCard\s*\}|UniversalCard)\s*\],/
      );
      expect(compactClient).to.not.match(/\['ServerData',\s*ServerData\],/);
    });

    it('should always generate client component map for App Router compatibility even when clientComponentMap is false', async () => {
      // Clear suite-level stubs (including fs.writeFileSync) to avoid double stubbing
      sandbox.restore();

      const sb = sinon.createSandbox();
      try {
        const typed = [
          {
            componentName: 'ClientButton',
            moduleName: 'ClientButton',
            importPath: './src/components/ClientButton',
            filePath: path.join(process.cwd(), 'src/components/ClientButton.tsx'),
            componentType: 'client' as const,
          },
          {
            componentName: 'ServerData',
            moduleName: 'ServerData',
            importPath: './src/components/ServerData',
            filePath: path.join(process.cwd(), 'src/components/ServerData.tsx'),
            componentType: 'server' as const,
          },
          {
            componentName: 'UniversalCard',
            moduleName: 'UniversalCard',
            importPath: './src/components/UniversalCard',
            filePath: path.join(process.cwd(), 'src/components/UniversalCard.tsx'),
            componentType: 'universal' as const,
          },
        ];
        // eslint-disable-next-line no-unused-vars
        const untyped = typed.map(({ componentType, ...rest }) => rest);

        // Stubs for both branches used by generateMap
        const getComponentListStub = sb.stub().returns(untyped);
        const getComponentListWithTypesStub = sb.stub().returns(typed);
        const filterComponentsByTypeStub = sb.stub().callsFake((arr: any[], allowed: string[]) => {
          const allow = new Set(allowed);
          return (arr || []).filter((c) => allow.has(c.componentType));
        });
        const detectRouterTypeStub = sb.stub().returns('app');

        sb.replaceGetter(coreTools, 'getComponentList', () => getComponentListStub);
        sb.stub(templatingUtils, 'getComponentListWithTypes').callsFake(
          getComponentListWithTypesStub
        );
        sb.replaceGetter(coreTools, 'filterComponentsByType', () => filterComponentsByTypeStub);
        sb.stub(templatingUtils, 'detectRouterType').callsFake(detectRouterTypeStub);

        // Defensively un-stub if already wrapped, then stub once
        const wf = fs.writeFileSync as any;
        if (wf && typeof wf.restore === 'function') wf.restore();
        sb.stub(fs, 'writeFileSync');

        const paths = ['src/components'];
        generateMap({ paths, clientComponentMap: false, includeVariants: false });

        // Should still emit main + client files in App Router
        expect(fs.writeFileSync).to.have.been.calledTwice;

        // MAIN
        const [mainDest, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
        expect(mainDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
        expect(mainContent).to.include(
          "import * as ClientButton from './src/components/ClientButton';"
        );
        expect(mainContent).to.include(
          "import * as ServerData from './src/components/ServerData';"
        );
        expect(mainContent).to.include(
          "import * as UniversalCard from './src/components/UniversalCard';"
        );

        // CLIENT (compat file: built-ins only)
        const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
        expect(clientDest).to.equal(
          path.join(process.cwd(), '.sitecore', 'component-map.client.ts')
        );
        expect(clientContent).to.include('Client-safe component map for App Router');
        expect(clientContent).to.not.include('ClientButton');
        expect(clientContent).to.not.include('ServerData');
        expect(clientContent).to.not.include('UniversalCard');
        expect(clientContent).to.include("['BYOCWrapper', BYOCClientWrapper],");
        expect(clientContent).to.include("['FEaaSWrapper', FEaaSClientWrapper],");
        expect(clientContent).to.include("['Form', Form],");
      } finally {
        sb.restore();
      }
    });

    it('should auto-detect App Router and generate both maps when clientComponentMap is undefined', async () => {
      const paths = ['src/components'];

      // Make sure we truly hit "autodetect app" and have clean stub histories
      detectRouterTypeStub.resetBehavior();
      detectRouterTypeStub.resetHistory();
      detectRouterTypeStub.returns('app');

      // Provide well-formed typed components (must include filePath)
      const typed = [
        {
          componentName: 'ClientButton',
          moduleName: 'ClientButton',
          importPath: './src/components/ClientButton',
          filePath: path.join(process.cwd(), 'src/components/ClientButton.tsx'),
          componentType: 'client' as const,
        },
        {
          componentName: 'ServerData',
          moduleName: 'ServerData',
          importPath: './src/components/ServerData',
          filePath: path.join(process.cwd(), 'src/components/ServerData.tsx'),
          componentType: 'server' as const,
        },
        {
          componentName: 'UniversalCard',
          moduleName: 'UniversalCard',
          importPath: './src/components/UniversalCard',
          filePath: path.join(process.cwd(), 'src/components/UniversalCard.tsx'),
          componentType: 'universal' as const,
        },
      ];

      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(typed);

      // Robust filter that mimics real behavior (don’t bind to a specific array reference)
      filterComponentsByTypeStub.resetBehavior();
      filterComponentsByTypeStub.callsFake((arr: any[], allowed: string[]) => {
        const allow = new Set(allowed);
        return (arr || []).filter((c) => allow.has(c.componentType));
      });

      // Clear previous writes from other tests
      (fs.writeFileSync as sinon.SinonStub).resetHistory();

      // clientComponentMap is undefined -> should autodetect 'app' and write both maps
      generateMap({ paths });

      expect(fs.writeFileSync).to.have.been.calledTwice;

      // Optional sanity checks on outputs
      const [mainDest, mainContent] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
      expect(mainDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
      expect(mainContent).to.include(
        "import * as ClientButton from './src/components/ClientButton';"
      );
      expect(mainContent).to.include("import * as ServerData from './src/components/ServerData';");
      expect(mainContent).to.include(
        "import * as UniversalCard from './src/components/UniversalCard';"
      );

      const [clientDest, clientContent] = (fs.writeFileSync as sinon.SinonStub).getCall(1).args;
      expect(clientDest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.client.ts'));
      expect(clientContent).to.include('Client-safe component map for App Router');

      const compactClient = clientContent.replace(/\s+/g, ' ');
      expect(compactClient).to.match(
        /\['ClientButton',\s*(\{\s*\.\.\.ClientButton\s*\}|ClientButton)\s*\],/
      );
      expect(compactClient).to.match(
        /\['UniversalCard',\s*(\{\s*\.\.\.UniversalCard\s*\}|UniversalCard)\s*\],/
      );
      expect(compactClient).to.not.match(/\['ServerData',\s*ServerData\],/);
    });

    it('should auto-detect Pages Router and generate single map when clientComponentMap is undefined', async () => {
      // Reset suite-level stubs so we can safely stub fresh in this test
      sandbox.restore();
      const newSandbox = sinon.createSandbox();

      try {
        const fakeComponentList = [
          {
            componentName: 'TestComponent',
            moduleName: 'TestComponent',
            importPath: './src/components/TestComponent',
            filePath: path.join(process.cwd(), 'src/components/TestComponent.tsx'), // <-- REQUIRED so path.dirname(...) works
          },
        ];

        const getComponentListWithTypesStub = newSandbox.stub().returns(fakeComponentList);
        const detectRouterTypeStub = newSandbox.stub().returns('pages'); // auto-detect Pages Router

        newSandbox
          .stub(templatingUtils, 'getComponentListWithTypes')
          .callsFake(getComponentListWithTypesStub);
        newSandbox.stub(templatingUtils, 'detectRouterType').callsFake(detectRouterTypeStub);

        // Defensively un-stub fs.writeFileSync if some other test wrapped it
        const wf = fs.writeFileSync as any;
        if (wf && typeof wf.restore === 'function') wf.restore();
        newSandbox.stub(fs, 'writeFileSync');

        const paths = ['src/components'];
        generateMap({ paths }); // clientComponentMap is undefined

        // Pages router => only one map file written
        expect(fs.writeFileSync).to.have.been.calledOnce;

        // (Optional) sanity check
        const [dest, content] = (fs.writeFileSync as sinon.SinonStub).getCall(0).args;
        expect(dest).to.equal(path.join(process.cwd(), '.sitecore', 'component-map.ts'));
        expect(content).to.include(
          "import * as TestComponent from './src/components/TestComponent';"
        );
      } finally {
        newSandbox.restore();
      }
    });

    it('should use custom clientMapTemplate when provided', async () => {
      const paths = ['src/components'];

      // Ensure App Router and clean histories
      detectRouterTypeStub.returns('app');

      // Ensure typed list is well-formed and used
      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(fakeComponentsWithTypes); // Button(client), Link(universal)

      // Robust filter: don't tie to array identity
      filterComponentsByTypeStub.resetBehavior();
      filterComponentsByTypeStub.callsFake((arr: any[], allowed: string[]) =>
        (arr || []).filter((c) => allowed.includes(c.componentType))
      );

      const customClientTemplate = sandbox.stub().returns('// custom client template');

      generateMap({ paths, clientComponentMap: true, clientMapTemplate: customClientTemplate });

      // Template called once (enhanced path)
      expect(customClientTemplate).to.have.been.calledOnce;

      // First arg is the filtered raw array: client + universal
      const passed = customClientTemplate.getCall(0).args[0];
      expect(passed.map((c: any) => c.componentName)).to.deep.equal([
        'ClientButton',
        'UniversalCard',
      ]);

      // Second file written is the client map using the custom output
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
      detectRouterTypeStub.returns('app');

      // Ensure well-formed typed list
      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(fakeComponentsWithTypes);

      generateMap({ paths, clientComponentMap: true });

      // Called for main and for client => twice
      expect(getComponentListWithTypesStub).to.have.been.calledTwice;
      expect(getComponentListWithTypesStub.getCall(0).args[0]).to.deep.equal(paths);
      expect(getComponentListWithTypesStub.getCall(1).args[0]).to.deep.equal(paths);
    });

    it('should call filterComponentsByType with correct component types for client map', async () => {
      const paths = ['src/components'];
      detectRouterTypeStub.returns('app');

      // Ensure typed list and filter behavior
      getComponentListWithTypesStub.resetBehavior();
      getComponentListWithTypesStub.resetHistory();
      getComponentListWithTypesStub.returns(fakeComponentsWithTypes);

      filterComponentsByTypeStub.resetBehavior();
      filterComponentsByTypeStub.resetHistory();
      filterComponentsByTypeStub.callsFake((arr: any[], allowed: string[]) =>
        (arr || []).filter((c) => allowed.includes(c.componentType))
      );

      generateMap({ paths, clientComponentMap: true });

      // Only the client-path calls the filter => once
      expect(filterComponentsByTypeStub).to.have.been.calledOnce;

      const [passedArr, types] = filterComponentsByTypeStub.getCall(0).args;
      expect(types).to.deep.equal(['client', 'universal']);

      // The array passed to the filter should be the typed list
      expect(passedArr.map((c: any) => c.componentName)).to.deep.equal(
        fakeComponentsWithTypes.map((c) => c.componentName)
      );
    });
  });
});
