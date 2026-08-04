/**
 * Runtime Angular component factory.
 *
 * Compiles a component from its TypeScript source text at runtime, using the same
 * approach as the `ts-parse/angular/ts-compile.ts` experiment:
 *   1. transpile the TS (decorators included) to CommonJS with the TypeScript API,
 *   2. execute the result with `new Function`, injecting a `require` that resolves
 *      imports against the static import map (see ./import-map.ts),
 *   3. return the exported component class. Angular's JIT compiler attaches `ɵcmp`
 *      lazily, so the class is directly renderable via ViewContainerRef / NgComponentOutlet.
 *
 * This is the Angular equivalent of Content SDK's `createComponentInstance`
 * (packages/content/src/editing/codegen/preview.ts), which likewise builds a
 * component from generated code + an import map via `new Function`.
 *
 * NOTES:
 * - Step 3 requires the JIT compiler. `@angular/compiler` must be loaded before
 *   Angular reads `ɵcmp` — the app bootstraps with platform-browser (dev/JIT) or you
 *   can `import '@angular/compiler';` at the entry point.
 * - `typescript` is loaded lazily via dynamic `import()` (browser-only) so the CJS
 *   compiler never enters the SSR/server bundle, where it would reference Node's
 *   `__filename` in ESM scope. The design library is a client-side editor feature,
 *   mirroring Content SDK's `'use client'` DesignLibrary.
 */
import type * as TS from 'typescript';
import { Injectable, type Type } from '@angular/core';
import { ImportEntry, importMap as defaultImportMap } from '.sitecore/import-map';

/** Builds a `require(module)` shim backed by the import map. */
function requireFromImportMap(importMap: ImportEntry[]) {
  return (moduleName: string): Record<string, unknown> => {
    const entry = importMap.find((e) => e.module === moduleName);
    if (!entry) {
      throw new Error(`[DesignLibrary] Module '${moduleName}' is not in the import map`);
    }
    const resolved: Record<string, unknown> = {};
    for (const { name, value } of entry.exports) {
      if (name === '*') Object.assign(resolved, value as object);
      else resolved[name] = value;
    }
    return resolved;
  };
}

/** Picks the component class from a compiled module's exports (default first). */
function pickComponent(exports: Record<string, unknown>): Type<unknown> | undefined {
  const candidates = [exports['default'], ...Object.values(exports)];
  return candidates.find(
    (value): value is Type<unknown> =>
      typeof value === 'function' && ('ɵcmp' in value || 'ɵdir' in value)
  );
}

/**
 * Compiles Angular component source text into a renderable component class.
 * Browser-only: loads `typescript` lazily so it stays out of the SSR bundle.
 * @param source raw TypeScript source of the component (with its `import` statements)
 * @param importMap module registry used to resolve those imports at runtime
 * @throws if the source declares no Angular component, or an import is not in the map
 */
export async function compileComponentFromText(
  source: string,
  importMap: ImportEntry[] = defaultImportMap
): Promise<Type<unknown>> {
  // typescript is CommonJS; dynamic import puts the real API under `.default`
  // (esbuild interop), so unwrap it rather than using the namespace directly.
  const tsModule = (await import('typescript')) as unknown as { default?: typeof TS };
  const ts: typeof TS = tsModule.default ?? (tsModule as unknown as typeof TS);

  const js = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;

  const module = { exports: {} as Record<string, unknown> };
  const evaluate = new Function('exports', 'require', 'module', js);
  evaluate(module.exports, requireFromImportMap(importMap), module);

  const component = pickComponent(module.exports);
  if (!component) {
    throw new Error('[DesignLibrary] Compiled source does not export an Angular component');
  }
  return component;
}

/**
 * Injectable abstraction over {@link compileComponentFromText}: turns component
 * source text into a renderable component class. DesignLibrary depends on this
 * rather than the free function so the compilation strategy (import map, JIT
 * transpile) can be swapped or stubbed via DI, while the renderer keeps ownership
 * of instantiation (`createComponent`).
 */
@Injectable({ providedIn: 'root' })
export class RuntimeCompileComponentFactory {
  /**
   * Compiles Angular component source text into a renderable component class.
   * @see compileComponentFromText
   */
  compile(source: string, importMap: ImportEntry[] = defaultImportMap): Promise<Type<unknown>> {
    return compileComponentFromText(source, importMap);
  }
}
