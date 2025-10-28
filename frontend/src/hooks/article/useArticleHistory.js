import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { apiClient } from '../../api/client';
import { createCache, cachedFetch, resetCache } from '../../util/cacheManager.js';

const historyCache = createCache([]);

export function useArticleHistory() {
  const [history, setHistory] = useState(historyCache.data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const hasInitializedRef = useRef(false);

  const fetchHistory = async () => {
    if (!user) {
      setHistory([]);
      resetCache(historyCache, []);
      hasInitializedRef.current = false;
      return;
    }

    if (hasInitializedRef.current) {
      setHistory(historyCache.data);
      return;
    }

    setIsLoading(true);

    try {
      await cachedFetch(
        historyCache,
        async () => {
          const { data: response, error: apiError } = await apiClient('/api/v1/articles/history', {
            method: 'GET'
          });

          if (apiError) throw new Error(apiError);
          
          // If no data from API yet, use one mock article
          if (!response || !response.data || response.data.length === 0) {
            return [{
              id: 1,
              created_at: new Date().toISOString(),
              history_index: 1,
              input_by_user: user?.id,
              article: {
                id: 101,
                published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                collected_date: new Date().toISOString(),
                url: "https://example.com/nasa-mars",
                content: "NASA scientists have discovered evidence of ancient microbial life on Mars...",
                title: "NASA Makes Groundbreaking Discovery on Mars",
                author: "John Smith",
                source: "Space.com",
                ai_result: [{
                  id: 201,
                  genre: "Science",
                  truthness_label: "RELIABLE",
                  truthness_score: 0.92,
                  related_articles: [],
                  article_id: 101,
                  ai_id: 1
                }]
              }
            }];
          }
          
          return response.data;
        },
        {
          onSuccess: (data) => {
            setHistory(data);
            setError(null);
            hasInitializedRef.current = true;
          },
          onError: (err) => {
            setError(err.message || 'Failed to load article history');
          }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchHistory when user changes or on initial load
  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Manual refresh that clears the cache
  const refreshHistory = async () => {
    hasInitializedRef.current = false;
    resetCache(historyCache, []);
    
    try {
      const result = await fetchHistory();
      return result;
    } catch (err) {
      console.error('Refresh error:', err);
      throw err;
    }
  };

  return {
    history,
    isLoading,
    error,
    refreshHistory
  };
}