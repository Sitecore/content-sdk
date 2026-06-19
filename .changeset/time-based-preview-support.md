---
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/content': patch
---

Support time-based preview via sc_previewTime query parameter. The editing render endpoint now accepts an optional sc_previewTime query parameter and forwards it as a header to Edge Preview GraphQL, enabling calendar-based content validation at specific future dates.
