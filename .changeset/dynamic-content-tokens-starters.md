---
'create-content-sdk-app': minor
---

Wire Dynamic Content Tokens into stock starters. Normal Pages SSR, App Router personalized rewrites, Cache Components consumers, and Angular page/404/500 loaders activate token processing (`tokens: {}` or the trusted request map). Preview and Design Library omit tokens. Shared caches store only `deferFinalization` raw pages; visitor values are applied request-locally. Reserved `{{...}}` syntax is processed on all stock-host normal renders. Starter READMEs document reserved syntax, token-only-flow limits, HTML/URL/unclosed-brace rules, error-page `tokens: {}`, and the PersonalizeProxy / `x-sitecore-params` trust boundary.

Regenerating from this template is not required, but existing apps must apply the same `tokens` / finalize / proxy wiring. A package bump without those call-site changes leaves `{{mustache}}` in production HTML.
