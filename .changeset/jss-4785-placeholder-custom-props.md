---
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/react': patch
---

Honor custom `modifyComponentProps` callbacks in the Next.js `Placeholder` after injecting component data. Use rendering UIDs for placeholder component and error boundary keys, falling back to the layout component name and index when no UID is available.