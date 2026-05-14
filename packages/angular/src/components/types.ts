import { Type } from '@angular/core';

/**
 * SXA uses a special export name to identify the "default" variant.
 * @public
 */
export const DEFAULT_EXPORT_NAME = 'Default';

export type AngularModule = {
  /** Named variant exports */
  [key: string]: Type<unknown> | undefined;
  /** Default component for this rendering */
  default?: Type<unknown>;
  /** SXA convention: uppercase Default */
  Default?: Type<unknown>;
};

/**
 * An entry in the Angular component map. Maps Sitecore rendering names to Angular component types.
 * Supports SXA rendering variants via named exports alongside a default.
 * @public
 */
export type AngularContentSdkComponent = Type<unknown> | AngularModule;

/**
 * The Angular component map type: maps Sitecore rendering names to standalone component types or SXA variant groups.
 * @public
 */
export type ComponentMap = Map<string, AngularContentSdkComponent>;
