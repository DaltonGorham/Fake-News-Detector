import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/useAuth';
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
          
          return response?.data || [];
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