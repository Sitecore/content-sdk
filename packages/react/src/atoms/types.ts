import type { Catalog, InferCatalogInput } from '@json-render/core';
import type { ComponentRenderer, DefineRegistryResult, ReactSchema } from '@json-render/react';
import { SitecoreComponentMeta } from '@sitecore-content-sdk/content/atoms';

type BaseCatalog = InferCatalogInput<ReactSchema['definition']['catalog']>;
type BaseComponent = BaseCatalog['components'][string];
type BaseAction = BaseCatalog['actions'][string];

/**
 * Utility type that prevents extra keys beyond those defined in `Base`.
 * @internal
 */
export type Exact<T, Base> = T & Record<Exclude<keyof T, keyof Base>, never>;

/**
 * Component definition in the atoms catalog input.
 * @public
 */
export type AtomComponentDefinition = BaseComponent & SitecoreComponentMeta;

/**
 * Action definition in the atoms catalog input.
 * @public
 */
export type AtomActionDefinition = BaseAction;

/**
 * Input shape for defineAtomsCatalog.
 * Extends json-render's base catalog input with Sitecore-specific fields.
 * @public
 */
export type AtomsCatalogInput = BaseCatalog & {
  /** Semver version of the catalog as a whole. Used by the lock file and Design Studio. */
  version?: string;
  /** Component definitions keyed by name. */
  components: Record<string, AtomComponentDefinition>;
  /** Action definitions keyed by name (required). */
  actions: Record<string, AtomActionDefinition>;
};

/**
 * Type alias for the component renderer.
 * @public
 */
export type AtomsComponentRenderer = ComponentRenderer;

/**
 * Component implementations map for defineAtomsRegistry.
 * @public
 */
export type AtomsComponentsMap = Record<string, AtomsComponentRenderer>;

/**
 * Action handler function.
 * @public
 */
export type AtomActionHandler = (params: Record<string, unknown>) => Promise<void> | void;

/**
 * Action implementations map for defineAtomsRegistry.
 * @public
 */
export type AtomsActionsMap = Record<string, AtomActionHandler>;

/**
 * Props the developer passes to the provider for atoms support.
 * @public
 */
export interface AtomsConfig {
  /** The json-render catalog (schema + component/action definitions). */
  catalog: Catalog<any, AtomsCatalogInput>;
  /** The registry result returned by defineAtomsRegistry. */
  registry: DefineRegistryResult;
  /** Optional navigate function to be passed to action handlers for navigation purposes. */
  navigate?: (path: string) => void;
  /**
   * Optional Server Action used to compile Tailwind CSS for dynamic Document class names
   * during editing (Design Library) sessions.
   *
   * Pass `compileCssForDocumentAction` from `@sitecore-content-sdk/nextjs/server-actions`.
   * When provided, `DesignLibraryLowCodeComponent` will inject a scoped `<style>` tag
   * after each Document update so that classes authored in MMS Documents are styled correctly.
   *
   * Has no effect in production; production CSS injection is handled server-side by
   * `StudioComponentServerWrapper` using the compiler registered via `setAtomsCssCompiler`.
   * @example
   * ```tsx
   * // src/Providers.tsx  ('use client')
   * import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';
   *
   * <SitecoreProvider
   *   atomsConfig={{ catalog, registry, navigate, compileCssAction: compileCssForDocumentAction }}
   * />
   * ```
   */
  compileCssAction?: (classes: string[]) => Promise<string>;
}
