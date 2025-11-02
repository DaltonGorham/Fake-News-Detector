import { useState } from 'react';
import { articleApi } from '../../api';

export function useArticleSubmission(onSuccess, history = []) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    // Check for duplicate in history before making API call
    const normalizedUrl = url.trim().toLowerCase();
    const isDuplicate = history.some(item => 
      item?.article?.url && item.article.url.toLowerCase() === normalizedUrl
    );
    
    if (isDuplicate) {
      setError('This article has already been analyzed');
      return;
    }

    setError(null);
    setLoading(true);
    const startTime = Date.now();

    try {
      const { data, error } = await articleApi.analyzeArticle(url);
      if (error) throw new Error(error);

      // Ensure minimum 8 seconds for animation to complete
      const elapsed = Date.now() - startTime;
      const minDuration = 8000;
      if (elapsed < minDuration) {
        await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
      }

      setError(null);
      setUrl('');
      setLoading(false);
      
      if (onSuccess) {
        await onSuccess(data);
      }
      
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error('Analysis failed:', err);
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