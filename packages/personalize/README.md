# personalize

This package provides browser- and server-side functions to run personalizations in your app. Personalization is for showing the most relevant content to your users.

## Installation

```bash
npm install @sitecore-content-sdk/personalize
```

## Usage

1. Initialize the package using the `initContentSdk` function, available in the `core` package.
2. To run web personalization (browser-side only):
   1. Initialize the `events` package.
   2. Enable web personalization during initialization.
3. To run interactive personalization, use the `personalize` function.

## Code examples

Run personalizations from the browser side:

```ts
'use client';

import { useEffect } from 'react';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsBrowserAdapter } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin } from '@sitecore-content-sdk/events';
import { personalizeBrowserPlugin, personalizeBrowserAdapter, personalize } from '@sitecore-content-sdk/personalize';

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
          options: { enablePersonalizeCookie: true, webPersonalization: true },
          adapter: personalizeBrowserAdapter(),
        }),
      ],
    });

    getPersonalizeData();
  }, []);

  return <></>;
}
```

Run personalizations from the server side:

```ts
import type { NextRequest, NextResponse } from 'next/server';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { personalizeServerPlugin, personalize } from '@sitecore-content-sdk/personalize';
import { analyticsProxyAdapter, personalizeProxyAdapter } from '@sitecore-content-sdk/nextjs';

export async function middleware(request: NextRequest) {
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
      personalizeServerPlugin({
        options: { enablePersonalizeCookie: true },
        adapter: personalizeProxyAdapter(request, response),
      }),
    ],
  });

  // Run interactive personalization:
  const data = await personalize({
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: '<YOUR_EXPERIENCE_FRIENDLY_ID>'
  });

  console.log(data);

  return response;
}
```

## Documentation

[Official Sitecore Content SDK documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
