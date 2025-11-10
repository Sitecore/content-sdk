# Multisite Configuration in App Router

## ⚠️ Important Limitation

**Multisite cannot be disabled in App Router applications.** The route structure requires a `[site]` segment: `/[site]/[locale]/[[...path]]`.

## Why It Can't Be Disabled

The App Router route structure is hardcoded at build time:
- Route: `src/app/[site]/[locale]/[[...path]]/`
- Components expect `site` in params: `const { site, locale, path } = await params`

### What Happens If You Try to Disable Multisite

**⚠️ Warning**: Setting `multisite.enabled: false` in App Router will break your application.

**Steps to reproduce the issue** (for testing purposes only):

1. Set `multisite.enabled: false` in `sitecore.config.ts`
2. Make a regular page request (e.g., navigate to `/en/home`)
3. **Result**: 404 error - route doesn't match because `[site]` segment is missing

**What breaks**:
- ❌ All regular page requests return 404
- ❌ Static generation fails
- ❌ Client-side navigation breaks
- ✅ Preview mode still works (middleware bypasses enabled check)
- ✅ Editing mode still works (middleware bypasses enabled check)

**Why it breaks**: The App Router route structure requires `/[site]/[locale]/[[...path]]`, but when disabled, the middleware doesn't add the site segment, so routes don't match.

## Steps to Configure Single-Site Setup

**Note**: Multisite cannot be disabled in App Router. To achieve single-site behavior, follow these steps:

### Step 1: Keep Multisite Enabled

In `sitecore.config.ts`, ensure `multisite.enabled` is `true`:

```typescript
// sitecore.config.ts
export default defineConfig({
  multisite: {
    enabled: true, // ✅ Required - do not set to false
  },
  defaultSite: 'my-site',
  // ... other config
});
```

### Step 2: Configure Single Site

In `.sitecore/sites.json`, configure only one site:

```json
// .sitecore/sites.json
[
  {
    "name": "my-site",
    "hostName": "*",
    "language": "en"
  }
]
```

### Step 3: Verify Configuration

- The middleware will always resolve to your single site
- All requests will use the same site name
- You achieve single-site behavior without breaking the App Router

**Result**: Your application behaves as a single-site setup while maintaining the required route structure.

## Configuration

### `enabled`
- **App Router**: Must be `true` (disabling breaks regular requests)
- **Pages Router**: Can be `false` for single-site
- **Preview/Editing**: Always runs regardless of this setting

### `useCookieResolution`
Function to resolve site from `sc_site` cookie when present.

```typescript
multisite: {
  enabled: true,
  useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
}
```

## Preview/Editing Modes Behavior

### When Multisite is Enabled (`enabled: true`)

| Mode | Middleware Behavior | Site Resolution | Result |
|------|-------------------|-----------------|--------|
| **Preview** | ✅ Runs | From `sc_site` cookie → hostname fallback | ✅ Works correctly |
| **Editing** | ✅ Runs | From `sc_site` cookie → hostname fallback | ✅ Works correctly |
| **Regular** | ✅ Runs | From hostname, query params, or cookie | ✅ Works correctly |

### When Multisite is Disabled (`enabled: false`)

| Mode | Middleware Behavior | Site Resolution | Result |
|------|-------------------|-----------------|--------|
| **Preview** | ✅ Runs (bypasses enabled check) | From `sc_site` cookie → hostname fallback | ✅ Works correctly |
| **Editing** | ✅ Runs (bypasses enabled check) | From `sc_site` cookie → hostname fallback | ✅ Works correctly |
| **Regular** | ❌ Skips | No site segment added | ❌ 404 errors |

**Key Insight**: Preview and Editing modes always require the middleware to run (even when disabled) to preserve site name via cookies for navigation between pages.

### Middleware Adjustments Made

The middleware includes the following adjustments for correct site resolution:

1. **Fallback for missing site cookie**: If `sc_site` cookie is missing in Preview/Editing mode, falls back to hostname resolution instead of crashing
2. **Runtime warning**: Logs a warning when multisite is disabled in App Router to alert developers
3. **Cookie validation**: Validates site cookie presence and provides graceful fallback

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Regular requests return 404 | `enabled: false` in App Router | Set `enabled: true` |
| Preview shows wrong site | Missing/incorrect `sc_site` cookie | Check editing route handler |
| Cookie missing warning | Cookie not set or expired | Verify route handler configuration |

## See Also

- [MultisiteMiddleware](classes/MultisiteMiddleware.md)
- [AppRouterMultisiteMiddleware](classes/AppRouterMultisiteMiddleware.md)
- [MultisiteMiddlewareConfig](type-aliases/MultisiteMiddlewareConfig.md)

