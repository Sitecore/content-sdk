# events

This package provides browser- and server-side functions to ​capture events in your app and send them to Sitecore. Events are for collecting behavioral data about your users as they interact with your app.

## Installation

```bash
npm install @sitecore-content-sdk/events
```

## Usage

1. Initialize the package using the `initContentSdk` function, available in the `core` package.
2. Send events using the following functions:
   - `pageView` - send a VIEW event.
   - `identity` - send an IDENTITY event.
   - `form` - send a FORM event (browser-side only).
   - `event` - send SC_SEARCH events, other standard events, or a custom event.

## Code examples

Capture and send a VIEW event from the browser side:

```tsx
'use client';

import { useEffect } from 'react';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsBrowserAdapter } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin, pageView } from '@sitecore-content-sdk/events';

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
      ],
    });

    // Send VIEW event:
    pageView();
  }, []);

  return <></>;
}
```

Capture and send a VIEW event from the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin, pageView } from '@sitecore-content-sdk/events';
import { analyticsProxyAdapter } from '@sitecore-content-sdk/nextjs';

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
    ],
  });

  // Send VIEW event:
  await pageView();

  return response;
}
```

## Documentation

[Official Sitecore Content SDK documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
