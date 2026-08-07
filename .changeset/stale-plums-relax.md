---
'@sitecore-content-sdk/react': patch
---

Fix hydration mismatch warnings in Pages Editor for empty placeholders and placeholder/rendering chrome markers, most visibly with `AppPlaceholder` in Next.js App Router. Sitecore Pages attaches chrome attributes (e.g. `cursor: pointer` styling) to these SDK-owned elements directly in the DOM, which can happen before React hydration completes and previously surfaced as a "server rendered HTML didn't match the client" warning. `suppressHydrationWarning` is now set on these editing-only elements, since their DOM is expected to be mutated externally.

Also fixes a separate "Each child in a list should have a unique key prop" warning from the same code path: `AppPlaceholder`'s outer `PlaceholderMetadata` key now falls back to a placeholder-name-based key (`placeholder-metadata-${name}`) when the route rendering has no `uid`.
