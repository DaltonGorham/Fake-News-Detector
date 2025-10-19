import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { userApi } from '../api/user';

/**
 * CACHING STRATEGY (Generated with AI assistance)
 * 
 * This caching solution helps prevent multiple API calls when useProfile() is called
 * by multiple components simultaneously. By deduplicating in-flight requests with
 * initPromise, we ensure only one profile API call happens at a time.
 */
const profileCache = {
  data: null,
  isInitialized: false,
  initPromise: null
};

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
        profileCache.data = null;
        hasInitializedRef.current = false;
        return;
      }

      // If already initialized, use cache
      if (hasInitializedRef.current) {
        setProfile(profileCache.data);
        setIsLoading(false);
        return;
      }

      // If currently initializing, wait for it
      if (profileCache.initPromise) {
        try {
          const data = await profileCache.initPromise;
          if (isMounted) {
            setProfile(data);
            setIsLoading(false);
          }
        } catch (err) {
          if (isMounted) {
            setError(err.message);
            setIsLoading(false);
          }
        }
        return;
      }

      // Start initialization
      setIsLoading(true);

      const initPromise = (async () => {
        try {
          setError(null);
          const { data, error } = await userApi.getProfile();
          
          if (error) throw error;
          
          profileCache.data = data;
          if (isMounted) {
            setProfile(data);
          }
          return data;
        } catch (err) {
          if (isMounted) {
            setError(err.message);
          }
          throw err;
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
          profileCache.initPromise = null;
          hasInitializedRef.current = true;
        }
      })();

      profileCache.initPromise = initPromise;
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