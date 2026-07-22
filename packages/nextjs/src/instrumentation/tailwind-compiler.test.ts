/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  compileClassesFromHandle,
  createCachedTailwindCssCompiler,
  loadTailwindCssFile,
  type TailwindCompilerHandle,
} from './tailwind-compiler';

describe('tailwind-compiler (accumulation fix)', () => {
  let tmpDir: string;
  let cssPath: string;
  let handle: TailwindCompilerHandle;

  before(() => {
    // Resolve `@import "tailwindcss"` from the nextjs package (where the dep is installed).
    // Keep the CSS file in a temp dir but use process.cwd() as the compile base.
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'atoms-tw-'));
    cssPath = path.join(tmpDir, 'globals.css');
    const css = '@import "tailwindcss";\n';
    fs.writeFileSync(cssPath, css, 'utf-8');
    handle = { cssPath, base: process.cwd(), css };
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('compileClassesFromHandle emits only the requested classes', async () => {
    const pink100 = await compileClassesFromHandle(handle, ['bg-pink-100']);
    expect(pink100).to.include('pink-100');
    expect(pink100).to.not.include('pink-500');

    const pink500 = await compileClassesFromHandle(handle, ['bg-pink-500']);
    expect(pink500).to.include('pink-500');
    expect(pink500).to.not.include('pink-100');
  });

  it('createCachedTailwindCssCompiler does not leak classes across different class sets', async () => {
    // Write under the package cwd so `@import "tailwindcss"` resolves via node_modules.
    const localCss = path.join(process.cwd(), `.atoms-tw-test-${process.pid}.css`);
    fs.writeFileSync(localCss, '@import "tailwindcss";\n', 'utf-8');

    try {
      const compileCss = createCachedTailwindCssCompiler(localCss);

      const first = await compileCss(['bg-pink-100']);
      expect(first).to.include('pink-100');
      expect(first).to.not.include('pink-500');

      const second = await compileCss(['bg-pink-500']);
      expect(second).to.include('pink-500');
      expect(second).to.not.include('pink-100');

      const firstAgain = await compileCss(['bg-pink-100']);
      expect(firstAgain).to.equal(first);
      expect(firstAgain).to.not.include('pink-500');
    } finally {
      fs.rmSync(localCss, { force: true });
    }
  });

  it('loadTailwindCssFile throws when the CSS file is missing', () => {
    expect(() => loadTailwindCssFile(path.join(tmpDir, 'missing.css'))).to.throw(
      /CSS file not found/
    );
  });
});
