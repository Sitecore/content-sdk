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
});
