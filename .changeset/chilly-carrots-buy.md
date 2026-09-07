---
'@sitecore-content-sdk/angular': patch
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/react': patch
---

feat(forms): pass locale language to forms publisher requests in content-sdk

- append optional `language` query param for forms publisher requests
- propagate locale from React and Angular Form components into `loadForm`
- preserve existing behavior when no locale is provided
- add tests for locale propagation and language URL behavior
