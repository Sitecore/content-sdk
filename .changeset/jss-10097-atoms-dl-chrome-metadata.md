---
'@sitecore-content-sdk/react': patch
'@sitecore-content-sdk/nextjs': patch
---

[JSS-10097] Emit Design Library chrome metadata for low-code Atoms preview

- Wrap `DesignLibraryLowCodeComponent` with `PlaceholderMetadata` using the layout rendering UID
- Align READY/RENDERED status events with that same UID (same handshake as normal Design Library)
- Pass the editing-placeholder rendering from `DesignLibraryApp` into the low-code path
