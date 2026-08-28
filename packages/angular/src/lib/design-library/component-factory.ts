/**
 * Runtime Angular component factory for the Design Library.
 *
 * Builds a renderable component from a Studio preview payload at runtime, mirroring Content SDK's
 * `createComponentInstance` (packages/content/src/editing/codegen/preview.ts). The payload is
 * **plain JS** — a module body that, given the import map, assigns `exports.component` (a plain class,
 * no decorators) and `exports.metadata` (inline template/styles/inputs).
 *
 * The class is turned into an Angular component by driving the Angular compiler
 *
 * Browser-only: `@angular/compiler` is absent from AOT production bundles, so it is imported lazily
 * and only when a preview is compiled, keeping it out of the main/SSR bundle. The Design Library is a
 * client-side editor feature, mirroring Content SDK's `'use client'` DesignLibrary.
 */
import { Injectable, InjectionToken, type Type, ɵcompileComponent } from '@angular/core';
import type { ImportEntry } from '@sitecore-content-sdk/content/codegen';

/** Cached single load of `@angular/compiler` (its import publishes the JIT compiler facade). */
let compilerReady: Promise<void> | undefined;

/**
 * Ensures `@angular/compiler` is loaded exactly once. Importing it publishes the JIT compiler facade
 * (`ng.ɵcompilerFacade`) as a module side-effect; the promise is cached so concurrent previews share
 * a single lazy chunk.
 * @returns {Promise<void>} resolves once the compiler facade is available.
 */
function ensureAngularCompiler(): Promise<void> {
  return (compilerReady ??= import('@angular/compiler').then(() => undefined));
}

/**
 * Inline component metadata a preview payload provides as data — the object form of what a
 * `@Component({...})` decorator would carry. Templates and styles are always inline (no
 * `templateUrl`/`styleUrls`) so the explicit compile is synchronous and needs no resource loader.
 * @public
 */
export interface DesignLibraryComponentMetadata {
  /** CSS selector for the generated component (optional; a preview renders by class, not tag). */
  selector?: string;
  /** Inline template source. */
  template: string;
  /** Inline styles. */
  styles?: string[];
  /** Declared inputs, as accepted by `@Component.inputs` (e.g. `['fields', 'params']`). */
  inputs?: (string | { name: string; alias?: string })[];
  /** Standalone imports (directives/components/pipes) resolved from the import map. */
  imports?: Type<unknown>[];
}

/**
 * Compiles a Design Library preview payload into a renderable component class.
 *
 * Implemented by {@link RuntimeCompileComponentFactory} and injected via
 * {@link DESIGN_LIBRARY_COMPONENT_FACTORY}. Depending on this abstraction (rather than the concrete
 * class) lets an app swap the compilation strategy — for example to stub it in tests or to plug in a
 * different import-map/compile pipeline — while the renderer keeps ownership of instantiation.
 * @public
 */
export interface DesignLibraryComponentFactory {
  /**
   * Compiles a preview payload into a renderable component class.
   * @param {string} source - the plain-JS payload body (assigns `exports.component`/`exports.metadata`).
   * @param {ImportEntry[]} importMap - module registry used to resolve the payload's imports.
   * @returns {Promise<Type<unknown>>} the compiled, renderable component class.
   */
  compile(source: string, importMap: ImportEntry[]): Promise<Type<unknown>>;
}

/**
 * Default {@link DesignLibraryComponentFactory}: executes the plain-JS preview payload against an
 * import map, then compiles the resulting class explicitly via `@angular/compiler` (JIT).
 *
 * Not self-registered in root — it is provided only through {@link DESIGN_LIBRARY_COMPONENT_FACTORY}
 * (that token is the single injection point). `@Injectable()` is kept without `providedIn` so apps can
 * still override the token with `useClass: RuntimeCompileComponentFactory` or a subclass.
 * @public
 */
@Injectable()
export class RuntimeCompileComponentFactory implements DesignLibraryComponentFactory {
  /**
   * Compiles a preview payload into a renderable component class.
   * Browser-only: loads `@angular/compiler` lazily so it stays out of the SSR/prod bundle.
   * @param {string} source - the plain-JS payload body (assigns `exports.component`/`exports.metadata`).
   * @param {ImportEntry[]} importMap - module registry used to resolve the payload's imports.
   * @returns {Promise<Type<unknown>>} the compiled, renderable component class.
   * @throws if the payload does not provide a component class and metadata, or an import is missing.
   * @public
   */
  async compile(source: string, importMap: ImportEntry[]): Promise<Type<unknown>> {
    // The payload assigns onto the `exports` object we pass in (it doesn't return) — mirror of a
    // CommonJS module. `exports` must be a local we own, not a bare identifier: there is no `exports`
    // global in the browser (ESM), which is exactly what triggered `ReferenceError: exports is not defined`.
    const exports: { component?: Type<unknown>; metadata?: DesignLibraryComponentMetadata } = {};
    const evaluate = new Function('exports', 'imports', source);
    evaluate(exports, this.buildImportsMap(importMap));
    const { component, metadata } = exports;
    if (!component || !metadata) {
      throw new Error(
        '[DesignLibrary] Preview payload must assign `exports.component` and `exports.metadata`'
      );
    }

    await ensureAngularCompiler();

    // Explicit form of the `@Component` decorator: patches `ɵcmp`/`ɵfac` onto the class. Standalone so
    // `NgComponentOutlet` can render it without an NgModule. Synchronous because template/styles are
    // inline (no templateUrl/styleUrls to resolve).
    ɵcompileComponent(component, { standalone: true, ...metadata });

    return component;
  }

  /**
   * Builds the ESM-style `imports` map the payload resolves bare specifiers against: a keyed object of
   * `{ [module]: { [exportName]: value } }`. Accessing a module that is not in the map throws a clear
   * error (via a Proxy) instead of yielding `undefined`.
   * @param {ImportEntry[]} importMap - module registry to expose to the payload.
   * @returns {Record<string, Record<string, unknown>>} the guarded import map object.
   */
  protected buildImportsMap(importMap: ImportEntry[]): Record<string, Record<string, unknown>> {
    const modules: Record<string, Record<string, unknown>> = {};
    for (const entry of importMap) {
      const resolved: Record<string, unknown> = {};
      for (const { name, value } of entry.exports) {
        if (name === '*') Object.assign(resolved, value as object);
        else resolved[name] = value;
      }
      modules[entry.module] = resolved;
    }

    return new Proxy(modules, {
      get(target, prop) {
        if (typeof prop === 'string' && !(prop in target)) {
          throw new Error(`[DesignLibrary] Module '${prop}' is not in the import map`);
        }
        return target[prop as string];
      },
    });
  }
}

/**
 * Injection token for the Design Library {@link DesignLibraryComponentFactory}. Defaults to
 * {@link RuntimeCompileComponentFactory}; override it in an app's providers to supply a custom
 * compilation strategy.
 * @public
 */
export const DESIGN_LIBRARY_COMPONENT_FACTORY = new InjectionToken<DesignLibraryComponentFactory>(
  'DESIGN_LIBRARY_COMPONENT_FACTORY',
  {
    providedIn: 'root',
    // The token is the sole provider: construct the default directly instead of also registering the
    // concrete class in root. This factory runs in an injection context, so a future default that needs
    // DI can use `inject()` in its field initializers without reintroducing a second root registration.
    factory: () => new RuntimeCompileComponentFactory(),
  }
);
