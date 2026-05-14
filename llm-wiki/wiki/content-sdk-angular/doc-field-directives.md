# Field directives (`@sitecore-content-sdk/angular`)

The PDF marked **Fields** as TBA; the package already ships a small set of **attribute directives** under `packages/angular/src/field-directives/`.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Overview

| Directive | Role |
|-----------|------|
| **`scText`** | Binds **`TextField`** to host text; default **HTML-encode** via `textContent`, optional `innerHTML` when encoding is off. |
| **`scRichText`** | Binds **`TextField`** rich text to **`innerHTML`** using **`DomSanitizer.bypassSecurityTrustHtml`** (CMS HTML). |
| **`scImage`** | Renders **`ImageField`** on **`img`** (src, alt, dimensions when present). |
| **`scLink`** | Anchor from **`LinkField`** / helpers in **`link-field-utils.ts`**. |
| **`scRouterLink`** | Wraps **`RouterLink`** with Sitecore link resolution (internal vs external). |

Specs live alongside each directive (`*.spec.ts`).

## Security note

**`scText`** with **`scTextEncode="false"`** assigns **`innerHTML`** from string values — use only for trusted content. **`scRichText`** intentionally bypasses strict sanitization for typical CMS HTML; follow Sitecore authoring and CSP practices.

**Related:** [doc-components-and-placeholder-map.md](doc-components-and-placeholder-map.md)
