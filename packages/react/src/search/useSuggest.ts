import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SearchDocument,
  SuggestParameters,
  QuerySuggestionItem,
} from '@sitecore-content-sdk/search';
import { SearchStatus, useSearchService } from './utils';

/**
 * Options for the useSuggest hook.
 * `/v1/search/suggest` accepts only `keyphrase`; `seedItemId` and `seedItemUrl` are not supported.
 * @public
 */
export interface UseSuggestOptions {
  /**
   * Partial text used for typeahead suggestions.
   * Mapped to `keyphrase` on `SearchService.suggest()`.
   * When omitted or whitespace only, no request is sent.
   */
  query?: string;
  /**
   * The ID of the search index to use.
   */
  searchIndexId: string;
  /**
   * Specifies whether the suggest request should automatically run.
   * @default true
   */
  enabled?: boolean;
  /**
   * Specifies whether the previous suggestions should be kept when fetching new results.
   * @default false
   */
  keepPreviousData?: boolean;
  /**
   * The locale to use for the suggest request. Required for multi-locale index configurations.
   * Format: letters and hyphens only (e.g. 'en', 'fr-FR', 'el-GR').
   * Omit for single-locale indexes.
   */
  locale?: string;
}

type InternalSuggestState<T extends SearchDocument = SearchDocument> = {
  /**
   * Autocomplete completions from query suggestion mode.
   */
  querySuggestions: QuerySuggestionItem[];
  /**
   * Document previews from preview results mode.
   */
  previewResults: T[];
  /**
   * The error object if the last suggest request failed, or null if no error occurred.
   */
  error: Error | null;
  /**
   * The status of the suggest request.
   * It will be set to:
   * - 'idle' if no suggest request has been made yet.
   * - 'loading' if a suggest request is currently in progress.
   * - 'success' if a suggest request was successful.
   * - 'error' if a suggest request failed.
   * @default 'idle'
   */
  status: SearchStatus;
  /**
   * The status of the previous suggest request.
   * @default 'idle'
   */
  previousStatus: SearchStatus;
};

/**
 * The state of the useSuggest hook.
 * @public
 */
export type UseSuggestState<T extends SearchDocument = SearchDocument> = Omit<
  InternalSuggestState<T>,
  'previousStatus'
> & {
  /**
   * Whether a suggest request is currently in progress.
   */
  isLoading: boolean;
  /**
   * Whether the suggest request was successful.
   */
  isSuccess: boolean;
  /**
   * Whether the suggest request failed.
   */
  isError: boolean;
  /**
   * Whether the suggestions from the previous query are returned.
   * Will be `true` if `keepPreviousData` is set.
   */
  isPreviousData: boolean;
};

/**
 * React hook for typeahead suggestions via `/v1/search/suggest`.
 * @param {UseSuggestOptions} options - Configuration options for the suggest hook.
 * @returns {UseSuggestState} The suggest state.
 * @throws {Error} if the search index ID is not provided.
 * @public
 */
export const useSuggest = <T extends SearchDocument = SearchDocument>(
  options: UseSuggestOptions
): UseSuggestState<T> => {
  const { query, searchIndexId, enabled = true, keepPreviousData = false, locale } = options;
  const trimmedQuery = typeof query === 'string' ? query.trim() : '';

  const [state, setState] = useState<InternalSuggestState<T>>(() => {
    const error = !searchIndexId
      ? new Error('useSuggest: searchIndexId is required when initializing the hook')
      : null;

    const status = !searchIndexId ? 'error' : 'idle';

    return {
      querySuggestions: [],
      previewResults: [],
      error,
      status,
      previousStatus: 'idle',
    };
  });

  const searchService = useSearchService();
  const abortControllerRef = useRef<AbortController | null>(null);

  const suggest = useCallback(async () => {
    if (!searchService || !searchIndexId) {
      return;
    }

    if (!trimmedQuery) {
      setState((prev) => ({
        querySuggestions: keepPreviousData ? prev.querySuggestions : [],
        previewResults: keepPreviousData ? prev.previewResults : [],
        status: 'idle',
        error: null,
        previousStatus: prev.status,
      }));
      return;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState((prev) => ({
      querySuggestions: keepPreviousData ? prev.querySuggestions : [],
      previewResults: keepPreviousData ? prev.previewResults : [],
      status: 'loading',
      error: null,
      previousStatus: prev.status,
    }));

    try {
      const suggestParams: SuggestParameters = {
        searchIndexId,
        keyphrase: trimmedQuery,
        ...(locale !== undefined && { locale }),
      };

      const { querySuggestions, previewResults } = await searchService.suggest<T>(suggestParams, {
        signal,
      });

      if (signal.aborted) {
        return;
      }

      setState({
        querySuggestions,
        previewResults,
        status: 'success',
        error: null,
        previousStatus: 'success',
      });
    } catch (err) {
      if (signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err : new Error(JSON.stringify(err));
      setState({
        querySuggestions: [],
        previewResults: [],
        status: 'error',
        error: errorMessage,
        previousStatus: 'error',
      });
    }
  }, [searchService, searchIndexId, trimmedQuery, keepPreviousData, locale]);

  useEffect(() => {
    if (enabled) {
      suggest();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [suggest, enabled]);

  return useMemo(
    (): UseSuggestState<T> => ({
      error: state.error,
      querySuggestions: state.querySuggestions,
      previewResults: state.previewResults,
      status: state.status,
      isLoading: state.status === 'loading',
      isSuccess: state.status === 'success',
      isError: state.status === 'error',
      isPreviousData:
        keepPreviousData && state.previousStatus === 'success' && state.status === 'loading',
    }),
    [state, keepPreviousData]
  );
};
