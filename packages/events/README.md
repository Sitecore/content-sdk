# events

This package provides browser- and server-side functions to ​capture events in your app and send them to Sitecore. Events are for collecting behavioral data about your users as they interact with your app.

## Installation

```bash
npm install @sitecore-cloudsdk/events
```

## Usage

1. Initialize the package using the `CloudSDK` function, available in the `core` package.
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
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { pageView } from '@sitecore-cloudsdk/events/browser';

export default function Home() {
  useEffect(() => {
    CloudSDK({
      /* Initialization settings. See `core` package code examples. */
    })
      .addEvents()
      .initialize();

    // Send VIEW event:
    pageView();
  }, []);

  return <></>;
}
```

Capture and send a VIEW event from the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { pageView } from '@sitecore-cloudsdk/events/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await CloudSDK(request, response, {
    /* Initialization settings. See `core` package code examples. */
  })
    .addEvents()
    .initialize();

  // Send VIEW event:
  await pageView(request);

  return response;
}
```

## Documentation

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
