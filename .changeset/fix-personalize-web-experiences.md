---
'@sitecore-content-sdk/personalize': patch
---

Fix Sitecore Personalize web experiences not rendering under Content SDK 2.x. When `webPersonalization` is enabled, the personalize browser plugin injects the Sitecore-hosted web personalization library (`cloud-version.min.js` / `cloud-lib.min.js`), which reads a `window.scCloudSDK` global at load time. The Content SDK only set `window.scContentSDK`, so the library threw `Cannot read properties of undefined (reading 'personalize')` and `Cannot read properties of undefined (reading 'getGuestId')`, and no web experiences (banners, popups, takeovers) rendered. The browser plugin now populates `window.scCloudSDK` (`core.getBrowserId`/`core.getGuestId`/`core.settings` and `personalize.settings`) entirely from the Content SDK's own identity functions — no additional Sitecore Edge calls, and nothing outside `@sitecore-content-sdk/*` is used. A `window.scCloudSDK` already registered by another script is left untouched.
