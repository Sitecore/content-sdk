---
'create-content-sdk-app': patch
'@sitecore-content-sdk/angular': patch
'@sitecore-content-sdk/nextjs': patch
---

Sitecore webhook revalidation no longer invalidates dictionary data for every configured site on
every call — only an actual Dictionary entry update revalidates its own site's dictionary tag.

`createSitecoreRevalidateRouteHandler` (Next.js) and `createSitecoreRevalidateMiddleware` (Angular)
previously appended a `sc:dict:<site>:<locale>` tag for every site in `sites` on every webhook
call, regardless of what the payload actually changed. Because dictionary data is shared across
nearly every page, this meant any unrelated content update - or even a call with no dictionary
changes at all - revalidated every page for that site and locale, defeating the benefit of
targeted, on-demand revalidation.
