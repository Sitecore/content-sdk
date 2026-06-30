# create-content-sdk-app

## 2.2.0

### Minor Changes

- Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box.

- [cli][create-content-sdk-app] Update build and component map generation to recreate the .sitecore directory when it is missing. ([0325d61](https://github.com/sitecore/content-sdk/commit/0325d614f670aabc44a25c7deff996ace6a1fe8c))

### Patch Changes

- Remove unused config section from nextjs template package.json to eliminate npm warnings about unknown CLI config settings. ([f81ac30](https://github.com/sitecore/content-sdk/commit/f81ac302196d17f88b825b61a78d1f683cc0cb7b))
- [create-content-sdk-app] Add help flag output ([386c7f8](https://github.com/sitecore/content-sdk/commit/386c7f8bd3745fb4187e490efe4dd14be4a48189))
- Return empty app-router static params when `generateStaticPaths` is false (standard app-router template). Only prepend the configured default site to `sites.json` when `defaultSite` is explicitly set. Cache-components OSR template uses a build-validation site placeholder (`_DEFAULT_`) in `generateStaticParams` when path generation is off so `next build` succeeds without Edge or CMS content. ([2bff473](https://github.com/sitecore/content-sdk/commit/2bff473046a060366910aa0397f8f2e70caf088d))
- [create-content-sdk-app] Fix custom 404 handling in cache-components template ([7d29ee8](https://github.com/sitecore/content-sdk/commit/7d29ee8df75a9fcce488bbf9baac1d82ba219e99))
- Remove dev-mode `tsconfig` path mapping for `react` in the Pages Router template so monorepo `yarn watch` samples resolve `@types/react` and `npm run build` no longer fails with missing React declaration files. ([0c9c855](https://github.com/sitecore/content-sdk/commit/0c9c85549b17bf9449ad041cf3a48f33666a0472))
- Scope Tailwind v4 source scanning to app `src` in App Router templates so monorepo `yarn watch` samples do not hang or fail on `globals.css` when symlinked SDK packages are scanned. ([f28b4a1](https://github.com/sitecore/content-sdk/commit/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e))
- [create-content-sdk-app] Add PartialDesignDynamicPlaceholder to App Router and Pages Router templates for Sitecore AI partial designs ([85b14a9](https://github.com/sitecore/content-sdk/commit/85b14a924e1541b929221c290dd9186542d52050))
- [create-content-sdk][Chore] The template version management has been adjusted for multi-version use ([3f9282b](https://github.com/sitecore/content-sdk/commit/3f9282b10be88272be44a3998ccbb34d4428d66a))
- [create-content-sdk-app] Remove redundant --template from help options ([3631584](https://github.com/sitecore/content-sdk/commit/363158477ed913ddfbe904264deebf83015ebcdb))
- Upgrade glob dependency from deprecated v11 to v13 to resolve security vulnerabilities (CVE-2025-64756) ([debe2bd](https://github.com/sitecore/content-sdk/commit/debe2bd42d32c053245463d40ceb5cb4e1f31690))
- minor `@sitecore-content-sdk/cli` dependency update:
  - [cli][create-content-sdk-app] Update build and component map generation to recreate the .sitecore directory when it is missing. ([0325d61](https://github.com/sitecore/content-sdk/commit/0325d614f670aabc44a25c7deff996ace6a1fe8c))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
- minor `@sitecore-content-sdk/nextjs` dependency update:

  - [nextjs] Add context to nextjs proxies that the developers can use to get information an what was executed inside each proxy ([97ebaca](https://github.com/sitecore/content-sdk/commit/97ebacafeda3114eace6f291c3fbb622e2944a72))
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - [nextjs] Fix sitemap route validation to return undefined for sitemap-index path. ([ecba275](https://github.com/sitecore/content-sdk/commit/ecba2755393ad3977546ad3dd9af18483599661e))
  - [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
  - Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers.

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

- minor `@sitecore-content-sdk/react` dependency update:
  - [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
