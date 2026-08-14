/* eslint-disable quotes */
import { expect } from 'chai';

describe('Module directives', () => {
  it('default client import map should have "use client" directive for React hooks compatibility', () => {
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
