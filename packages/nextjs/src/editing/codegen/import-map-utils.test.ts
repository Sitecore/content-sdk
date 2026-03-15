/* eslint-disable quotes */
import { expect } from 'chai';
import { combineImportEntries } from './import-map-utils';
import { ImportEntry } from '@sitecore-content-sdk/content/codegen';

describe('Import Map Utils', () => {
  describe('combineImportEntries', () => {
    const A = 'A';
    const B = 'B';
    const C = 'C';
    const D = 'D';
    const E = 'E';
    it('should combine two import maps', () => {
      const defaultImportEntries: ImportEntry[] = [
        {
          module: 'module-a',
          exports: [
            { name: 'A', value: A },
            { name: 'B', value: B },
          ],
        },
        {
          module: 'module-b',
          exports: [{ name: 'C', value: C }],
        },
      ];
      const generatedImportEntries: ImportEntry[] = [
        {
          module: 'module-b',
          exports: [
            { name: 'C', value: C },
            { name: 'D', value: D },
          ],
        },
        {
          module: 'module-c',
          exports: [{ name: 'E', value: E }],
        },
      ];

      const result = combineImportEntries(defaultImportEntries, generatedImportEntries);

      expect(result).to.deep.include.members([
        {
          module: 'module-a',
          exports: [
            { name: 'A', value: A },
            { name: 'B', value: B },
          ],
        },
        {
          module: 'module-b',
          exports: [
            { name: 'C', value: C },
            { name: 'D', value: D },
          ],
        },
        {
          module: 'module-c',
          exports: [{ name: 'E', value: E }],
        },
      ]);
    });

    it('should prefer values from generated map when export names overlap', () => {
      const A_default = 'A_default';
      const B_default = 'B_default';
      const A_generated = 'A_generated';
      const C_generated = 'C_generated';
      const defaultImportEntries: ImportEntry[] = [
        {
          module: 'module-x',
          exports: [
            { name: 'A', value: A_default },
            { name: 'B', value: B_default },
          ],
        },
      ];
      const generatedImportEntries: ImportEntry[] = [
        {
          module: 'module-x',
          exports: [
            { name: 'A', value: A_generated },
            { name: 'C', value: C_generated },
          ],
        },
      ];

      const result = combineImportEntries(defaultImportEntries, generatedImportEntries);

      // Should use 'A_generated' for 'A', add 'B_default' (not present in generated), and 'C_generated'
      expect(result).to.deep.include({
        module: 'module-x',
        exports: [
          { name: 'A', value: A_generated },
          { name: 'C', value: C_generated },
          { name: 'B', value: B_default },
        ],
      });
    });

    it('should return default map when generated map is empty', () => {
      const defaultImportEntries: ImportEntry[] = [
        {
          module: 'module-a',
          exports: [{ name: 'A', value: A }],
        },
      ];
      const generatedImportEntries: ImportEntry[] = [];

      const result = combineImportEntries(defaultImportEntries, generatedImportEntries);

      expect(result).to.deep.equal(defaultImportEntries);
    });

    it('should return generated map when default map is empty', () => {
      const X = 'X';
      const defaultImportEntries: ImportEntry[] = [];
      const generatedImportEntries: ImportEntry[] = [
        {
          module: 'module-x',
          exports: [{ name: 'Z', value: X }],
        },
      ];

      const result = combineImportEntries(defaultImportEntries, generatedImportEntries);

      expect(result).to.deep.equal(generatedImportEntries);
    });
  });

  describe('Module directives', () => {
    it('should have "use client" directive for React hooks compatibility', () => {
      // Read the source file to verify it starts with "use client"
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'import-map.ts');
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Check if the file starts with 'use client' directive (allowing for whitespace)
      const hasUseClientDirective = /^\s*['"]use client['"];/.test(fileContent);

      expect(hasUseClientDirective).to.equal(true);
    });
  });
});
