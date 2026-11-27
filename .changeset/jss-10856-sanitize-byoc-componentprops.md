---
'@sitecore-content-sdk/react': patch
---

`BYOCComponent` now drops props whose names start with `on` from the `ComponentProps` rendering parameter, so they are no longer server-rendered as event handler attributes. `ComponentProps` can no longer override props that `BYOCComponent` sets, such as `componentName`, `datasources` and `clientFallback`. `ComponentProps` that are not a JSON object are ignored. A warning lists any dropped props.
