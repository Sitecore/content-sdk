import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import { draftMode } from 'next/headers';
import { EditingPreviewData } from '../../../../packages/core/editing';

export async function getPreviewData(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const draftModeEnables = (await draftMode()).isEnabled;
  if (!draftModeEnables) {
    return {
      enabled: false,
    };
  }

  const params = await searchParams;

  if (isDesignLibraryPreviewData(params)) {
    return {
      enabled: true,
      data: params,
    };
  }

  return {
    enabled: true,
    data: params as EditingPreviewData,
  };
}
