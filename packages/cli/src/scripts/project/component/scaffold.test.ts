import { expect } from 'chai';
import sinon from 'sinon';
import { SitecoreCliConfig, ComponentTemplateType } from '@sitecore-content-sdk/core/config';
import * as td from 'testdouble';

describe('scaffold command', () => {
  let loadCliConfigStub: sinon.SinonStub;
  let scaffoldComponentStub: sinon.SinonStub;
  let handler: typeof import('./scaffold.js').handler;

  const mockConfig: SitecoreCliConfig = {
    componentMap: {
      paths: [],
      destination: '',
      componentImports: [],
      exclude: [],
      mapTemplate: () => '',
      generator: () => {},
    },
    build: {
      commands: [sinon.stub(), sinon.stub()],
    },
    scaffold: {
      templates: [
        {
          name: ComponentTemplateType.DEFAULT,
          fileExtension: 'tsx',
          generateTemplate: (componentName: string) => {
            return componentName;
          },
          getNextSteps: () => ['next step 1', 'next step 2'],
        },
        {
          name: ComponentTemplateType.BYOC,
          fileExtension: 'tsx',
          generateTemplate: (componentName: string) => {
            return `${ComponentTemplateType.BYOC} ${componentName}`;
          },
          getNextSteps: () => ['byoc next step 1', 'byoc next step 2'],
        },
        {
          name: 'customTemplate',
          fileExtension: 'tsx',
          generateTemplate: (componentName: string) => {
            return 'customTemplate ' + componentName;
          },
          getNextSteps: () => ['customTemplate next step 1', 'customTemplate next step 2'],
        },
      ],
    },
  };

  beforeEach(async () => {
    loadCliConfigStub = sinon.stub().returns(mockConfig);
    await td.replaceEsm('../../../utils/load-config.ts', undefined, loadCliConfigStub);

    scaffoldComponentStub = sinon.stub();

    await td.replaceEsm('@sitecore-content-sdk/core/tools', {
      scaffoldComponent: scaffoldComponentStub,
    });

    const scaffoldModule = await import('./scaffold.js');
    handler = scaffoldModule.handler;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw if componentName does not match the required format', async () => {
    const argv = { componentName: 'invalidComponentName' };

    const consoleLogSpy = sinon.spy(console, 'log');

    await handler(argv);

    expect(
      consoleLogSpy.calledOnceWith(
        `Error: Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. It can also contain slashes to indicate a subfolder`
      )
    ).to.be.true;
  });

  it('should call the loadConfig passing the config arg', async () => {
    const argv = { componentName: 'ValidComponentName', config: './some-config.ts' };
    await handler(argv);
    expect(loadCliConfigStub.calledOnceWith(argv.config)).to.be.true;
  });

  it('should call scaffoldComponent with default template if template name not provided and byoc flag is missing', async () => {
    const argv = {
      componentName: 'ValidComponentName',
    };
    const expectedOutputFolderPath = 'src/components';

    await handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFolderPath,
        'ValidComponentName',
        ComponentTemplateType.DEFAULT,
        mockConfig.scaffold.templates
      )
    ).to.be.true;
  });

  it('should call scaffoldComponent with byoc template if template name not provided and byoc flag is passed', async () => {
    const argv = {
      componentName: 'ValidComponentName',
      byoc: true,
    };
    const expectedOutputFolderPath = 'src/components';

    await handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFolderPath,
        'ValidComponentName',
        ComponentTemplateType.BYOC,
        mockConfig.scaffold.templates
      )
    ).to.be.true;
  });

  it('should call scaffoldComponent with template Name if provided', async () => {
    const argv = {
      componentName: 'ValidComponentName',
      templateName: 'customTemplate',
      byoc: true,
    };
    const expectedOutputFFolderPath = 'src/components';

    await handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFFolderPath,
        'ValidComponentName',
        argv.templateName,
        mockConfig.scaffold.templates
      )
    ).to.be.true;
  });

  it('should handle passing component subfolder', async () => {
    const argv = {
      componentName: 'path/to/ValidComponentName',
      config: './some-config.ts',
      templateName: 'template',
      byoc: true,
    };
    const expectedOutputFilePath = 'path/to/';
    await handler(argv);
    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFilePath,
        'ValidComponentName',
        argv.templateName,
        mockConfig.scaffold.templates
      )
    ).to.be.true;
  });
});
