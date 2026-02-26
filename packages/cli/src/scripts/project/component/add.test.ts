/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import chalk from 'chalk';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import inquirer from 'inquirer';
import * as toolsModule from '@sitecore-content-sdk/content/tools';
import * as serverToolsModule from '@sitecore-content-sdk/content/tools-server';
import * as addModule from './add';
import * as loadConfigModule from '../../../utils/load-config';
import * as generateMapModule from './generate-map';

describe('add command', () => {
  let sandbox: sinon.SinonSandbox;
  let consoleErrorStub: sinon.SinonStub;
  let loadCliConfigStub: sinon.SinonStub;
  let getComponentListStub: sinon.SinonStub;
  let getComponentSpecStub: sinon.SinonStub;
  let getComponentSpecUrlStub: sinon.SinonStub;
  let execSyncStub: sinon.SinonStub;
  let generateMapStub: sinon.SinonStub;
  let inquirerStub: sinon.SinonStub;
  let unlinkSyncStub: sinon.SinonStub;
  let renameSyncStub: sinon.SinonStub;
  let existsSyncStub: sinon.SinonStub;

  const componentId = 'unique-id';
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

  const createComponentSpec = (
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

  const createComponentListItem = (componentName = 'PromoBlock', fileName = 'PromoBlock.ts') => ({
    filePath: `src/components/promo-block/${fileName}`,
    componentName,
    moduleName: componentName,
    importPath: `src/components/promo-block/${componentName}`,
  });

  const validateShadcnCommand = ({
    componentId,
    targetPath,
    edgeUrl = 'https://my.server',
  }: {
    componentId: string;
    targetPath: string;
    edgeUrl?: string;
  }) => {
    expect(
      execSyncStub.calledOnceWith(
        `npx shadcn@^3.4.2 add "${edgeUrl}/authoring/api/v1/components/generated/${componentId}?token=${token}&targetPath=${targetPath}"`,
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
    getComponentListStub = sandbox.stub(serverToolsModule, 'getComponentList');
    getComponentSpecStub = sandbox.stub(toolsModule, 'getComponentSpec');
    getComponentSpecUrlStub = sandbox
      .stub(toolsModule, 'getComponentSpecUrl')
      .callsFake(({ componentId, targetPath, token }) => {
        return `https://my.server/authoring/api/v1/components/generated/${componentId}?token=${token}&targetPath=${targetPath}`;
      });
    execSyncStub = sandbox.stub(childProcess, 'execSync');
    generateMapStub = sandbox.stub(generateMapModule, 'handler');
    inquirerStub = sandbox.stub(inquirer, 'prompt');
    unlinkSyncStub = sandbox.stub(fs, 'unlinkSync');
    existsSyncStub = sandbox.stub(fs, 'existsSync');
    renameSyncStub = sandbox.stub(fs, 'renameSync');
    addModule.unitMocks({
      getComponentSpec: getComponentSpecStub,
      getComponentList: getComponentListStub,
      getComponentSpecUrl: getComponentSpecUrlStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should add a component', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component and do not generate component map', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    await addModule.handler({
      componentId,
      targetPath,
      skipComponentMap: true,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should add a component when target path is not provided', async () => {
    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    getComponentListStub.returns([createComponentListItem()]);

    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    await addModule.handler({
      componentId,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        edgeUrl: undefined,
        targetPath: undefined,
        token,
      })
    ).to.be.true;

    expect(getComponentListStub.calledOnceWith(['src/components'], [])).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should prompt when file already exists and overwrite', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());
    getComponentSpecStub.resolves(createComponentSpec());
    existsSyncStub.returns(true);
    inquirerStub.resolves({
      overwrite: true,
    });

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      inquirerStub.calledOnceWith({
        type: 'confirm',
        name: 'overwrite',
        message: `File already exists: ${targetPath}. Overwrite?`,
        default: false,
      })
    ).to.be.true;

    expect(renameSyncStub.calledOnce).to.be.true;
    expect(unlinkSyncStub.calledOnceWith(path.resolve(process.cwd(), `${targetPath}.backup`))).to.be
      .true;

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should prompt when file already exists and do not overwrite', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());
    getComponentSpecStub.resolves(createComponentSpec());
    existsSyncStub.returns(true);
    inquirerStub.resolves({
      overwrite: false,
    });

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      inquirerStub.calledOnceWith({
        type: 'confirm',
        name: 'overwrite',
        message: `File already exists: ${targetPath}. Overwrite?`,
        default: false,
      })
    ).to.be.true;

    expect(unlinkSyncStub.notCalled).to.be.true;

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.false;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should add a component and overwrite the existing component when --overwrite is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());
    existsSyncStub.returns(true);
    getComponentSpecStub.resolves(createComponentSpec());

    await addModule.handler({
      componentId,
      targetPath,
      overwrite: true,
      token,
    });

    expect(inquirerStub.notCalled).to.be.true;
    expect(renameSyncStub.calledOnce).to.be.true;
    expect(unlinkSyncStub.calledOnceWith(path.resolve(process.cwd(), `${targetPath}.backup`))).to.be
      .true;

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component when custom edge url is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';
    const edgeUrl = 'https://custom.server';

    loadCliConfigStub.returns(
      createCliConfig({
        edgeUrl,
      })
    );

    getComponentSpecStub.resolves(createComponentSpec());

    getComponentSpecUrlStub.callsFake(({ componentId, targetPath, token }) => {
      return `${edgeUrl}/authoring/api/v1/components/generated/${componentId}?token=${token}&targetPath=${targetPath}`;
    });

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
      edgeUrl,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component and prompt for target path when target path is not resolved', async () => {
    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    getComponentListStub.returns([createComponentListItem('RichText', 'RichText.ts')]);

    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    inquirerStub.resolves({
      targetPath,
    });

    await addModule.handler({
      componentId,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        edgeUrl: undefined,
        targetPath: undefined,
        token,
      })
    ).to.be.true;

    expect(getComponentListStub.calledOnceWith(['src/components'], [])).to.be.true;

    expect(inquirerStub.calledOnce).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: undefined,
      })
    ).to.be.true;
  });

  it('should add a component when custom config path is provided', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    const customCliConfigPath = 'custom-config.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    await addModule.handler({
      componentId,
      targetPath,
      config: customCliConfigPath,
      token,
    });

    expect(loadCliConfigStub.calledOnceWith(customCliConfigPath)).to.be.true;

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(
      generateMapStub.calledOnceWith({
        config: customCliConfigPath,
      })
    ).to.be.true;
  });

  it('should log an error when component is not a content-sdk component', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(
      createComponentSpec({
        componentName: 'PromoBlock',
        variantName: 'variantA',
        title: 'Promo Block',
        componentType: 'not-a-content-sdk-variant',
      })
    );

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
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

    expect(getComponentSpecUrlStub.notCalled).to.be.true;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should log an error when sitecore config is missing in cli config', () => {
    loadCliConfigStub.returns({});

    addModule.handler({
      componentId,
      token,
    });

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(consoleErrorStub.firstCall.args[0]).to.equal(
      'The `sitecore.cli.config` file is missing a `config`. Please add it to use this command.'
    );
  });

  it('should log an error when component spec is not fetched successfully', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.rejects(new Error('Failed to fetch component'));

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component: Failed to fetch component')
      )
    ).to.be.true;

    expect(getComponentSpecUrlStub.notCalled).to.be.true;

    expect(execSyncStub.notCalled).to.be.true;

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should log an error when shadcn add command fails', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());

    getComponentSpecStub.resolves(createComponentSpec());

    execSyncStub.throws(new Error('Failed to execute shadcn add command'));

    await addModule.handler({
      componentId,
      targetPath,
      token,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component: Failed to execute shadcn add command')
      )
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(generateMapStub.notCalled).to.be.true;
  });

  it('should restore the original file when shadcn add command fails', async () => {
    const targetPath = 'src/components/promo-block/PromoBlock.variantA.ts';

    loadCliConfigStub.returns(createCliConfig());
    existsSyncStub.withArgs(path.resolve(process.cwd(), `${targetPath}.backup`)).returns(true);
    existsSyncStub.withArgs(path.resolve(process.cwd(), targetPath)).returns(true);
    getComponentSpecStub.resolves(createComponentSpec());

    execSyncStub.throws(new Error('Failed to execute shadcn add command'));

    await addModule.handler({
      componentId,
      targetPath,
      token,
      overwrite: true,
    });

    expect(
      getComponentSpecStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(
      consoleErrorStub.calledOnceWith(
        chalk.red('Failed to add component: Failed to execute shadcn add command')
      )
    ).to.be.true;

    expect(
      getComponentSpecUrlStub.calledOnceWith({
        componentId,
        targetPath,
        edgeUrl: undefined,
        token,
      })
    ).to.be.true;

    expect(renameSyncStub.calledTwice).to.be.true;

    const resolvedTargetPath = path.resolve(process.cwd(), targetPath);
    const resolvedBackupPath = path.resolve(process.cwd(), `${targetPath}.backup`);

    expect(renameSyncStub.getCall(0).args[0]).to.equal(resolvedTargetPath);
    expect(renameSyncStub.getCall(0).args[1]).to.equal(resolvedBackupPath);

    expect(renameSyncStub.getCall(1).args[0]).to.equal(resolvedBackupPath);
    expect(renameSyncStub.getCall(1).args[1]).to.equal(resolvedTargetPath);

    validateShadcnCommand({
      componentId,
      targetPath,
    });

    expect(generateMapStub.notCalled).to.be.true;
  });

  describe('should log an error when target path is invalid', () => {
    [
      {
        targetPath: '/src/components/promo-block/PromoBlock.variantA.ts',
        scenario: 'absolute path starting with "/"',
        expectedError: 'Target path cannot be an absolute path starting with "/"',
      },
      {
        targetPath: 'src/components/promo-block/../../PromoBlock.variantA.ts',
        scenario: 'path traversal',
        expectedError: 'Target path cannot contain ".." (path traversal)',
      },
    ].forEach(({ targetPath, scenario, expectedError }) => {
      it(`${scenario}`, async () => {
        loadCliConfigStub.returns(createCliConfig());

        getComponentSpecStub.returns(createComponentSpec());

        await addModule.handler({
          componentId,
          targetPath,
          token,
        });

        expect(consoleErrorStub.calledOnceWith(chalk.red(expectedError))).to.be.true;

        expect(getComponentSpecUrlStub.notCalled).to.be.true;

        expect(execSyncStub.notCalled).to.be.true;

        expect(generateMapStub.notCalled).to.be.true;
      });
    });
  });
});
