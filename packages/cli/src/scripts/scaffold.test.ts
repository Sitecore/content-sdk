import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import * as loadConfigModule from '../utils/load-config';
import proxyquire from 'proxyquire';

describe('scaffold command', () => {
  let loadCliConfigStub: sinon.SinonStub;
  let scaffoldComponentStub: sinon.SinonStub;
  let handler: any;

  const mockConfig = {
    scaffold: {
      templates: [
        {
          name: 'default',
          generateTemplate: (componentName: string) => {
            return componentName;
          },
          getNextSteps: () => ['next step 1', 'next step 2'],
        },
        {
          name: 'byoc',
          generateTemplate: (componentName: string) => {
            return 'byoc ' + componentName;
          },
          getNextSteps: () => ['byoc next step 1', 'byoc next step 2'],
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
      expect(error).to.equal('Component name was not passed. Usage: scs scaffold <ComponentName>');
    }
  });

  it('should throw if componentName does not match the required format', () => {
    const argv = { componentName: 'invalidComponentName' };
    try {
      handler(argv);
    } catch (error) {
      expect(error).to.equal(
        `Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. If specifying a path, it must be relative to src/components`
      );
    }
  });

  it('should call the loadConfig passing the config arg', () => {
    const argv = { componentName: 'ValidComponentName', config: './some-config.ts' };
    handler(argv);
    expect(loadCliConfigStub.calledOnceWith(argv.config)).to.be.true;
  });

  it('should call scaffoldComponent with correct arguments', async () => {
    const argv = {
      componentName: 'ValidComponentName',
      templateName: 'default',
      byoc: true,
    };
    const expectedOutputFilePath = path.join('src/components', 'ValidComponentName.tsx');

    handler(argv);

    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFilePath,
        'ValidComponentName',
        argv.templateName,
        mockConfig.scaffold.templates,
        argv.byoc
      )
    ).to.be.true;
  });

  it('should handle component paths correctly', async () => {
    const argv = {
      componentName: 'path/to/ValidComponentName',
      config: './some-config.ts',
      templateName: 'template',
      byoc: true,
    };
    const expectedOutputFilePath = path.join('src/components', 'path/to', 'ValidComponentName.tsx');
    handler(argv);
    expect(
      scaffoldComponentStub.calledOnceWith(
        expectedOutputFilePath,
        'ValidComponentName',
        argv.templateName,
        mockConfig.scaffold.templates,
        argv.byoc
      )
    ).to.be.true;
  });
});
