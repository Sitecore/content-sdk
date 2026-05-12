/* eslint-disable quotes */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */

import path from 'path';
import { expect } from 'chai';
import { prepareComponentsForMap, buildComponentMapContent } from './utils';
import type { ComponentFile, ComponentFileWithType, ComponentImport } from './components';

const abs = (p: string) => path.resolve(process.cwd(), p);

// ---------------------------------------------------------------------------
// prepareComponentsForMap
// ---------------------------------------------------------------------------
describe('prepareComponentsForMap', () => {
  describe('includeVariants: false', () => {
    it('should map a standalone component to a single non-spread entry', () => {
      const base: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };

      const entries = prepareComponentsForMap([base], { includeVariants: false });

      expect(entries).to.have.lengthOf(1);
      expect(entries[0].key).to.equal('Button');
      expect(entries[0].valueExpr).to.equal('Button');
      expect(entries[0].imports).to.deep.equal([
        "import * as Button from './src/components/Button';",
      ]);
    });

    it('should mark only client-typed components for componentType annotation, leaving server and universal bare', () => {
      const components: ComponentFileWithType[] = [
        {
          componentName: 'ClientBtn',
          moduleName: 'ClientBtn',
          importPath: './src/components/ClientBtn',
          filePath: abs('src/components/ClientBtn.tsx'),
          componentType: 'client',
        },
        {
          componentName: 'ServerData',
          moduleName: 'ServerData',
          importPath: './src/components/ServerData',
          filePath: abs('src/components/ServerData.tsx'),
          componentType: 'server',
        },
        {
          componentName: 'Universal',
          moduleName: 'Universal',
          importPath: './src/components/Universal',
          filePath: abs('src/components/Universal.tsx'),
          componentType: 'universal',
        },
      ];

      const entries = prepareComponentsForMap(components, {
        includeVariants: false,
        shouldAnnotateClient: true,
      });

      const client = entries.find((e) => e.key === 'ClientBtn')!;
      const server = entries.find((e) => e.key === 'ServerData')!;
      const universal = entries.find((e) => e.key === 'Universal')!;

      expect(client.annotateClient).to.equal(true);
      expect(server.annotateClient).to.equal(false);
      expect(universal.annotateClient).to.equal(false);
    });

    it('should suppress componentType annotation for all types when shouldAnnotateClient is false', () => {
      const comp: ComponentFileWithType = {
        componentName: 'ClientBtn',
        moduleName: 'ClientBtn',
        importPath: './src/components/ClientBtn',
        filePath: abs('src/components/ClientBtn.tsx'),
        componentType: 'client',
      };

      const entries = prepareComponentsForMap([comp], {
        includeVariants: false,
        shouldAnnotateClient: false,
      });

      expect(entries[0].annotateClient).to.equal(false);
    });

    it('should default to no annotation when shouldAnnotateClient is omitted', () => {
      const comp: ComponentFileWithType = {
        componentName: 'ClientBtn',
        moduleName: 'ClientBtn',
        importPath: './src/components/ClientBtn',
        filePath: abs('src/components/ClientBtn.tsx'),
        componentType: 'client',
      };

      const entries = prepareComponentsForMap([comp], { includeVariants: false });

      expect(entries[0].annotateClient).to.equal(false);
    });

    it('should fall back to the first variant file as the map entry when no base component exists', () => {
      const variantOnly: ComponentFileWithType = {
        componentName: 'Button.extra',
        moduleName: 'Buttonextra',
        importPath: './src/components/Button.extra',
        filePath: abs('src/components/Button.extra.tsx'),
        componentType: 'universal',
      };

      const entries = prepareComponentsForMap([variantOnly], { includeVariants: false });

      expect(entries).to.have.lengthOf(1);
      expect(entries[0].key).to.equal('Button');
      expect(entries[0].valueExpr).to.equal('Buttonextra');
    });

    it('should emit only the base component entry when variants exist but includeVariants is false', () => {
      const base: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };
      const variant: ComponentFileWithType = {
        componentName: 'Button.extra',
        moduleName: 'Buttonextra',
        importPath: './src/components/Button.extra',
        filePath: abs('src/components/Button.extra.tsx'),
        componentType: 'universal',
      };

      const entries = prepareComponentsForMap([base, variant], { includeVariants: false });

      expect(entries).to.have.lengthOf(1);
      expect(entries[0].valueExpr).to.equal('Button');
      expect(entries[0].imports).to.deep.equal([
        "import * as Button from './src/components/Button';",
      ]);
    });

    it('should treat same-named components in different directories as distinct map entries', () => {
      const a: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };
      const b: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/other/Button',
        filePath: abs('src/other/Button.tsx'),
        componentType: 'server',
      };

      const entries = prepareComponentsForMap([a, b], { includeVariants: false });
      expect(entries).to.have.lengthOf(2);
    });
  });

  describe('includeVariants: true', () => {
    it('should spread a standalone component into its map entry to support SXA variant merging', () => {
      const base: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };

      const entries = prepareComponentsForMap([base], { includeVariants: true });

      expect(entries).to.have.lengthOf(1);
      expect(entries[0].valueExpr).to.equal('...Button');
    });

    it('should merge variant files with the base into a single spread entry, variants applied first', () => {
      const base: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };
      const variant: ComponentFileWithType = {
        componentName: 'Button.extra',
        moduleName: 'Buttonextra',
        importPath: './src/components/Button.extra',
        filePath: abs('src/components/Button.extra.tsx'),
        componentType: 'universal',
      };

      const entries = prepareComponentsForMap([base, variant], { includeVariants: true });

      expect(entries).to.have.lengthOf(1);
      expect(entries[0].key).to.equal('Button');
      expect(entries[0].valueExpr).to.equal('...Buttonextra, ...Button');
      expect(entries[0].imports).to.include(
        "import * as Buttonextra from './src/components/Button.extra';"
      );
      expect(entries[0].imports).to.include(
        "import * as Button from './src/components/Button';"
      );
    });

    it('should annotate only the group as client when the base component is client-typed, ignoring variant types', () => {
      const clientBase: ComponentFileWithType = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
        componentType: 'client',
      };
      const universalBase: ComponentFileWithType = {
        componentName: 'Link',
        moduleName: 'Link',
        importPath: './src/components/Link',
        filePath: abs('src/components/Link.tsx'),
        componentType: 'universal',
      };

      const entries = prepareComponentsForMap([clientBase, universalBase], {
        includeVariants: true,
        shouldAnnotateClient: true,
      });

      const button = entries.find((e) => e.key === 'Button')!;
      const link = entries.find((e) => e.key === 'Link')!;

      expect(button.annotateClient).to.equal(true);
      expect(link.annotateClient).to.equal(false);
    });

    it('should omit client annotation when the base has no componentType (pages router components)', () => {
      const noType: ComponentFile = {
        componentName: 'Button',
        moduleName: 'Button',
        importPath: './src/components/Button',
        filePath: abs('src/components/Button.tsx'),
      };

      const entries = prepareComponentsForMap([noType], {
        includeVariants: true,
        shouldAnnotateClient: true,
      });

      expect(entries[0].annotateClient).to.equal(false);
    });
  });
});

