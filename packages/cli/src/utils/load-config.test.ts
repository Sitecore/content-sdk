import { expect } from 'chai';
import sinon from 'sinon';
import * as td from 'testdouble';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('loadCliConfig', () => {
  let tsxRequireStub: sinon.SinonStub;
  const mockConfigExport = { default: { build: { commmands: [], scaffold: {} } } };
  let processEnvStub: sinon.SinonStub;
  let loadCliConfig: typeof import('./load-config.js').default;
  let existsSyncStub: sinon.SinonStub;

  beforeEach(async () => {
    tsxRequireStub = sinon.stub();
    await td.replaceEsm('tsx/esm/api', {
      tsImport: tsxRequireStub,
    });

    existsSyncStub = sinon.stub();
    await td.replaceEsm('fs', undefined, {
      existsSync: existsSyncStub,
    });

    processEnvStub = sinon.stub();
    await td.replaceEsm('./process-env.ts', undefined, processEnvStub);

    loadCliConfig = await import('./load-config.js').then((m) => m.default);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should load the default .ts configuration file if no configFile is provided', async () => {
    existsSyncStub.returns(true);
    tsxRequireStub.returns(mockConfigExport);
    const config = await loadCliConfig('');

    expect(
      tsxRequireStub.calledOnceWith(
        pathToFileURL(path.resolve(process.cwd(), './sitecore.cli.config.ts')).href,
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the default .js configuration file if no configFile is provided and the .ts is missing', async () => {
    existsSyncStub.returns(false);
    tsxRequireStub.returns(mockConfigExport);
    const config = await loadCliConfig('');

    expect(
      tsxRequireStub.calledOnceWith(
        pathToFileURL(path.resolve(process.cwd(), './sitecore.cli.config.js')).href,
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the specified configuration file from same directory', async () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = await loadCliConfig('./some-config.ts');

    expect(
      tsxRequireStub.calledOnceWith(
        pathToFileURL(path.resolve(process.cwd(), './some-config.ts')).href,
        path.resolve(__dirname, './load-config.ts')
      )
    ).to.be.true;
    expect(config).to.deep.equal(mockConfigExport.default);
    expect(processEnvStub.notCalled).to.be.true;
  });

  it('should load the specified configuration file from different directory, and load env vars from there', async () => {
    tsxRequireStub.returns(mockConfigExport);
    const config = await loadCliConfig('./some-dr/some-config.ts');

    expect(
      tsxRequireStub.calledOnceWith(
        pathToFileURL(path.resolve(process.cwd(), './some-dr/some-config.ts')).href,
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

  it('should throw an error if the configuration file does not exist', async () => {
    const invalidConfig = './invalid-config.ts';
    const errorMessage = 'cannot find cli config';
    tsxRequireStub.throws(new Error(errorMessage));

    await expect(loadCliConfig(invalidConfig)).to.be.rejectedWith(
      `Error while trying to load the cli configuration from ${invalidConfig}. Error message: ${errorMessage}`
    );
  });
});
