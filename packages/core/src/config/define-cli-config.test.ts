import { expect } from 'chai';
import { defineCliConfig } from './define-cli-config';
import { SitecoreCliConfigInpout } from './models';

describe('defineCliConfig', () => {
  it('should return the cliConfig if it is valid', () => {
    const validConfig: SitecoreCliConfigInpout = {
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
        templates: [{ name: 'test', generateTemplate: () => 'test' }],
      },
    };

    const result = defineCliConfig(validConfig);
    expect(result).to.deep.equal(validConfig);
  });

  it('should throw an error if build commands are not defined', () => {
    const invalidConfig: SitecoreCliConfigInpout = {
      build: {
        commands: [],
      },
      scaffold: {
        templates: [{ name: 'test', generateTemplate: () => 'test' }],
      },
    };

    expect(() => defineCliConfig(invalidConfig)).to.throw(
      'Configuration error: build commands should be defined in sitecore.cli.config'
    );
  });

  it('should throw an error if scaffold templates are not defined', () => {
    const invalidConfig: SitecoreCliConfigInpout = {
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
        templates: [],
      },
    };

    expect(() => defineCliConfig(invalidConfig)).to.throw(
      'Configuration error: scaffold templates should be defined in sitecore.cli.config'
    );
  });
});
