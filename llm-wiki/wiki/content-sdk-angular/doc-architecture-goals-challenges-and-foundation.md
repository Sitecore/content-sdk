# Goals, challenges, and foundation (Angular head)

Aligned with the **Goal**, **Challenges**, and **Foundation** sections of the ingested design PDF and with the shipped Angular integration.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Goals

The Angular head is meant to reuse the same Content SDK concepts as other stacks: a shared **Sitecore client**, **component map** (and future **import map** parity), **`sitecore.config`** / CLI tooling, and familiar layout/page data types from `@sitecore-content-sdk/content`.

## Challenges

1. **Bundle shape:** logic that must run only on the server must not be pulled into the browser bundle incorrectly. Loaders and middleware stay on clearly separated paths; loader bodies should use static imports rather than Angular DI when they also run inside Express (see [doc-loaders-outside-angular-di.md](doc-loaders-outside-angular-di.md)).

2. **`process.env` on the client:** the browser bundle does not have Node’s `process.env`. The scaffold mitigates this with a **build-time** script that emits `environment.*.ts` from **`CSDK_PUBLIC_*`** variables (see [doc-environment-and-define-config-angular.md](doc-environment-and-define-config-angular.md)).

## Foundation

The PDF’s “foundation” points at the **loader system**: route **`resolve`** functions backed by a **loader registry**, server execution with **`TransferState`**, and a small **Express** RPC surface for client navigations. That design is implemented under `packages/angular/src/loaders/` and `packages/angular/src/server/loader-data-service-middleware.ts`.

**Next:** [Loaders — routes and registry](doc-loaders-route-registry-and-page-loader.md)
