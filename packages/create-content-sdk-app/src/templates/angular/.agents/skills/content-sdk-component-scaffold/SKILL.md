---
name: content-sdk-component-scaffold
description: Creates new standalone Sitecore components under src/app/components/; map regenerates on dev/build.
---

# Component scaffold (Angular)

**Detail:** [AGENTS-angular-specifics.md#components](../../docs/AGENTS-angular-specifics.md#components)
**Read first:** `src/app/components/partial-design-dynamic-placeholder.component.ts`

## When

- Adding a new Sitecore component from scratch
- User asks for Angular component file structure or inputs

## Rules

- Place components under `src/app/components/`; standalone only, no `NgModule`
- Declare `fields`, `params`, and `rendering` with Angular `input()`
- Add `export default <ClassName>` alongside the named export — the generated map spreads the module
- Selector prefix `app`, kebab-case; class name must match the Sitecore rendering name
- Render fields with `*scText` / `*scRichText` / `*scImage` / `*scLink`, not interpolation
- Map regenerates during `npm run dev` / `npm run build`; run `npm run sitecore-tools:generate-map` if dev is not running

## Stop

- Stop if the component would fetch Sitecore layout itself instead of receiving it through the placeholder

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
