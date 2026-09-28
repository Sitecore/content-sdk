/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  __resetAtomsCssCompiler,
  getAtomsCssCompiler,
  setAtomsCssCompiler,
  AtomsCssCompiler,
} from './atoms-css-compiler-registry';

describe('atoms-css-compiler-registry', () => {
  afterEach(() => {
    __resetAtomsCssCompiler();
  });

  it('returns null when no compiler is registered', () => {
    expect(getAtomsCssCompiler()).to.be.null;
  });

  it('stores and returns the registered compiler', () => {
    const compiler: AtomsCssCompiler = async (classes) => classes.join(',');
    setAtomsCssCompiler(compiler);
    expect(getAtomsCssCompiler()).to.equal(compiler);
  });

  it('invokes the registered compiler with class tokens', async () => {
    const compiler: AtomsCssCompiler = async (classes) => `.${classes[0]}{}`;
    setAtomsCssCompiler(compiler);
    const result = await getAtomsCssCompiler()!(['text-red-500']);
    expect(result).to.equal('.text-red-500{}');
  });

  it('stores the compiler on globalThis so separate bundles share it', () => {
    const compiler: AtomsCssCompiler = async (classes) => classes.join(',');
    setAtomsCssCompiler(compiler);

    // A second copy of this module (Next.js bundles instrumentation, RSC, and
    // Server Actions separately) reaches the same value through the shared symbol.
    const key = Symbol.for('sitecore-content-sdk.atomsCssCompiler');
    expect((globalThis as Record<symbol, unknown>)[key]).to.equal(compiler);

    __resetAtomsCssCompiler();
    expect((globalThis as Record<symbol, unknown>)[key]).to.be.undefined;
  });
});
