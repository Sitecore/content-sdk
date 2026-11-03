---
'@sitecore-content-sdk/react': patch
---

[Atoms] Fix the Pages editor canvas intermittently becoming unresponsive (nothing can be hovered or selected) on pages with atom-based components. Atoms are no longer remounted when only the identity of `atomsConfig` or of the (deeply equal) component layout changes, and in editing mode the SDK now asks Pages to re-discover chromes after atoms mount or remount.
