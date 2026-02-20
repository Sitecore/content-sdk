# `@sitecore-content-sdk/angular`

Angular components and utilities for building Sitecore Content SDK applications with Angular 19+.

## Overview

This package provides the same role for Angular apps that `@sitecore-content-sdk/react` plays for
Next.js/React apps — base components, services, and utilities for rendering Sitecore pages with
Angular.

---

## Installation

```bash
yarn add @sitecore-content-sdk/angular
```

Angular core packages must be installed in the **application** (not this package) because they are
`peerDependencies`:

```bash
yarn add @angular/common @angular/core @angular/platform-browser zone.js
```

---

## Quick Start

### 1. Provide the SDK in `app.config.ts`

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideSitecoreAngular } from '@sitecore-content-sdk/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSitecoreAngular({
      api: {
        siteName: 'my-site',
        // ... other SitecoreConfig.api fields
      },
      componentMap: new Map([
        ['Hero', HeroComponent],
        ['Promo', PromoComponent],
      ]),
    }),
  ],
};
```

### 2. Wrap your app with `SitecoreProviderComponent`

```typescript
// app.component.ts
import { Component } from '@angular/core';
import {
  SitecoreProviderComponent,
  PlaceholderComponent,
} from '@sitecore-content-sdk/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SitecoreProviderComponent, PlaceholderComponent],
  template: `
    <sc-sitecore-provider [page]="page" [componentMap]="componentMap">
      <sc-placeholder name="jss-main" [rendering]="page.layout.sitecore.route" />
    </sc-sitecore-provider>
  `,
})
export class AppComponent {
  page = /* fetch from SitecoreClient */;
  componentMap = new Map([['Hero', HeroComponent]]);
}
```

### 3. Access the context in any component

```typescript
import { inject } from '@angular/core';
import { SitecoreContextService } from '@sitecore-content-sdk/angular';

export class MyComponent {
  private ctx = inject(SitecoreContextService);

  // Reactive signals — read in templates or effects
  isEditing = this.ctx.isEditing;   // Signal<boolean>
  page      = this.ctx.page;        // Signal<Page | null>
}
```

---

## Components

| Component | Selector | Description |
|-----------|----------|-------------|
| `SitecoreProviderComponent` | `sc-sitecore-provider` | Root context provider |
| `PlaceholderComponent` | `sc-placeholder` | Renders a Sitecore placeholder |
| `TextComponent` | `sc-text` | Text field with HTML-encoding |
| `RichTextComponent` | `sc-rich-text` | HTML/rich text field |
| `ImageComponent` | `sc-image` | Image field |
| `LinkComponent` | `sc-link` | Link field |
| `FileComponent` | `sc-file` | File download link |
| `DateComponent` | `sc-date` | Date field with optional formatter |
| `MissingComponent` | `sc-missing-component` | Fallback for unregistered components |

All components are **standalone** — import only what you need.

---

## Services

### `SitecoreContextService`

Provides reactive (signal-based) access to the current Sitecore page state throughout the
application. `providedIn: 'root'` — guaranteed single instance.

```typescript
readonly page     : Signal<Page | null>
readonly api      : Signal<SitecoreConfig['api'] | undefined>
readonly isEditing: Signal<boolean>   // computed from page.mode.isEditing
readonly isPreview: Signal<boolean>   // computed from page.mode.isPreview

setPage(page: Page): void
setApi(api: SitecoreConfig['api']): void
```

### `ComponentMapService`

Manages the `ComponentMap` (Sitecore component name → Angular component type).

```typescript
register(name: string, component: Type<unknown>): void
getComponent(name: string): Type<unknown> | undefined
has(name: string): boolean
setComponentMap(map: ComponentMap): void
readonly componentMap: Signal<ComponentMap>
```

---

## SSR Support

All components in this package are SSR-compatible:

- No direct access to `window`, `document`, or `localStorage`.
- `ImageComponent` injects `PLATFORM_ID` and exposes `isServer` for conditional logic.
- Use Angular's `TransferState` in your application to hydrate server-rendered state on the client.

### Example: Server-side data fetching with TransferState

```typescript
// In an Angular SSR app using @angular/platform-server
import { makeStateKey, TransferState } from '@angular/core';
import { SitecoreContextService } from '@sitecore-content-sdk/angular';

