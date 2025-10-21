import { useState } from 'react';
import { articleApi } from '../../api';

export function useArticleSubmission(onSuccess) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await articleApi.analyzeArticle(url);
      if (error) throw new Error(error);

      setError(null);
      setUrl('');
      
      if (onSuccess) {
        await onSuccess(data);
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);
    if (error) {
      setError(null);
    }
  };

  const reset = () => {
    setUrl('');
    setError(null);
    setLoading(false);
  };

  return {
    url,
    setUrl: handleUrlChange,
    loading,
    error,
    handleSubmit,
    reset
  };
}