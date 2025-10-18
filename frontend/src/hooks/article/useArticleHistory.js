import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { apiClient } from '../../api/client';

export function useArticleHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data: response, error: apiError } = await apiClient('/api/v1/articles/history', {
        method: 'GET'
      });

      // If no data from API yet, use one mock article
      if (!response?.data || response.data.length === 0) {
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
            source: "Space.com"
          },
          ai_result: {
            id: 201,
            genre: "Science",
            truthness_label: "RELIABLE",
            truthness_score: 0.92,
            related_articles: [],
            article_id: 101,
            ai_id: 1
          }
        }];
        setHistory(mockData);
      } else {
        setHistory(response.data);
      }
    } catch (err) {
      console.error('Error fetching article history:', err);
      setError(err.message || 'Failed to load article history');
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchHistory when user changes or on initial load
  useEffect(() => {
    fetchHistory();
  }, [user]);

  return {
    history,
    isLoading,
    error,
    refreshHistory: fetchHistory
  };
}