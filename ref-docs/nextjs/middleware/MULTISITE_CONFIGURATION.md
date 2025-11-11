# Multisite Configuration in App Router

## ⚠️ Important Limitation

**Multisite cannot be disabled in App Router applications.** The route structure requires a `[site]` segment: `/[site]/[locale]/[[...path]]`.

## Why It Can't Be Disabled

The App Router route structure is hardcoded at build time: `src/app/[site]/[locale]/[[...path]]/`. Components expect `site` in params, so the `[site]` segment is required.

**If you set `multisite.enabled: false`**:
- ❌ Regular requests: 404 errors (no site segment)
- ✅ Preview/Editing: Still works (middleware bypasses enabled check)

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

### Step 3: Verify

The middleware will always resolve to your single site, achieving single-site behavior without breaking the App Router.

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

## Preview/Editing Modes

Preview and Editing modes always run the middleware (even when `enabled: false`) to preserve site name via cookies. Site name comes from the `sc_site` cookie set by the editing route handler.

**When enabled**: All modes work correctly  
**When disabled**: Preview/Editing work, regular requests break (404)

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

