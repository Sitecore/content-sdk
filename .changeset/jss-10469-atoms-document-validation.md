---
'@sitecore-content-sdk/content': minor
---

[JSS-10469] Validate atoms Documents before Design Studio preview render and send structural errors on `atoms:error`

- Run json-render `validateSpec` when a `component:atoms:preview` document arrives
- If validation fails, post the existing `atoms:error` event with `type: 'validation'` and `{ issues, formatted }` so Design Studio can send the payload back to AI
- Valid documents continue through the existing render path; no new inbound event is added
