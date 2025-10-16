import { useState } from 'react';
import { articleApi } from '../../api';

export function useArticleSubmission() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await articleApi.analyzeArticle(url);
      if (error) throw new Error(error);
      
      // Handle successful analysis
      console.log('Analysis result:', data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    url,
    setUrl,
    handleSubmit,
    loading,
    error
  };
}