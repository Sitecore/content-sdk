# analytics-core

This package provides the analytics core functionality for the Sitecore Content SDK.

## Installation

```bash
npm install @sitecore-content-sdk/analytics-core
```

To use other Content SDK packages, first install them:

```bash
npm install @sitecore-content-sdk/events
npm install @sitecore-content-sdk/personalize
```

## Usage

1. Import the `initContentSdk` function from `@sitecore-content-sdk/core`.
2. Import the plugins and adapters from the packages you want to use.
3. Initialize the Content SDK with the plugins array.

## Code examples

Initialize the Content SDK on the browser side:

```tsx
'use client';

import { useEffect } from 'react';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsBrowserAdapter } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { personalizeBrowserPlugin, personalizeBrowserAdapter } from '@sitecore-content-sdk/personalize';

export default function Home() {
  useEffect(() => {
    initContentSdk({
      config: {
        contextId: '<YOUR_CONTEXT_ID>',
        siteName: '<YOUR_SITE_NAME>',
      },
      plugins: [
        analyticsPlugin({
          options: { enableCookie: true },
          adapter: analyticsBrowserAdapter(),
        }),
        eventsPlugin(),
        personalizeBrowserPlugin({
          options: { enablePersonalizeCookie: true },
          adapter: personalizeBrowserAdapter(),
        }),
      ],
    });
  }, []);

  return <></>;
}
```

Initialize the Content SDK on the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { personalizeServerPlugin } from '@sitecore-content-sdk/personalize';
import { analyticsProxyAdapter, personalizeProxyAdapter } from '@sitecore-content-sdk/nextjs';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  await initContentSdk({
    config: {
      contextId: '<YOUR_CONTEXT_ID>',
      siteName: '<YOUR_SITE_NAME>',
    },
    plugins: [
      analyticsPlugin({
        options: { enableCookie: true },
        adapter: analyticsProxyAdapter(request, response),
      }),
      eventsPlugin(),
      personalizeServerPlugin({
        options: { enablePersonalizeCookie: true },
        adapter: personalizeProxyAdapter(request, response),
      }),
    ],
  });

  return response;
}
```

## Documentation

[Official Sitecore Content SDK documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
