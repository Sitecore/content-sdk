/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { readVersions } from './common';

describe('readVersions', () => {
  it('does return only @sitecore-content-sdk packages', () => {
    const versions = readVersions();

    expect(Object.keys(versions)).to.not.be.empty;
    for (const name of Object.keys(versions)) {
      expect(name).to.match(/^@sitecore-content-sdk\//);
    }
  });

  it('does include the content sdk dev dependencies and omit unrelated ones', () => {
    const versions = readVersions();

    // the framework package this template scaffolds against is stamped in
    expect(versions).to.have.property('@sitecore-content-sdk/angular');
    // non-sdk dev dependencies are not stamped into the scaffolded app
    expect(versions).to.not.have.property('typescript');
  });
});
