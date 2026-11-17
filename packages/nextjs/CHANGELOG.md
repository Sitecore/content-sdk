# @sitecore-content-sdk/nextjs

## 2.1.2

### Patch Changes

- Prevent and gate remote execution for Design Library server actions while in normal mode ([e9770f1](https://github.com/sitecore/content-sdk/commit/e9770f1f0d225bc9c3e15eef27fc06d3d0299889))

## 2.1.1

### Patch Changes

- [Pages Router] Set auth token in proxy and api route for preview protection ([1b16301](https://github.com/sitecore/content-sdk/commit/1b163014180a4e1fde9ddb926f375505a6cee94c))
- Pass sc_previewMode, sc_site when performing authorization in PreviewProxy ([bac1243](https://github.com/sitecore/content-sdk/commit/bac124307725427b7bee177c877989d7132227fc))
- Check sc_site search parameter in PreviewProxy as a fallback when cookie is missing ([cdaae16](https://github.com/sitecore/content-sdk/commit/cdaae16be53839a740e7e80a274f11bcc7c70efc))
