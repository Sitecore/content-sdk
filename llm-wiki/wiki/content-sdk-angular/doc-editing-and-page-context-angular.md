# Editing and page context (Angular)

**Status: editing integration is not yet implemented** for the Angular head. This page documents what is currently available.

The PDF marked **Editing** as TBA. In code, editing is surfaced primarily through **`SitecoreContextService`** and layout **`Page.mode`**, not through a separate Next-style middleware document for Angular.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## `SitecoreContextService`

Injectable **`providedIn: 'root'`** with:

- **`page`** — read-only signal of the current **`Page | null`**.
- **`isEditing`** — derived from **`page()?.mode?.isEditing`**.

Call **`setPage(page)`** from the route shell when **`page`** (and other) route data resolves so placeholders, forms, and directives see the same context.

```4:27:packages/angular/src/lib/sitecore-context.service.ts
/**
 * Provides request-scoped Sitecore context (current page, mode flags) to the Angular component tree.
 * Analogous to React's `SitecoreProvider` / `useSitecore()`.
 *
 * Set once per navigation via `setPage(page)` — typically from the route component
 * after the page loader resolves. All consumers (placeholders, field directives, forms)
 * inject this service to read the current page and editing state.
 * @public
 */
@Injectable({ providedIn: 'root' })
export class SitecoreContextService {
  /** Current Sitecore page data (layout + mode). */
  readonly page: Signal<Page | null>;

  /** Whether the current page is in editing mode. */
  readonly isEditing: Signal<boolean>;

  private readonly _page: WritableSignal<Page | null>;

  constructor() {
    const pageSignal = signal<Page | null>(null);
    this._page = pageSignal;
    this.page = pageSignal.asReadonly();
    this.isEditing = computed(() => pageSignal()?.mode?.isEditing ?? false);
  }
```

## Consumers

- **`sc-placeholder`** uses **`isEditing`** when choosing placeholder renderings.
- **`sc-form`** skips certain client behavior when **`isEditing`** is true.
- **`@sitecore-content-sdk/angular`** re-exports **`isEditorActive`** and **`resetEditorChromes`** from **`@sitecore-content-sdk/content/editing`** (implementation: **`packages/content/src/editing/utils.ts`**).

**Related:** [doc-components-and-placeholder-map.md](doc-components-and-placeholder-map.md)
