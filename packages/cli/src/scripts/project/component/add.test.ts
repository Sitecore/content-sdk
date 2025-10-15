/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import chalk from 'chalk';
import sinon from 'sinon';
import childProcess from 'child_process';
import inquirer from 'inquirer';
import * as addModule from './add';
import * as loadConfigModule from '../../../utils/load-config';
import * as toolsModule from '@sitecore-content-sdk/core/tools';
import * as generateMapModule from './generate-map';

describe('add command', () => {
  let sandbox: sinon.SinonSandbox;
  let consoleErrorStub: sinon.SinonStub;
  let loadCliConfigStub: sinon.SinonStub;
  let getComponentListStub: sinon.SinonStub;
  let getComponentVariantSpecStub: sinon.SinonStub;
  let getComponentRegistryUrlStub: sinon.SinonStub;
  let execSyncStub: sinon.SinonStub;
  let generateMapStub: sinon.SinonStub;
  let inquirerStub: sinon.SinonStub;

  const variantId = 'unique-id';
  const contextId = 'context-id';

  const createScConfig = (contextId: string, edgeUrl: string | undefined) => ({
    api: {
      edge: {
        contextId,
        edgeUrl,
      },
    },
  });

  const createCliConfig = (contextId = 'context-id', edgeUrl = undefined) => ({
    config: createScConfig(contextId, edgeUrl),
    componentMap: {
      paths: ['src/components'],
      exclude: [],
    },
  });

  const createComponentVariantSpec = (
    props = {
      componentName: 'PromoBlock',
      variantName: 'variantA',
      title: 'Promo Block',
      componentType: 'variant',
    }
  ) => ({
    title: props.title,
    meta: {
      'contentsdk-component-type': props.componentType,
      'contentsdk-component-name': props.componentName,
      'contentsdk-component-variant-name': props.variantName,
    },
  });

  const createComponentListItem = (
    componentName = 'PromoBlock',
    fileName = 'PromoBlock.special.ts'
  ) => ({
    filePath: `src/components/promo-block/${fileName}`,
    componentName,
    moduleName: componentName,
    importPath: `src/components/promo-block/${componentName}`,
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    loadCliConfigStub = sandbox.stub(loadConfigModule, 'default');
    consoleErrorStub = sandbox.stub(console, 'error').callThrough();
    getComponentListStub = sandbox.stub(toolsModule, 'getComponentList');
    getComponentVariantSpecStub = sandbox.stub(toolsModule, 'getComponentVariantSpec');
    getComponentRegistryUrlStub = sandbox
      .stub(toolsModule, 'getComponentRegistryUrl')
      .callsFake(({ variantId, contextId, targetPath }) => {
        return `https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`;
      });
    execSyncStub = sandbox.stub(childProcess, 'execSync');
    generateMapStub = sandbox.stub(generateMapModule, 'handler');
    inquirerStub = sandbox.stub(inquirer, 'prompt');

    addModule.unitMocks({
      getComponentVariantSpec: getComponentVariantSpecStub,
      getComponentList: getComponentListStub,
      getComponentRegistryUrl: getComponentRegistryUrlStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should add a component variant', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    await addModule.handler({
      variantId,
      targetPath,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component variant and do not generate component map', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    await addModule.handler({
      variantId,
      targetPath,
      skipComponentMap: true,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should add a component variant when target path is not provided', async () => {
    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    getComponentListStub.returns([createComponentListItem()]);

    const targetPath = 'src/components/promo-block/PromoBlock.special.variantA.ts';

    await addModule.handler({
      variantId,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        edgeUrl: undefined,
        targetPath: undefined,
      })
    ).to.be.true;

    expect(getComponentListStub.calledOnceWith(['src/components'], [])).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component variant and overwrite the existing component when overwrite option is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    await addModule.handler({
      variantId,
      targetPath,
      overwrite: true,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath} --overwrite`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component variant and prompt for target path when target path is not resolved', async () => {
    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    getComponentListStub.returns([createComponentListItem('RichText', 'RichText.ts')]);

    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    inquirerStub.resolves({
      targetPath,
    });

    await addModule.handler({
      variantId,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        edgeUrl: undefined,
        targetPath: undefined,
      })
    ).to.be.true;

    expect(getComponentListStub.calledOnceWith(['src/components'], [])).to.be.true;

    expect(
      inquirerStub.calledOnceWith({
        type: 'input',
        name: 'targetPath',
        required: true,
        message: `Enter the target path for the component variant.\nThe filename must follow the format: {componentName}.{variantName}.{extension}\n(example: src/components/MyComponent/MyComponent.variantA.ts):`,
      })
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component variant when custom config path is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    const customCliConfigPath = 'custom-config.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    await addModule.handler({
      variantId,
      targetPath,
      config: customCliConfigPath,
    });

    expect(loadCliConfigStub.calledOnceWith(customCliConfigPath)).to.be.true;

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(
      generateMapStub.calledOnceWith({
        config: customCliConfigPath,
      })
    ).to.be.true;
  });

  it('should exit when component is not a variant', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(
      createComponentVariantSpec({
        componentName: 'PromoBlock',
        variantName: 'variantA',
        title: 'Promo Block',
        componentType: 'not-a-content-sdk-variant',
      })
    );

    await addModule.handler({
      variantId,
      targetPath,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red(
          `The component "Promo Block" is not a content-sdk variant. Please, select a content-sdk variant to use this command.`
        )
      )
    ).to.be.true;

    expect(getComponentRegistryUrlStub.notCalled).to.be.true;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should exit when sitecore config is missing in cli config', () => {
    loadCliConfigStub.returns({});

    addModule.handler({
      variantId,
    });

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      'The `sitecore.cli.config` file is missing a `config`. Please add it to use this command.'
    );
  });

  it('should exit when variant spec is not fetched successfully', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.rejects(new Error('Failed to fetch component variant'));

    await addModule.handler({
      variantId,
      targetPath,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component variant: Failed to fetch component variant')
      )
    ).to.be.true;

    expect(getComponentRegistryUrlStub.notCalled).to.be.true;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should exit when shadcn add command fails', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    execSyncStub.throws(new Error('Failed to execute shadcn add command'));

    await addModule.handler({
      variantId,
      targetPath,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component variant: Failed to execute shadcn add command')
      )
    ).to.be.true;

    expect(
      getComponentRegistryUrlStub.calledOnceWith({
        variantId,
        contextId,
        targetPath,
      })
    ).to.be.true;

    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@latest add https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });
});
