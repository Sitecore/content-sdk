import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import { ComponentTemplateType } from '@sitecore-content-sdk/core/config';
import * as loadConfigModule from '../utils/load-config';
import proxyquire from 'proxyquire';
import { SitecoreCliConfig } from '@sitecore-content-sdk/core/src/config';

describe('scaffold command', () => {
  let loadCliConfigStub: sinon.SinonStub;
  let scaffoldComponentStub: sinon.SinonStub;
  let handler: any;

  const mockConfig: SitecoreCliConfig = {
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

  beforeEach(() => {
    loadCliConfigStub = sinon.stub(loadConfigModule, 'default').returns(mockConfig);
    scaffoldComponentStub = sinon.stub();
    const scaffoldModule = proxyquire('./scaffold', {
      '@sitecore-content-sdk/core/tools': { scaffoldComponent: scaffoldComponentStub },
    });
    handler = scaffoldModule.handler;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw if componentName is not provided', () => {
    const argv = {};
    try {
      handler(argv);
    } catch (error) {
      expect(error.message).to.equal(
        'Component name is required. Usage: scs scaffold <ComponentName>'
      );
    }
  });

  it('should throw if componentName does not match the required format', () => {
    const argv = { componentName: 'invalidComponentName' };
    try {
      handler(argv);
    } catch (error) {
      expect(error.message).to.equal(
        `Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. It can also contain slashes to indicate a subfolder`
      );
    }
  });

  it('should call the loadConfig passing the config arg', () => {
    const argv = { componentName: 'ValidComponentName', config: './some-config.ts' };
    handler(argv);
    expect(loadCliConfigStub.calledOnceWith(argv.config)).to.be.true;
  });

  it('should call scaffoldComponent with default template if template name not provided and byoc flag is missing', async () => {
    const argv = {
      componentName: 'ValidComponentName',
    };
    const expectedOutputFFolderPath = 'src/components';

    handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFFolderPath,
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
    const expectedOutputFFolderPath = 'src/components';

    handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFFolderPath,
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

    handler(argv);

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
    handler(argv);
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
