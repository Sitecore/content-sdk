import { expect } from 'chai';
import { defineCliConfig } from './define-cli-config';
import { SitecoreCliConfigInpout, SitecoreCliConfig } from '@sitecore-content-sdk/core/config';
import chalk from 'chalk';

describe('defineCliConfig', () => {
  const validateDefaultTemplates = (result: SitecoreCliConfig) => {
    expect(result.scaffold.templates[0].name).to.equal('default');
    const defaultTemplate = result.scaffold.templates[0].generateTemplate('ComponentName');
    expect(defaultTemplate).to.contain(
      // eslint-disable-next-line quotes
      `import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';`
    );
    expect(defaultTemplate).to.contain('ComponentName');
    if (result.scaffold.templates[0].getNextSteps) {
      const componentpath = 'src/components/ComponentName.tsx';
      expect(result.scaffold.templates[0].getNextSteps(componentpath)[0]).to.contain(
        `* Implement the React component in ${chalk.green(componentpath)}`
      );
    }

    expect(result.scaffold.templates[1].name).to.equal('byoc');
    const byocTemplate = result.scaffold.templates[1].generateTemplate('ByocComponentName');
    expect(byocTemplate).to.contain(
      // eslint-disable-next-line quotes
      `import * as FEAAS from '@sitecore-feaas/clientside/react';`
    );
    expect(byocTemplate).to.contain('ByocComponentName');

    expect(result.scaffold.templates[1].generateTemplate('comp name')).to.contain(
      // eslint-disable-next-line quotes
      `import * as FEAAS from '@sitecore-feaas/clientside/react';`
    );
    if (result.scaffold.templates[1].getNextSteps) {
      expect(result.scaffold.templates[1].getNextSteps('componentpath')[0]).to.contain(
        '* Modify component registration through FEAAS.External.registerComponent if needed'
      );
    }
  };

  it('should add default and byoc scaffold templates', () => {
    const inputConfig: SitecoreCliConfigInpout = {
      build: {
        commands: [
          () => {
            return async () => {
              Promise.resolve('test');
            };
          },
        ],
      },
      scaffold: {
        templates: [{ name: 'existing template', generateTemplate: () => 'test' }],
      },
    };

    const result = defineCliConfig(inputConfig);
    expect(result.scaffold.templates).to.have.lengthOf(3);

    validateDefaultTemplates(result);

    expect(result.scaffold.templates[2].name).to.equal('existing template');
  });

  it('should initialize scaffold object if not present', () => {
    const inputConfig: SitecoreCliConfigInpout = {
      build: {
        commands: [
          () => {
            return async () => {
              Promise.resolve('test');
            };
          },
        ],
      },
    };

    const result = defineCliConfig(inputConfig);

    expect(result.scaffold.templates).to.have.lengthOf(2);

    validateDefaultTemplates(result);
  });
});
