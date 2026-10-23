---
'create-content-sdk-app': patch
---

[nextjs] Cache Components template: the `getSitecorePage`, `getSitecoreErrorPage` and `getSitecoreDictionary` cache helpers now call `cacheLife('default')` explicitly, as Next.js recommends for every `use cache` scope. Behavior is unchanged (`default` is the implicit profile), but the cache lifetime is now visible at the call site. Change the profile there to tune how long Sitecore content stays cached.
