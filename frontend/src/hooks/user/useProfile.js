import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/useAuth';
import { userApi } from '../../api/user';
import { createCache, cachedFetch, resetCache } from '../../util/cacheManager.js';

const profileCache = createCache(null);

export function useProfile() {
  const [profile, setProfile] = useState(profileCache.data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      if (!user) {
        setProfile(null);
        resetCache(profileCache, null);
        hasInitializedRef.current = false;
        return;
      }

      // If already initialized, use cache
      if (hasInitializedRef.current) {
        setProfile(profileCache.data);
        return;
      }

      setIsLoading(true);

      try {
        await cachedFetch(
          profileCache,
          async () => {
            const { data, error } = await userApi.getProfile();
            if (error) throw new Error(error);
            return data;
          },
          {
            onSuccess: (data) => {
              if (isMounted) {
                setProfile(data);
                setError(null);
                hasInitializedRef.current = true;
              }
            },
            onError: (err) => {
              if (isMounted) {
                setError(err.message);
              }
            }
          }
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await userApi.getProfile();
      
      if (error) throw new Error(error);
      
      profileCache.data = data;
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refreshProfile
  };
}