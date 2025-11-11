import {
  DesignLibraryPreviewError,
  getDesignLibraryComponentPreviewErrorEvent,
} from '@sitecore-content-sdk/core/codegen';

export const sendErrorEvent = (uid: string, error: unknown, type: DesignLibraryPreviewError) => {
  const errorEvent = getDesignLibraryComponentPreviewErrorEvent(uid, error, type);
  console.error('Component Library: sending error event', errorEvent);
  if (typeof window !== 'undefined') {
    const target = window.parent && window.parent !== window ? window.parent : window;
    target.postMessage(errorEvent, '*');
  }
};

export const postToDL = (evt: unknown) => {
  if (typeof window === 'undefined') return;

  const target = window.parent && window.parent !== window ? window.parent : window;

  try {
    console.log('Component Library: sending event', (evt as any)?.name, evt);
    target.postMessage(evt as any, '*');
  } catch (err) {
    console.error('Component Library: postMessage failed', err, evt);
  }
};
