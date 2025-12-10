# core

This package is for initializing the Cloud SDK and its other packages in your app.

## Installation

```bash
npm install @sitecore-cloudsdk/core
```

To initialize other Cloud SDK packages, first install them:

```bash
npm install @sitecore-cloudsdk/events
npm install @sitecore-cloudsdk/personalize
npm install @sitecore-cloudsdk/search
```

## Usage

1. Import the modules of all installed Cloud SDK packages that you want to initialize.
2. Initialize the Cloud SDK and its packages using the `CloudSDK` function, available in the `core` package.

## Code examples

Initialize the Cloud SDK and its packages on the browser side:

```tsx
'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import '@sitecore-cloudsdk/events/browser';
import '@sitecore-cloudsdk/personalize/browser';

export default function Home() {
  useEffect(() => {
    CloudSDK({
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

Initialize the Cloud SDK and its packages on the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import '@sitecore-cloudsdk/events/server';
import '@sitecore-cloudsdk/personalize/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await CloudSDK(request, response, {
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

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
