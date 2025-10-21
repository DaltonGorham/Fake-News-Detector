import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../useAuth';
import { apiClient } from '../../api/client';

/**
 * CACHING STRATEGY (Generated with AI assistance)
 * 
 * This caching solution helps prevent multiple API calls when useArticleHistory() is called
 * by multiple components simultaneously. By deduplicating in-flight requests with
 * initPromise, we ensure only one history API call happens at a time.
 */
const historyCache = { 
  data: [], 
  isInitialized: false, 
  initPromise: null 
};

export function useArticleHistory() {
  const [history, setHistory] = useState(historyCache.data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const hasInitializedRef = useRef(false);

  const fetchHistory = async () => {
    if (!user) {
      setHistory([]);
      historyCache.data = [];
      hasInitializedRef.current = false;
      setIsLoading(false);
      return;
    }

    if (hasInitializedRef.current) {
      setHistory(historyCache.data);
      setIsLoading(false);
      return;
    }

    // If currently initializing, wait for it
    if (historyCache.initPromise) {
      try {
        const data = await historyCache.initPromise;
        setHistory(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);

    const initPromise = (async () => {
      try {
        setError(null);
        
        const { data: response, error: apiError } = await apiClient('/api/v1/articles/history', {
          method: 'GET'
        });
        
        // If no data from API yet, use one mock article
        if (!response || !response.data || response.data.length === 0) {
          const mockData = [{
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
          historyCache.data = mockData;
          setHistory(mockData);
        } else {
          historyCache.data = response.data;
          setHistory(response.data);
        }
        return historyCache.data;
      } catch (err) {
        console.error('Error fetching article history:', err);
        setError(err.message || 'Failed to load article history');
        throw err;
      } finally {
        historyCache.initPromise = null;
        hasInitializedRef.current = true;
        setIsLoading(false);
      }
    })();

    historyCache.initPromise = initPromise;
    return initPromise;
  };

  // Run fetchHistory when user changes or on initial load
  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Manual refresh that clears the cache
  const refreshHistory = async () => {
    hasInitializedRef.current = false;
    historyCache.data = [];
    historyCache.initPromise = null;
    
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