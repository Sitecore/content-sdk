import { InjectionToken, Type } from '@angular/core';

/**
 * A map of Sitecore component names to Angular component types.
 * Used by the Placeholder component to dynamically render components.
 * @public
 */
export type ComponentMap = Map<string, Type<unknown>>;

/**
 * Injection token for the component map.
 * Provide this token at the application level with a Map of component names to Angular component types.
 * @public
 */
export const COMPONENT_MAP = new InjectionToken<ComponentMap>('COMPONENT_MAP');

