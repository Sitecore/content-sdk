import { Type } from '@angular/core';

/**
 * Angular component type used as a Sitecore rendering implementation.
 * The component should declare a `rendering` input of type `ComponentRendering`.
 * @public
 */
export type AngularContentSdkComponent = Type<unknown>;

/**
 * Map of Sitecore component names to their Angular component implementations.
 * @public
 */
export type ComponentMap = Map<string, AngularContentSdkComponent>;
