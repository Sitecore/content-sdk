import { debug } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
} from '@sitecore-content-sdk/core/editing';
import { isOriginAllowed } from '@sitecore-content-sdk/core/utils';
import { EditMode } from '@sitecore-content-sdk/nextjs';
import { getJssEditingSecret } from '@sitecore-content-sdk/nextjs/utils';
import { NextRequest } from 'next/server';
import components from '.sitecore/component-map';
import metadata from '.sitecore/metadata.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get(QUERY_PARAM_EDITING_SECRET);
  const headers = new Headers();

  if (isOriginAllowed(request.headers.get('origin') || '', EDITING_ALLOWED_ORIGINS)) {
    headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT, PATCH');

    // set the allowed headers for preflight requests
    if (request.method === 'OPTIONS') {
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }

  if (request.method === 'OPTIONS') {
    debug.editing('preflight request');
    return Response.json(null, { status: 204, headers });
  }

  if (secret !== getJssEditingSecret()) {
    debug.editing(
      'invalid editing secret - sent "%s" expected "%s"',
      secret,
      getJssEditingSecret()
    );

    return Response.json(
      { message: 'Missing or invalid editing secret' },
      { status: 401, headers }
    );
  }

  const componentList = Array.from(components.keys());

  return Response.json(
    {
      components: componentList,
      packages: metadata.packages,
      editMode: EditMode.Metadata,
    },
    { headers }
  );
}
