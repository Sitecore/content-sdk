/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { ensureSitecoreDirectory } from './ensure-sitecore-directory';

describe('ensureSitecoreDirectory', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create the output directory when it does not exist', () => {
    sinon.stub(fs, 'existsSync').returns(false);
    sinon.stub(fs, 'mkdirSync');

    ensureSitecoreDirectory('.sitecore');

    const outputPath = path.resolve(process.cwd(), '.sitecore');
    expect((fs.existsSync as sinon.SinonStub).calledWith(outputPath)).to.be.true;
    expect((fs.mkdirSync as sinon.SinonStub).calledOnceWithExactly(outputPath, {
      recursive: true,
    })).to.be.true;
  });

  it('should not create the output directory when it already exists', () => {
    sinon.stub(fs, 'existsSync').returns(true);
    sinon.stub(fs, 'mkdirSync');

    ensureSitecoreDirectory('custom/path');

    expect((fs.mkdirSync as sinon.SinonStub).notCalled).to.be.true;
  });
});
