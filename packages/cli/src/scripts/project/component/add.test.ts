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
  let getComponentVariantSpecUrlStub: sinon.SinonStub;
  let execSyncStub: sinon.SinonStub;
  let generateMapStub: sinon.SinonStub;
  let inquirerStub: sinon.SinonStub;

  const variantId = 'unique-id';
  const token = '456';

  const createScConfig = (edgeUrl: string | undefined) => ({
    api: {
      edge: {
        edgeUrl,
      },
    },
  });

  const createCliConfig = ({ edgeUrl }: { edgeUrl?: string } = {}) => ({
    config: createScConfig(edgeUrl),
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

  const validateShadcnCommand = ({
    variantId,
    targetPath,
    overwrite = false,
    edgeUrl = 'https://my.server',
  }: {
    variantId: string;
    targetPath: string;
    overwrite?: boolean;
    edgeUrl?: string;
  }) => {
    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@^3.4.2 add "${edgeUrl}/authoring/api/v1/components/generated/${variantId}?token=${token}&targetPath=${targetPath}"${
          overwrite ? ' --overwrite' : ''
        }`,
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        }
      )
    ).to.be.true;
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    loadCliConfigStub = sandbox.stub(loadConfigModule, 'default');
    consoleErrorStub = sandbox.stub(console, 'error').callThrough();
    getComponentListStub = sandbox.stub(toolsModule, 'getComponentList');
    getComponentVariantSpecStub = sandbox.stub(toolsModule, 'getComponentVariantSpec');
    getComponentVariantSpecUrlStub = sandbox
      .stub(toolsModule, 'getComponentVariantSpecUrl')
      .callsFake(({ variantId, targetPath, token }) => {
        return `https://my.server/authoring/api/v1/components/generated/${variantId}?token=${token}&targetPath=${targetPath}`;
      });
    execSyncStub = sandbox.stub(childProcess, 'execSync');
    generateMapStub = sandbox.stub(generateMapModule, 'handler');
    inquirerStub = sandbox.stub(inquirer, 'prompt');

    addModule.unitMocks({
      getComponentVariantSpec: getComponentVariantSpecStub,
      getComponentList: getComponentListStub,
      getComponentVariantSpecUrl: getComponentVariantSpecUrlStub,
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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should add a component variant when target path is not provided', async () => {
    loadCliConfigStub.returns(createCliConfig());

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    getComponentListStub.returns([createComponentListItem()]);

    const targetPath = 'src/components/promo-block/PromoBlock.special.variantA.ts';

    await addModule.handler({
      variantId,
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        edgeUrl: undefined,
        targetPath: undefined,
        token,
      })
    ).to.be.true;

    expect(getComponentListStub.calledOnceWith(['src/components'], [])).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
      overwrite: true,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component variant when custom edge url is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';
    const edgeUrl = 'https://custom.server';

    loadCliConfigStub.returns(
      createCliConfig({
        edgeUrl,
      })
    );

    getComponentVariantSpecStub.resolves(createComponentVariantSpec());

    getComponentVariantSpecUrlStub.callsFake(({ variantId, targetPath, token }) => {
      return `${edgeUrl}/authoring/api/v1/components/generated/${variantId}?token=${token}&targetPath=${targetPath}`;
    });

    await addModule.handler({
      variantId,
      targetPath,
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl,
        token,
      })
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
      edgeUrl,
    });

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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        edgeUrl: undefined,
        targetPath: undefined,
        token,
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
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

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
      token,
    });

    expect(loadCliConfigStub.calledOnceWith(customCliConfigPath)).to.be.true;

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red(
          `The component "Promo Block" is not a content-sdk variant. Please, select a content-sdk variant to use this command.`
        )
      )
    ).to.be.true;

    expect(getComponentVariantSpecUrlStub.notCalled).to.be.true;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should exit when sitecore config is missing in cli config', () => {
    loadCliConfigStub.returns({});

    addModule.handler({
      variantId,
      token,
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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component variant: Failed to fetch component variant')
      )
    ).to.be.true;

    expect(getComponentVariantSpecUrlStub.notCalled).to.be.true;

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
      token,
    });

    expect(
      getComponentVariantSpecStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component variant: Failed to execute shadcn add command')
      )
    ).to.be.true;

    expect(
      getComponentVariantSpecUrlStub.calledOnceWith({
        variantId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      variantId,
      targetPath,
    });

    expect(generateMapStub.notCalled).to.be.true;
  });
});
