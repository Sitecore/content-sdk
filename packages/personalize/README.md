# personalize

This package provides browser- and server-side functions to run personalizations in your app. Personalization is for showing the most relevant content to your users.

## Installation

```bash
npm install @sitecore-cloudsdk/personalize
```

## Usage

1. Initialize the package using the `CloudSDK` function, available in the `core` package.
2. To run web personalization (browser-side only):
   1. Initialize the `events` package.
   2. Enable web personalization during initialization.
3. To run interactive personalization, use the `personalize` function.

## Code examples

Run personalizations from the browser side:

```ts
'use client';

import { useEffect } from 'react';
import { CloudSDK } from '@sitecore-cloudsdk/core/browser';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';

export default function Home() {
  const getPersonalizeData = async () => {
    // Run interactive personalization:
    const data = await personalize({
      channel: 'WEB',
      currency: 'EUR',
      friendlyId: '<YOUR_EXPERIENCE_FRIENDLY_ID>'
    });

    console.log(data);
  };

  useEffect(() => {
    CloudSDK({
      /* Initialization settings. See `core` package code examples. */
    })
      .addEvents() // Initialize the `events` package to enable web personalization
      .addPersonalize({ enablePersonalizeCookie: true, webPersonalization: true }) // Enable web personalization
      .initialize();

    getPersonalizeData();
  }, []);

  return <></>;
}
```

Run personalizations from the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { CloudSDK } from '@sitecore-cloudsdk/core/server';
import { personalize } from '@sitecore-cloudsdk/personalize/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  await CloudSDK(request, response, {
    /* Initialization settings. See `core` package code examples. */
  })
    .addPersonalize({ enablePersonalizeCookie: true })
    .initialize();

  // Run interactive personalization:
  const data = await personalize(request, {
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: '<YOUR_EXPERIENCE_FRIENDLY_ID>'
  });

  console.log(data);

  return response;
}
```

## Documentation

[Official Sitecore Cloud SDK documentation](https://doc.sitecore.com/xmc/en/developers/sdk/latest/cloud-sdk/index.html)
