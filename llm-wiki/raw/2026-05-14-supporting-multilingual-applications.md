---
title: Supporting multilingual applications in Content SDK
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/supporting-multilingual-applications-in-content-sdk.html
doc_version: "2.x"
ingested: "2026-05-14"
---

# Multilingual (snapshot)

Uses SitecoreAI content language versioning.

- **Page content:** layout service respects language context; GraphQL uses explicit `language` parameter.
- **Dictionary:** GraphQL-powered API; sample pattern `client.getDictionary({ site: page.siteName, locale: page.locale })`.
- **Routing:** Content SDK does not dictate URL structure; sample apps follow route item hierarchy and may use language prefixes (`/about`, `/en/about`, `/es-US/about`).

Full page: see `source_url`.