// ---------------------------------------------------------------------------
// buildComponentMapContent
// ---------------------------------------------------------------------------
describe('buildComponentMapContent', () => {
  it('should emit a valid empty component map with the framework type import', () => {
    const content = buildComponentMapContent([], undefined, { framework: 'nextjs' });

    expect(content).to.include(
      "import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';"
    );
    expect(content).to.include(
      'export const componentMap = new Map<string, NextjsContentSdkComponent>'
    );
    expect(content).to.include('export default componentMap');
  });

  it('should generate a framework-specific type name (e.g. ReactContentSdkComponent for react)', () => {
    const content = buildComponentMapContent([], undefined, { framework: 'react' });
    expect(content).to.include('ReactContentSdkComponent');
  });

  it('should render the built-in import string intact after the framework type import', () => {
    const builtInImports = `\nimport { BYOCWrapper, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';\nimport { Form } from '@sitecore-content-sdk/nextjs';\n`;
    const content = buildComponentMapContent([], undefined, {
      framework: 'nextjs',
      builtInImports,
    });

    expect(content).to.include(
      "import { BYOCWrapper, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';"
    );
    expect(content).to.include("import { Form } from '@sitecore-content-sdk/nextjs';");
  });

  it('should place built-in entries (BYOCWrapper, FEaaSWrapper) before user component entries in the map', () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'MyComp',
          moduleName: 'MyComp',
          importPath: './src/components/MyComp',
          filePath: abs('src/components/MyComp.tsx'),
          componentType: 'server',
        } as ComponentFileWithType,
      ],
      { includeVariants: false }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      builtInMapEntries: [`['BYOCWrapper', BYOCWrapper]`, `['FEaaSWrapper', FEaaSWrapper]`],
    });

    expect(content).to.include("['BYOCWrapper', BYOCWrapper],");
    expect(content).to.include("['FEaaSWrapper', FEaaSWrapper],");
    expect(content.indexOf("'BYOCWrapper'")).to.be.lessThan(content.indexOf("'MyComp'"));
  });

  it("should emit a bare ['Card', Card] entry for server and universal components in the main map", () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'Card',
          moduleName: 'Card',
          importPath: './src/components/Card',
          filePath: abs('src/components/Card.tsx'),
          componentType: 'server',
        } as ComponentFileWithType,
      ],
      { includeVariants: false, shouldAnnotateClient: true }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      isClientMap: false,
    });

    expect(content).to.include("import * as Card from './src/components/Card';");
    expect(content).to.include("['Card', Card],");
    expect(content).to.not.include("componentType: 'client'");
  });

  it("should wrap a client component entry with { ..., componentType: 'client' } in the main map", () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'ClientBtn',
          moduleName: 'ClientBtn',
          importPath: './src/components/ClientBtn',
          filePath: abs('src/components/ClientBtn.tsx'),
          componentType: 'client',
        } as ComponentFileWithType,
      ],
      { includeVariants: false, shouldAnnotateClient: true }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      isClientMap: false,
    });

    expect(content).to.include("['ClientBtn', { ClientBtn, componentType: 'client' }],");
  });

  it('should emit bare entries in the client-only map regardless of componentType', () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'ClientBtn',
          moduleName: 'ClientBtn',
          importPath: './src/components/ClientBtn',
          filePath: abs('src/components/ClientBtn.tsx'),
          componentType: 'client',
        } as ComponentFileWithType,
      ],
      { includeVariants: false, shouldAnnotateClient: true }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      isClientMap: true,
    });

    expect(content).to.not.include("componentType: 'client'");
    expect(content).to.include("['ClientBtn', ClientBtn],");
  });

  it('should wrap a single-spread entry in an object literal { ...Component } to support SXA variant merging', () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: abs('src/components/Button.tsx'),
          componentType: 'universal',
        } as ComponentFileWithType,
      ],
      { includeVariants: true, shouldAnnotateClient: false }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      isClientMap: false,
    });

    expect(content).to.match(/\['Button',\s*\{\s*\.\.\.Button\s*\}\]/);
  });

  it('should merge variant spread and add componentType annotation for a client-typed variant group in the main map', () => {
    const entries = prepareComponentsForMap(
      [
        {
          componentName: 'Button',
          moduleName: 'Button',
          importPath: './src/components/Button',
          filePath: abs('src/components/Button.tsx'),
          componentType: 'client',
        } as ComponentFileWithType,
        {
          componentName: 'Button.extra',
          moduleName: 'Buttonextra',
          importPath: './src/components/Button.extra',
          filePath: abs('src/components/Button.extra.tsx'),
          componentType: 'universal',
        } as ComponentFileWithType,
      ],
      { includeVariants: true, shouldAnnotateClient: true }
    );

    const content = buildComponentMapContent(entries, undefined, {
      framework: 'nextjs',
      isClientMap: false,
    });

    expect(content.replace(/\s+/g, ' ')).to.include(
      "['Button', { ...Buttonextra, ...Button, componentType: 'client' }],"
    );
  });

  it('should import an entire package as wildcard and register it as a single map entry', () => {
    const componentImports: ComponentImport[] = [
      { importName: 'MyLib', importInfo: { importFrom: '@my/lib' } },
    ];

    const content = buildComponentMapContent([], componentImports, { framework: 'nextjs' });

    expect(content).to.include("import * as MyLib from '@my/lib';");
    expect(content).to.include("['MyLib', MyLib],");
  });

  it('should import named exports from a package and register each one as a separate map entry', () => {
    const componentImports: ComponentImport[] = [
      {
        importName: 'OtherLib',
        importInfo: { importFrom: '@other/lib', namedImports: ['CompA', 'CompB'] },
      },
    ];

    const content = buildComponentMapContent([], componentImports, { framework: 'nextjs' });

    expect(content).to.include("import { CompA, CompB } from '@other/lib';");
    expect(content).to.include("['CompA', CompA],");
    expect(content).to.include("['CompB', CompB],");
  });

  it('should include the header comment at the top of the generated file', () => {
    const content = buildComponentMapContent([], undefined, {
      framework: 'nextjs',
      headerComment: 'Client-safe component map for App Router',
    });

    expect(content).to.include('// Client-safe component map for App Router');
  });

  it('should export componentMap as the default export', () => {
    const content = buildComponentMapContent([], undefined, { framework: 'nextjs' });
    expect(content).to.include('export default componentMap');
  });
});
