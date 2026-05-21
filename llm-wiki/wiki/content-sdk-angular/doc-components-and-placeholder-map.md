# Components, component map, and placeholders (Angular)

Standalone components, generated **component map**, and placeholder resolution aligned with other Content SDK heads.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Standalone components

The Angular template and package assume **standalone** components (no NgModule feature pattern for app components).

## Component map

- Generation is driven from **`sitecore.cli.config.ts`** (same family as Next).
- **`packages/angular/src/tools/generate-map.ts`** implements Angular map generation; output is consumed via **`SITECORE_COMPONENT_MAP`** injection token in **`app.config.ts`** (`useValue: componentMap` from **`.sitecore/component-map`**).

## Placeholders

**`sc-placeholder`** and **`placeholder-utils.ts`** resolve rendering names to standalone components using the same map shape as Next (PascalCase, default + variant files at generation time). Editing mode affects which renderings are exposed (`getPlaceholderRenderings` takes **`isEditing`** from **`SitecoreContextService`** — see [doc-editing-and-page-context-angular.md](doc-editing-and-page-context-angular.md)).

**Related:** [doc-field-directives.md](doc-field-directives.md)
