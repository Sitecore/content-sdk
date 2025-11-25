import { enableDebug } from '@sitecore-content-sdk/nextjs';
import { useInfiniteSearch } from '@sitecore-content-sdk/nextjs/search';
import { useState } from 'react';
import Image from 'next/image';

enableDebug('content-sdk:search');

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${mins}m`;
};

const parseKeywords = (keywords?: string): string[] => {
  if (!keywords) return [];
  try {
    return JSON.parse(keywords);
  } catch {
    return [];
  }
};

type Event = {
  title: string;
  summary: string;
  startDateTime: string;
  venueName: string;
  city: string;
  country: string;
  eventFormat: string;
  cost: string;
  durationMinutes: number;
  keywords: string;
  registrationUrl: string;
  heroImageUrl: string;
  eventType: string;
  sc_item_id: string;
  id: string;
};

const InfiniteSearch = () => {
  const [query, setQuery] = useState('');

  const {
    isLoading,
    isLoadingMore,
    error,
    results,
    loadMore,
    hasNextPage,
    total,
    totalPages,
    isEmpty,
  } = useInfiniteSearch<Event>({
    searchIndexId: '790c2dae-7ea4-402b-819b-fc448ecf5dbc',
    query,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleReset = () => {
    setQuery('');
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search events..."
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p>Loading search results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Error: {error.message}</p>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
          }}
        >
          Reset
        </button>
      </div>
    );
  }

  if (isEmpty && !isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search events..."
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>No search results found.</p>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search events..."
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
            marginBottom: '1rem',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, marginBottom: '0.5rem' }}>
            Search Results
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Showing {results.length} of {total} results
            {totalPages > 1 && ` • ${totalPages} pages available`}
            {isEmpty && ' • No results'}
          </div>
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6b7280';
          }}
        >
          Reset
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem',
        }}
      >
        {results.map((event: Event, index: number) => (
          <div
            key={(event.sc_item_id as string) || (event.id as string) || index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }}
          >
            {event.heroImageUrl && (
              <div
                style={{ width: '100%', height: '200px', position: 'relative', overflow: 'hidden' }}
              >
                <Image
                  src={event.heroImageUrl as string}
                  alt={(event.title as string) || 'Event image'}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            )}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {event.eventType && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {event.eventType}
                </span>
              )}
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '0.75rem',
                  color: '#111827',
                  lineHeight: '1.4',
                }}
              >
                {event.title || 'Untitled Event'}
              </h2>
              {event.summary && (
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {event.summary}
                </p>
              )}
              <div
                style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {event.startDateTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>📅</span>
                      <span style={{ color: '#374151' }}>
                        {formatDate(event.startDateTime as string)}
                      </span>
                    </div>
                  )}
                  {event.venueName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>📍</span>
                      <span style={{ color: '#374151' }}>
                        {event.venueName}
                        {event.city && `, ${event.city}`}
                      </span>
                    </div>
                  )}
                  {event.country && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>🌍</span>
                      <span style={{ color: '#374151' }}>{event.country}</span>
                    </div>
                  )}
                  {event.eventFormat && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>💻</span>
                      <span style={{ color: '#374151' }}>{event.eventFormat}</span>
                    </div>
                  )}
                  {event.cost && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>💰</span>
                      <span style={{ color: '#374151', fontWeight: '600' }}>{event.cost}</span>
                    </div>
                  )}
                  {event.durationMinutes && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#6b7280' }}>⏱️</span>
                      <span style={{ color: '#374151' }}>
                        {formatDuration(event.durationMinutes as number)}
                      </span>
                    </div>
                  )}
                </div>
                {parseKeywords(event.keywords as string).length > 0 && (
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}
                  >
                    {parseKeywords(event.keywords as string).map((keyword, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          borderRadius: '9999px',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                {event.registrationUrl && (
                  <a
                    href={event.registrationUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasNextPage && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '3rem',
          }}
        >
          <button
            onClick={loadMore}
            disabled={isLoadingMore || isLoading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: isLoadingMore || isLoading ? '#e5e7eb' : '#2563eb',
              color: isLoadingMore || isLoading ? '#9ca3af' : '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoadingMore || isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              minWidth: '200px',
            }}
            onMouseEnter={(e) => {
              if (!isLoadingMore && !isLoading) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoadingMore && !isLoading) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {isLoadingMore ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
      {!hasNextPage && results.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          All results loaded ({results.length} of {total})
        </div>
      )}
    </div>
  );
};

export default InfiniteSearch;
