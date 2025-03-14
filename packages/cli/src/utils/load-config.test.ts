import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import loadCliConfig from './load-config';
import fs from 'fs';
import * as processEnv from './process-env';

const tsx = require('tsx/cjs/api');

describe('loadCliConfig', () => {
  let tsxRequireStub: sinon.SinonStub;
  const mockConfigExport = { default: { build: { commmands: [], scaffold: {} } } };
  let processEnvStub: sinon.SinonStub;

  beforeEach(() => {
    tsxRequireStub = sinon.stub(tsx, 'require');
    processEnvStub = sinon.stub(processEnv, 'default');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load the default .ts configuration file if no configFile is provided', () => {
    sinon.stub(fs, 'existsSync').returns(true);
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './sitecore.cli.config.ts'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the default .js configuration file if no configFile is provided and the .ts is missing', () => {
    sinon.stub(fs, 'existsSync').returns(false);
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './sitecore.cli.config.js'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the specified configuration file from same directory', () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('./some-config.ts');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './some-config.ts'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the specified configuration file from different directory, and load env vars from there', () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('./some-dr/some-config.ts');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './some-dr/some-config.ts'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(
      processEnvStub.calledWith(
        path.dirname(path.resolve(process.cwd(), './some-dr/some-config.ts'))
      )
    ).to.be.true;
  });

  it('should throw an error if the configuration file does not exist', () => {
    const invalidConfig = './invalid-config.ts';
    const errorMessage = 'cannot find cli config';
    tsxRequireStub.throws(new Error(errorMessage));

    expect(() => loadCliConfig(invalidConfig)).to.throw(
      `Error while trying to load the cli configuration from ${invalidConfig}. Error message: ${errorMessage}`
    );
  });
});
