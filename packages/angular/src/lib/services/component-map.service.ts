import { inject, Injectable, signal, Type } from '@angular/core';
import { COMPONENT_MAP_TOKEN } from '../tokens';
import { ComponentMap } from '../types';

/**
 * Service that manages the mapping of Sitecore component names to their Angular component types.
 *
 * Provided at root level to guarantee a single shared instance. The initial map can be supplied
 * via `COMPONENT_MAP_TOKEN` (set through `provideSitecoreAngular`) or populated at runtime
 * via `register()` / `setComponentMap()`.
 * @example
 * // Register components in app.config.ts via provideSitecoreAngular
 * provideSitecoreAngular({
 *   api: { ... },
 *   componentMap: new Map([['Hero', HeroComponent], ['Promo', PromoComponent]])
 * });
 * @example
 * // Register a component dynamically at runtime
 * inject(ComponentMapService).register('LazyBanner', LazyBannerComponent);
 * @public
 */
@Injectable({ providedIn: 'root' })
export class ComponentMapService {
  readonly _map = signal<ComponentMap>(
    inject(COMPONENT_MAP_TOKEN, { optional: true }) ?? new Map()
  );

  /**
   * Read-only signal exposing the current component map.
   */
  readonly componentMap = this._map.asReadonly();

  /**
   * Replaces the entire component map.
   * @param {ComponentMap} map The new component map.
   */
  setComponentMap(map: ComponentMap): void {
    this._map.set(map);
  }

  /**
   * Registers a single component by name.
   * @param {string} name The Sitecore component name.
   * @param {Type<unknown>} component The Angular component class.
   */
  register(name: string, component: Type<unknown>): void {
    this._map.update((current) => new Map(current).set(name, component));
  }

  /**
   * Returns the Angular component type for the given Sitecore component name,
   * or `undefined` if not registered.
   * @param {string} name The Sitecore component name.
   * @returns {Type<unknown> | undefined}
   */
  getComponent(name: string): Type<unknown> | undefined {
    return this._map().get(name);
  }

  /**
   * Returns whether a component with the given name is registered.
   * @param {string} name The Sitecore component name.
   * @returns {boolean}
   */
  has(name: string): boolean {
    return this._map().has(name);
  }
}
