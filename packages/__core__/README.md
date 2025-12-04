# core

This package is for initializing the __REPLACE_Cloud__SDK__ and its other packages in your app.

## Installation

```bash
npm install @sitecore-__REPLACE_cloudsdk__/core
```

To initialize other __REPLACE_Cloud__SDK__ packages, first install them:

```bash
npm install @sitecore-__REPLACE_cloudsdk__/events
npm install @sitecore-__REPLACE_cloudsdk__/personalize
npm install @sitecore-__REPLACE_cloudsdk__/search
```

## Usage

1. Import the modules of all installed __REPLACE_Cloud__SDK__ packages that you want to initialize.
2. Initialize the __REPLACE_Cloud__SDK__ and its packages using the `__REPLACE_CloudSDK__` function, available in the `core` package.

## Code examples

Initialize the __REPLACE_Cloud__SDK__ and its packages on the browser side:

```tsx
'use client';

import { useEffect } from 'react';
import { __REPLACE_CloudSDK__ } from '@sitecore-__REPLACE_cloudsdk__/core/browser';
import '@sitecore-__REPLACE_cloudsdk__/events/browser';
import '@sitecore-__REPLACE_cloudsdk__/personalize/browser';

export default function Home() {
  useEffect(() => {
    __REPLACE_CloudSDK__({
      sitecoreEdgeContextId: '<YOUR_CONTEXT_ID>',
      siteName: '<YOUR_SITE_NAME>',
      enableBrowserCookie: true
    })
      .addEvents() // Initialize the `events` package.
      .addPersonalize({
        enablePersonalizeCookie: true,
        webPersonalization: true
      }) // Initialize the `personalize` package and enable web personalization.
      .addSearch() // Initialize the `search` package.
      .initialize();
  }, []);

  return <></>;
}
```

Initialize the __REPLACE_Cloud__SDK__ and its packages on the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { __REPLACE_CloudSDK__ } from '@sitecore-__REPLACE_cloudsdk__/core/server';
import '@sitecore-__REPLACE_cloudsdk__/events/server';
import '@sitecore-__REPLACE_cloudsdk__/personalize/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await __REPLACE_CloudSDK__(request, response, {
    sitecoreEdgeContextId: '<YOUR_CONTEXT_ID>',
    siteName: '<YOUR_SITE_NAME>',
    enableServerCookie: true
  })
    .addEvents() // Initialize the `events` package.
    .addPersonalize({ enablePersonalizeCookie: true }) // Initialize the `personalize` package.
    .addSearch() // Initialize the `search` package.
    .initialize();

  return response;
}
```

## Documentation

[Official Sitecore __REPLACE_Cloud__SDK__ documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
