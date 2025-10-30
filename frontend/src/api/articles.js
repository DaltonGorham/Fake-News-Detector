import { apiClient } from './client';

export const articleApi = {
  // Submit article for analysis
  analyzeArticle: async (url) => {
    if (!url.trim()) {
      return { data: null, error: 'URL is required' };
    }

    if (!url.match(/^https?:\/\/.+/)) {
      return { data: null, error: 'Please enter a valid URL starting with http:// or https://' };
    }

    return await apiClient('/api/v1/articles/analyze', {
      method: 'POST',
      body: JSON.stringify({ url })
    });
  },

  // Get analysis history
  getHistory: async () => {
    return await apiClient('/api/v1/articles/history', {
      method: 'GET'
    });
  },

  // Clear history
  clearHistory: async () => {
    return await apiClient('/api/v1/articles/history', {
      method: 'DELETE'
    });
  },

  // Get specific article analysis
  getAnalysis: async (articleId) => {
    if (!articleId) {
      return { data: null, error: 'Article ID is required' };
    }

    return await apiClient(`/api/v1/articles/${articleId}`, {
      method: 'GET'
    });
  }
};