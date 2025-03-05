import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import loadCliConfig from './load-config';

const tsx = require('tsx/cjs/api');

describe('loadCliConfig', () => {
  let tsxRequireStub: sinon.SinonStub;
  const mockConfigExport = { default: { build: { commmands: [], scaffold: {} } } };

  beforeEach(() => {
    tsxRequireStub = sinon.stub(tsx, 'require');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load the default configuration file if no configFile is provided', () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './sitecore.cli.config.ts'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
  });

  it('should load the specified configuration file', () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = loadCliConfig('./some-config.ts');

    expect(
      tsxRequireStub.calledOnceWith(
        path.resolve(process.cwd(), './some-config.ts'),
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
  });

  it('should throw an error if the configuration file does not exist', () => {
    const invalidConfig = './invalid-config.ts';
    tsxRequireStub.throws(new Error());

    expect(() => loadCliConfig(invalidConfig)).to.throw(
      `cli configuration not found in ${invalidConfig}. Please ensure the file exists at the specified location.`
    );
  });
});
