---
'@sitecore-content-sdk/angular': patch
---

`<sc-placeholder-metadata>` now renders with `display: contents`, so components inside a placeholder lay out correctly in flex and grid containers in editing mode.

The wrapper element that emits the Sitecore chrome markers had no styles and therefore rendered as `display: inline`. Inside a flex or grid parent, the wrapper became the flex/grid item instead of the component, so the component's own layout styles (e.g. `display: block`, flex sizing) no longer applied to the parent layout and the page looked different in the Pages editor than in the published site.
