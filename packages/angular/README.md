# Sitecore Content SDK for Angular

Angular SDK for integrating Sitecore XM Cloud with Angular applications.

## Installation

```bash
npm install @sitecore-content-sdk/angular @sitecore-content-sdk/core
```

## Setup

### 1. Configure the Module

Import and configure the `SitecoreContentSdkModule` in your application module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SitecoreContentSdkModule } from '@sitecore-content-sdk/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SitecoreContentSdkModule.forRoot({
      sitecoreEdgeContextId: '<YOUR_CONTEXT_ID>',
      siteName: '<YOUR_SITE_NAME>',
      apiHost: 'https://edge.sitecorecloud.io',
      apiKey: '<YOUR_API_KEY>',
      defaultLanguage: 'en',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 2. Register Components

Create a component map and register it with the `SitecoreService`:

```typescript
import { Component, OnInit, Type } from '@angular/core';
import { SitecoreService, ComponentMap } from '@sitecore-content-sdk/angular';

// Import your Sitecore components
import { HeroComponent } from './components/hero/hero.component';
import { ContentBlockComponent } from './components/content-block/content-block.component';

@Component({
  selector: 'app-root',
  template: `
    <sc-placeholder name="jss-main"></sc-placeholder>
  `,
})
export class AppComponent implements OnInit {
  constructor(private sitecoreService: SitecoreService) {}

  ngOnInit() {
    // Register your components
    const componentMap: ComponentMap = new Map<string, Type<unknown>>([
      ['Hero', HeroComponent],
      ['ContentBlock', ContentBlockComponent],
    ]);

    this.sitecoreService.setComponentMap(componentMap);
  }
}
```

## Components

### Placeholder

Renders Sitecore placeholders dynamically:

```html
<sc-placeholder name="jss-main" [rendering]="route"></sc-placeholder>
```

### Text

Renders text fields:

```html
<sc-text [field]="fields.title" tag="h1"></sc-text>
```

### Rich Text

Renders rich text fields with HTML content:

```html
<sc-rich-text [field]="fields.bodyContent"></sc-rich-text>
```

### Image

Renders image fields with media API support:

```html
<sc-image [field]="fields.heroImage" [imageParams]="{ w: 800, h: 600 }"></sc-image>
```

### Link

Renders link fields:

```html
<sc-link [field]="fields.callToAction">Learn More</sc-link>
```

### Date

Renders date fields with formatting:

```html
<sc-date [field]="fields.publishDate" format="longDate" tag="time"></sc-date>
```

### File

Renders file fields as download links:

```html
<sc-file [field]="fields.document"></sc-file>
```

## Services

### SitecoreService

Core service for managing Sitecore state:

```typescript
import { SitecoreService } from '@sitecore-content-sdk/angular';

@Component({...})
export class MyComponent {
  constructor(private sitecoreService: SitecoreService) {}

  ngOnInit() {
    // Get current route data
    const route = this.sitecoreService.getRouteData();

    // Check if in editing mode
    const isEditing = this.sitecoreService.isEditing();

    // Get current language
    const language = this.sitecoreService.language();
  }
}
```

### AngularLayoutService

Service for fetching layout data:

```typescript
import { AngularLayoutService } from '@sitecore-content-sdk/angular';

@Component({...})
export class MyComponent {
  constructor(private layoutService: AngularLayoutService) {}

  loadPage(path: string) {
    this.layoutService.fetchLayoutData(path).subscribe({
      next: (data) => {
        console.log('Layout data loaded:', data);
      },
      error: (error) => {
        console.error('Error loading layout:', error);
      },
    });
  }
}
```

## Creating Sitecore Components

Create Angular components that receive Sitecore rendering data:

```typescript
import { Component, Input } from '@angular/core';
import {
  ComponentRendering,
  ComponentFields,
  TextField,
  ImageField,
} from '@sitecore-content-sdk/angular';

interface HeroFields extends ComponentFields {
  title: TextField;
  subtitle: TextField;
  backgroundImage: ImageField;
}

@Component({
  selector: 'app-hero',
  template: `
    <section class="hero">
      <sc-image [field]="fields?.backgroundImage" cssClass="hero-bg"></sc-image>
      <div class="hero-content">
        <sc-text [field]="fields?.title" tag="h1"></sc-text>
        <sc-text [field]="fields?.subtitle" tag="p"></sc-text>
      </div>
    </section>
  `,
})
export class HeroComponent {
  @Input() rendering?: ComponentRendering;
  @Input() fields?: HeroFields;
}
```

## Standalone Components

All components in this library are standalone and can be imported directly:

```typescript
import { Component } from '@angular/core';
import { ScTextComponent, ScImageComponent } from '@sitecore-content-sdk/angular';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ScTextComponent, ScImageComponent],
  template: `
    <sc-text [field]="titleField" tag="h2"></sc-text>
    <sc-image [field]="imageField"></sc-image>
  `,
})
export class MyComponent {
  // ...
}
```

## Core Exports

This package re-exports commonly used types and utilities from `@sitecore-content-sdk/core`:

- `LayoutServiceData`, `RouteData`, `ComponentRendering`
- `Field`, `getFieldValue`, `getChildPlaceholder`
- `GraphQLRequestClient`, `CacheClient`
- `mediaApi`, `isEditorActive`
- And more...

## License

Apache-2.0

