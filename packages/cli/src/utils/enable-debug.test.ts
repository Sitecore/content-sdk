/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  debugModule,
  debugNamespace,
  enableDebug,
  isNamespaceEnabled,
} from '@sitecore-content-sdk/core';
import enableDebugLogging from './enable-debug';

describe('enableDebugLogging', () => {
  let debugOriginal: string | undefined;

  const setDebug = (value?: string) => {
    if (value === undefined) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = value;
    }
  };

  before(() => {
    debugOriginal = process.env.DEBUG;
  });

  beforeEach(() => {
    setDebug(undefined);
    enableDebug('');
  });

  after(() => {
    setDebug(debugOriginal);
    enableDebug(debugOriginal || '');
  });

  it('should enable the scopes defined by the DEBUG environment variable', () => {
    process.env.DEBUG = `${debugNamespace}:*`;

    expect(enableDebugLogging()).to.deep.equal([`${debugNamespace}:*`]);
    expect(isNamespaceEnabled(`${debugNamespace}:layout`)).to.be.true;
  });

  it('should enable debuggers which were created before the scopes were enabled', () => {
    // SDK debuggers are created when their module is imported, which happens
    // before the CLI loads the DEBUG value from the .env files
    const layout = debugModule(`${debugNamespace}:layout`);

    expect(isNamespaceEnabled(`${debugNamespace}:layout`)).to.be.false;

    process.env.DEBUG = `${debugNamespace}:*`;
    enableDebugLogging();

    expect(layout.enabled).to.be.true;
  });

  it('should enable each of the comma separated scopes', () => {
    process.env.DEBUG = ` ${debugNamespace}:layout , ${debugNamespace}:http `;

    expect(enableDebugLogging()).to.deep.equal([
      `${debugNamespace}:layout`,
      `${debugNamespace}:http`,
    ]);
    expect(isNamespaceEnabled(`${debugNamespace}:layout`)).to.be.true;
    expect(isNamespaceEnabled(`${debugNamespace}:http`)).to.be.true;
    expect(isNamespaceEnabled(`${debugNamespace}:sitemap`)).to.be.false;
  });

  it('should not enable any scope when DEBUG is not defined', () => {
    expect(enableDebugLogging()).to.deep.equal([]);
    expect(isNamespaceEnabled(`${debugNamespace}:layout`)).to.be.false;
  });

  it('should not enable any scope when DEBUG is empty', () => {
    process.env.DEBUG = ' , ';

    expect(enableDebugLogging()).to.deep.equal([]);
    expect(isNamespaceEnabled(`${debugNamespace}:layout`)).to.be.false;
  });
});
