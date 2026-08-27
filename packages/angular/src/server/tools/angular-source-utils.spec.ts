/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExtractedFileType } from '@sitecore-content-sdk/content/node-tools';

const fsState = vi.hoisted(() => ({
  files: {} as Record<string, string>,
}));

const fsMock = vi.hoisted(() => {
  // Normalize away platform separators + drive letter so posix-keyed fixtures match the
  // native (e.g. Windows `C:\...`) paths produced by path.resolve inside the gatherer.
  const key = (p: unknown) =>
    String(p)
      .replace(/\\/g, '/')
      .replace(/^[a-zA-Z]:/, '');
  return {
    existsSync: vi.fn((p: unknown) =>
      Object.prototype.hasOwnProperty.call(fsState.files, key(p))
    ),
    readFileSync: vi.fn((p: unknown) => fsState.files[key(p)] ?? ''),
  };
});

vi.mock('node:fs', () => fsMock);

import { gatherAngularCompanionFiles } from './angular-source-utils';

const norm = (p: string) =>
  p.replace(/\\/g, '/').replace(/^[a-zA-Z]:/, '');

describe('gatherAngularCompanionFiles', () => {
  const dir = '/app/src/app/components';
  const componentPath = `${dir}/promo.component.ts`;

  beforeEach(() => {
    fsState.files = {};
    fsMock.existsSync.mockClear();
    fsMock.readFileSync.mockClear();
  });

  it('returns nothing for a component with an inline template and styles', () => {
    fsState.files[componentPath] = [
      "import { Component } from '@angular/core';",
      '@Component({ selector: "app-promo", template: "<p>hi</p>", styles: ["p{color:red}"] })',
      'export class PromoComponent {}',
    ].join('\n');

    const result = gatherAngularCompanionFiles(componentPath, 'Promo');
    expect(result).toEqual([]);
  });

  it('gathers external templateUrl and styleUrls that exist on disk', () => {
    const templatePath = `${dir}/promo.component.html`;
    const style1 = `${dir}/promo.component.css`;
    const style2 = `${dir}/promo.theme.css`;
    fsState.files[componentPath] = [
      "import { Component } from '@angular/core';",
      '@Component({',
      '  selector: "app-promo",',
      '  templateUrl: "./promo.component.html",',
      '  styleUrls: ["./promo.component.css", "./promo.theme.css"],',
      '})',
      'export class PromoComponent {}',
    ].join('\n');
    fsState.files[templatePath] = '<p>hi</p>';
    fsState.files[style1] = 'p{color:red}';
    fsState.files[style2] = 'p{color:blue}';

    const result = gatherAngularCompanionFiles(componentPath, 'Promo');
    const byPath = result.map((f) => ({ ...f, path: norm(f.path) }));

    expect(byPath).toEqual([
      {
        name: 'Promo',
        path: norm(templatePath),
        type: ExtractedFileType.Template,
        labels: { componentKey: 'Promo', source: 'promo.component.html' },
      },
      {
        name: 'Promo',
        path: norm(style1),
        type: ExtractedFileType.Style,
        labels: { componentKey: 'Promo', source: 'promo.component.css' },
      },
      {
        name: 'Promo',
        path: norm(style2),
        type: ExtractedFileType.Style,
        labels: { componentKey: 'Promo', source: 'promo.theme.css' },
      },
    ]);
  });

  it('supports the singular styleUrl form', () => {
    const style1 = `${dir}/promo.component.css`;
    fsState.files[componentPath] = [
      "import { Component } from '@angular/core';",
      '@Component({ selector: "app-promo", styleUrl: "./promo.component.css", template: "<p></p>" })',
      'export class PromoComponent {}',
    ].join('\n');
    fsState.files[style1] = 'p{}';

    const result = gatherAngularCompanionFiles(componentPath, 'Promo');
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(ExtractedFileType.Style);
    expect(norm(result[0].path)).toBe(norm(style1));
  });

  it('skips referenced companion files that do not exist on disk', () => {
    fsState.files[componentPath] = [
      "import { Component } from '@angular/core';",
      '@Component({ selector: "app-promo", templateUrl: "./missing.html" })',
      'export class PromoComponent {}',
    ].join('\n');

    const result = gatherAngularCompanionFiles(componentPath, 'Promo');
    expect(result).toEqual([]);
  });

  it('returns nothing when the component file itself is missing', () => {
    const result = gatherAngularCompanionFiles(`${dir}/nope.component.ts`, 'Nope');
    expect(result).toEqual([]);
  });
});
