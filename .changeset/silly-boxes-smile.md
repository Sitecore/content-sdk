---
'@sitecore-content-sdk/react': patch
---

`AppPlaceholder` no longer serializes every rendering's full layout data into the RSC payload.

Each rendering is wrapped in `ErrorBoundary`, a client component, and was handed the complete
`ComponentRendering` object. Anything passed to a client component is serialized into the flight
payload of every page, so each component's resolved datasource, fields and nested placeholders were
shipped to the browser even when the component itself was a server component that rendered them to
HTML. `ErrorBoundary` only ever displays `componentName` and `uid`, so the rendering is now narrowed
to those two fields before being passed.

On a Sitecore-driven homepage with a shared header and footer, this removed 67 KB per prerendered
page (13% of the stored HTML + `.rsc` artifacts) with byte-identical rendered output.
