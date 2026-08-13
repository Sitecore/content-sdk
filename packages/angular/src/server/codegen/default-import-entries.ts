import {
  Component,
  Directive,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  effect,
  input,
  output,
  model,
} from '@angular/core';
import { ImportEntry } from '@sitecore-content-sdk/content/codegen';

/**
 * Default import entries for the Angular import map.
 *
 * These are the framework-baseline runtime values injected into every generated import map so the
 * design library preview can resolve them even when an individual component does not import them
 * directly. Only `@angular/core` primitives are included: unlike Next.js (whose defaults also list
 * the SDK's own React components), the Angular SDK's directives/components live in the primary
 * `@sitecore-content-sdk/angular` entry point and cannot be referenced from this secondary
 * `codegen` entry point without creating a circular entry-point dependency. Those components are
 * surfaced instead through the generated component map and each component's own parsed imports.
 * @public
 */
export const defaultImportEntries: ImportEntry[] = [
  {
    module: '@angular/core',
    exports: [
      { name: 'Component', value: Component },
      { name: 'Directive', value: Directive },
      { name: 'Input', value: Input },
      { name: 'Output', value: Output },
      { name: 'EventEmitter', value: EventEmitter },
      { name: 'ChangeDetectionStrategy', value: ChangeDetectionStrategy },
      { name: 'inject', value: inject },
      { name: 'signal', value: signal },
      { name: 'computed', value: computed },
      { name: 'effect', value: effect },
      { name: 'input', value: input },
      { name: 'output', value: output },
      { name: 'model', value: model },
    ],
  },
];
