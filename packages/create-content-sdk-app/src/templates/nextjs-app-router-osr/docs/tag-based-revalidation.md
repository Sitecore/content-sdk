# Tag-based OSR in this app

Step-by-step guidance and customization live in the Content SDK repository:

**[docs/tag-based-revalidation.md](https://github.com/Sitecore/content-sdk/blob/dev/docs/tag-based-revalidation.md)** (source path in the monorepo: `docs/tag-based-revalidation.md`).

## Quick map

| Piece | Path |
|-------|------|
| Cached page + tags | `src/lib/cache/get-sitecore-page.ts` |
| Cached dictionary + tag | `src/lib/cache/get-sitecore-dictionary.ts` |
| Manual `POST` | `src/app/api/revalidate/route.ts` |
| Webhook `POST` | `src/app/api/revalidate/webhook/route.ts` |

Set **`SITECORE_REVALIDATE_SECRET`** and call the revalidate routes with standard HTTP tooling from the app root (see the main doc).