const PAGE_KEY = makeStateKey<Page>('sitecore-page');

@Injectable({ providedIn: 'root' })
export class SitecorePageLoader {
  constructor(
    private transferState: TransferState,
    private ctx: SitecoreContextService
  ) {}

  load(page: Page): void {
    if (isPlatformServer(inject(PLATFORM_ID))) {
      this.transferState.set(PAGE_KEY, page);
    } else {
      const cached = this.transferState.get(PAGE_KEY, null);
      if (cached) page = cached;
    }
    this.ctx.setPage(page);
  }
}
```

---

## Monorepo Usage & Singleton Angular Instance

When using this package inside a monorepo (e.g. one that contains both this library and an Angular
application as a sibling workspace), it is critical that **only one copy of each `@angular/*`
package is loaded at runtime**. Multiple instances of `@angular/core` will break the DI system and
cause runtime errors.

### Strategy 1 — Peer dependencies (primary mechanism)

All `@angular/*` packages are declared as `peerDependencies`. Yarn workspaces automatically
hoists them to the workspace root (`<root>/node_modules/@angular/`), so both the app and this
library import the exact same module. No extra configuration is needed for most setups.

### Strategy 2 — Yarn `resolutions` (enforce a single version)

Add version resolutions to the **root `package.json`** to guarantee a single version across every
workspace package:

```json
{
  "resolutions": {
    "@angular/core": "^19.2.0",
    "@angular/common": "^19.2.0",
    "@angular/platform-browser": "^19.2.0",
    "zone.js": "^0.15.0"
  }
}
```

Run `yarn dedupe` after updating resolutions to collapse duplicate copies.

### Strategy 3 — TypeScript `paths` (compile-time alias)

In the root `tsconfig.json`, alias Angular packages to the single hoisted location so TypeScript
always resolves them from one place:

```json
{
  "compilerOptions": {
    "paths": {
      "@angular/core": ["./node_modules/@angular/core"],
      "@angular/common": ["./node_modules/@angular/common"],
      "@angular/common/*": ["./node_modules/@angular/common/*"]
    }
  }
}
```

### Strategy 4 — Jest `moduleNameMapper` (test environment)

The package's `jest.config.js` already maps Angular packages to the workspace root
`node_modules` so that unit tests always use the same Angular instance:

```js
moduleNameMapper: {
  '^@angular/core$': '<rootDir>/../../node_modules/@angular/core',
  // ... (see jest.config.js)
}
```

Add identical mappings in the Angular application's Jest config if it has one.

### Strategy 5 — Webpack / esbuild aliasing (bundler)

When the Angular app uses a custom bundler, mark Angular packages as external or alias them:

```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@angular/core': require.resolve('@angular/core'),
    },
  },
};
```

For **Module Federation** (micro-frontend setups), declare Angular as a singleton shared module:

```js
// webpack.config.js
new ModuleFederationPlugin({
  shared: {
    '@angular/core':            { singleton: true, strictVersion: true },
    '@angular/common':          { singleton: true, strictVersion: true },
    '@angular/platform-browser':{ singleton: true, strictVersion: true },
  },
})
```

### Runtime sanity check

Add a check in your `AppComponent` constructor (development builds only) to detect duplicate
Angular instances early:

```typescript
import { isDevMode, VERSION } from '@angular/core';

if (isDevMode()) {
  const marker = '__sitecore_angular_version__';
  const win = globalThis as Record<string, unknown>;
  if (win[marker] && win[marker] !== VERSION.full) {
    console.error(
      `[Sitecore SDK] Multiple Angular versions detected! ` +
      `App: ${win[marker]}, SDK: ${VERSION.full}. ` +
      `Check your monorepo peer-dependency configuration.`
    );
  }
  win[marker] = VERSION.full;
}
```

---

## License

Apache-2.0 © Sitecore Corporation
